import type {Element, Root, Text} from "hast"
import {fromHtml} from "hast-util-from-html"
import {toHtml} from "hast-util-to-html"
import {readFile} from "node:fs/promises"
import postcss, {type Rule} from "postcss"
import selectorParser from "postcss-selector-parser"
import type {ShikiTransformer} from "shiki"
import {compile} from "tailwindcss"
import {visit} from "unist-util-visit"

import {camelCase} from "@qualcomm-ui/utils/change-case"

declare const createRequire: NodeRequire

async function loadStylesheetContent(id: string): Promise<string> {
  const resolveId = id === "tailwindcss" ? "tailwindcss/index.css" : id

  let resolvedPath: string
  if (typeof createRequire !== "undefined") {
    resolvedPath = createRequire(import.meta.url).resolve(resolveId)
  } else {
    const createRequire = await import("node:module").then(
      (module) => module.createRequire,
    )
    resolvedPath = createRequire(import.meta.url).resolve(resolveId)
  }
  return readFile(resolvedPath, "utf-8")
}

function getClassValue(node: Element): string | null {
  const val = node.properties?.className ?? node.properties?.class
  if (!val) {
    return null
  }
  return Array.isArray(val) ? val.join(" ") : String(val)
}

/**
 * Extract class names from the text content of a HAST tree.
 * Looks for string literals that could be Tailwind class names.
 */
export function extractClassesFromHast(tree: Root): string[] {
  const classes = new Set<string>()
  const stringLiteralPattern = /["'`]([^"'`]+)["'`]/g

  visit(tree, "text", (node: Text) => {
    const text = node.value
    let match
    while ((match = stringLiteralPattern.exec(text)) !== null) {
      const content = match[1]
      const tokens = content.split(/\s+/).filter(Boolean)
      for (const token of tokens) {
        classes.add(token)
      }
    }
  })

  return [...classes]
}

export function extractClasses(source: string): string[] {
  const tree = fromHtml(source, {fragment: true})
  const classes = new Set<string>()

  visit(tree, "element", (node: Element) => {
    const value = getClassValue(node)
    if (value) {
      classes.add(value)
    }
  })

  return classes
    .values()
    .toArray()
    .map((value) => value.split(" "))
    .flat()
}

const compilerCache = new Map<string, {build(candidates: string[]): string}>()

async function getCompiler(styles: string) {
  let compiler = compilerCache.get(styles)
  if (!compiler) {
    compiler = await compile(styles, {
      loadStylesheet: async (id: string, base: string) => {
        const content = await loadStylesheetContent(id)
        return {
          base,
          content,
          path: `virtual:${id}`,
        }
      },
    })
    compilerCache.set(styles, compiler)
  }
  return compiler
}

interface SelectorAnalysis {
  /** The class name if it's a simple class selector */
  className: string | null
  /** Whether this selector can be inlined (single class, no pseudo/combinators) */
  inlineable: boolean
}

/**
 * Analyze a CSS selector using postcss-selector-parser AST.
 * Returns whether it can be inlined and extracts the class name.
 */
function analyzeSelector(selector: string): SelectorAnalysis {
  let inlineable = true
  let className: string | null = null

  const processor = selectorParser((selectors) => {
    if (selectors.nodes.length !== 1) {
      inlineable = false
      return
    }

    const selectorNode = selectors.nodes[0]
    if (selectorNode.nodes.length !== 1) {
      inlineable = false
      return
    }

    const node = selectorNode.nodes[0]
    if (node.type !== "class") {
      inlineable = false
      return
    }

    className = node.value

    selectorNode.walk((n) => {
      if (
        n.type === "pseudo" ||
        n.type === "combinator" ||
        n.type === "nesting" ||
        n.type === "attribute"
      ) {
        inlineable = false
      }
    })
  })

  processor.processSync(selector)

  return {className, inlineable}
}

interface ParsedRule {
  className: string
  declarations: string
  inlineable: boolean
  originalRule: string
}

/**
 * Parse compiled CSS and extract rules with their inlineability status.
 */
function parseCompiledCss(css: string): ParsedRule[] {
  const rules: ParsedRule[] = []
  const root = postcss.parse(css)

  function processRule(rule: Rule, insideAtRule: boolean) {
    const {className, inlineable} = analyzeSelector(rule.selector)

    if (!className) {
      return
    }

    let hasNestedAtRule = false
    rule.walkAtRules(() => {
      hasNestedAtRule = true
    })

    const declarations: string[] = []
    rule.each((node) => {
      if (node.type === "decl") {
        declarations.push(`${node.prop}: ${node.value}`)
      }
    })

    if (declarations.length === 0 && !hasNestedAtRule) {
      return
    }

    rules.push({
      className,
      declarations: declarations.join("; "),
      inlineable: inlineable && !insideAtRule && !hasNestedAtRule,
      originalRule: rule.toString(),
    })
  }

  root.walkAtRules("layer", (atRule) => {
    atRule.walkRules((rule) => {
      const parent = rule.parent
      const insideNestedAtRule =
        parent?.type === "atrule" && (parent as postcss.AtRule).name !== "layer"
      processRule(rule, insideNestedAtRule)
    })

    atRule.walkAtRules((nested) => {
      if (nested.name !== "layer") {
        nested.walkRules((rule) => {
          processRule(rule, true)
        })
      }
    })
  })

  root.walkRules((rule) => {
    if (rule.parent?.type === "root") {
      processRule(rule, false)
    }
  })

  return rules
}

/**
 * Build residual CSS from non-inlineable rules, stripping @layer wrappers.
 */
function buildResidualCss(css: string, inlineableClasses: Set<string>): string {
  const root = postcss.parse(css)
  const residualRules: string[] = []

  function shouldKeepRule(rule: Rule): boolean {
    const {className} = analyzeSelector(rule.selector)
    return className !== null && !inlineableClasses.has(className)
  }

  root.walkAtRules("layer", (atRule) => {
    if (atRule.params !== "utilities") {
      return
    }

    atRule.each((node) => {
      if (node.type === "rule") {
        const rule = node
        if (shouldKeepRule(rule)) {
          residualRules.push(rule.toString())
        }
      }
    })
  })

  return residualRules.join("\n\n")
}

export interface TransformResult {
  /** CSS for non-inlineable rules without @layer wrappers */
  css: string
  /** HTML with inline styles applied */
  html: string
}

/**
 * Transform HTML by inlining Tailwind styles where possible.
 * Non-inlineable styles (pseudo-classes, media queries, etc.) are returned as CSS.
 */
export async function transformWithInlineStyles(
  html: string,
  styles: string,
): Promise<TransformResult> {
  const compiler = await getCompiler(styles)
  const allClasses = extractClasses(html)
  const compiledCss = compiler.build(allClasses)
  const parsedRules = parseCompiledCss(compiledCss)

  const inlineableStyles = new Map<string, string>()
  const inlineableClasses = new Set<string>()

  for (const rule of parsedRules) {
    if (rule.inlineable) {
      inlineableStyles.set(rule.className, rule.declarations)
      inlineableClasses.add(rule.className)
    }
  }

  const residualCss = buildResidualCss(compiledCss, inlineableClasses)
  const tree = fromHtml(html, {fragment: true})

  visit(tree, "element", (node: Element) => {
    const classValue = getClassValue(node)
    if (!classValue) {
      return
    }

    const classes = classValue.split(/\s+/)
    const inlineStyles: string[] = []
    const remainingClasses: string[] = []

    for (const cls of classes) {
      const style = inlineableStyles.get(cls)
      if (style) {
        inlineStyles.push(style)
      } else {
        remainingClasses.push(cls)
      }
    }

    if (inlineStyles.length > 0) {
      const existingStyle = node.properties?.style as string | undefined
      const newStyle = inlineStyles.join("; ")
      node.properties = node.properties ?? {}
      node.properties.style = existingStyle
        ? `${existingStyle}; ${newStyle}`
        : newStyle
    }

    if (remainingClasses.length > 0) {
      node.properties = node.properties ?? {}
      node.properties.className = remainingClasses
    } else if (node.properties) {
      delete node.properties.className
      delete node.properties.class
    }
  })

  return {
    css: residualCss,
    html: toHtml(tree),
  }
}

export interface ShikiTailwindTransformerOptions {
  /**
   * Callback invoked with CSS for non-inlineable classes (hover:, sm:, etc.).
   * Called after each transformation with deduplicated CSS rules.
   */
  onResidualCss?: (css: string) => void
  /**
   * Output format for inline styles.
   * - "html": `style="display: flex"` (HTML string syntax)
   * - "jsx": `style={{ display: 'flex' }}` (JSX object syntax)
   * @default "html"
   */
  styleFormat?: "html" | "jsx"
  /** Tailwind CSS styles to compile against */
  styles: string
}

interface CompileClassesResult {
  inlineStyles: string[]
  remainingClasses: string[]
  residualRules: Map<string, string>
}

/**
 * Compile classes and return inline styles, remaining classes, and residual CSS
 * rules.
 */
function compileClasses(
  classes: string[],
  compiler: {build(candidates: string[]): string},
): CompileClassesResult {
  const compiledCss = compiler.build(classes)
  const parsedRules = parseCompiledCss(compiledCss)

  const inlineableStyles = new Map<string, string>()
  const residualRules = new Map<string, string>()

  for (const rule of parsedRules) {
    if (rule.inlineable) {
      inlineableStyles.set(rule.className, rule.declarations)
    } else {
      residualRules.set(rule.className, rule.originalRule)
    }
  }

  const inlineStyles: string[] = []
  const remainingClasses: string[] = []

  for (const cls of classes) {
    const style = inlineableStyles.get(cls)
    if (style) {
      inlineStyles.push(style)
    } else {
      remainingClasses.push(cls)
    }
  }

  return {inlineStyles, remainingClasses, residualRules}
}

/**
 * Get concatenated text content from a line element.
 */
function getLineText(lineElement: Element): string {
  let text = ""
  visit({children: [lineElement], type: "root"}, "text", (node: Text) => {
    text += node.value
  })
  return text
}

/**
 * Convert CSS declarations to JSX object syntax.
 * `"display: flex; align-items: center"` -> `"{ display: 'flex', alignItems:
 * 'center'}"`
 */
function cssToJsxObject(cssDeclarations: string[]): string {
  const props = cssDeclarations
    .flatMap((decl) => {
      return decl
        .split(";")
        .map((d) => d.trim())
        .filter(Boolean)
    })
    .map((declaration) => {
      const colonIndex = declaration.indexOf(":")
      if (colonIndex === -1) {
        return null
      }
      const prop = declaration.slice(0, colonIndex).trim()
      const value = declaration.slice(colonIndex + 1).trim()
      const camelProp = camelCase(prop)
      return `${camelProp}: '${value}'`
    })
    .filter(Boolean)

  return `{ ${props.join(", ")} }`
}

interface LineReplacementsResult {
  replacements: Map<string, string>
  residualRules: Map<string, string>
}

/**
 * Transform className attributes to style attributes in a line's text.
 * Returns replacements and residual CSS rules for non-inlineable classes.
 */
function computeLineReplacements(
  lineText: string,
  compiler: {build(candidates: string[]): string},
  styleFormat: "html" | "jsx" = "html",
): LineReplacementsResult {
  const replacements = new Map<string, string>()
  const allResidualRules = new Map<string, string>()
  const classAttrPattern = /(className|class)=(["'`])([^"'`]*)\2/g
  let match

  while ((match = classAttrPattern.exec(lineText)) !== null) {
    const fullMatch = match[0]
    const attrName = match[1]
    const quote = match[2]
    const classValue = match[3]

    const classes = classValue.split(/\s+/).filter(Boolean)
    if (classes.length === 0) {
      continue
    }

    const {inlineStyles, remainingClasses, residualRules} = compileClasses(
      classes,
      compiler,
    )

    for (const [className, rule] of residualRules) {
      allResidualRules.set(className, rule)
    }

    if (inlineStyles.length === 0) {
      continue
    }

    let replacement: string
    if (styleFormat === "jsx") {
      const jsxStyleObj = cssToJsxObject(inlineStyles)
      replacement = `style={${jsxStyleObj}}`
    } else {
      replacement = `style=${quote}${inlineStyles.join("; ")}${quote}`
    }

    if (remainingClasses.length > 0) {
      replacement += ` ${attrName}=${quote}${remainingClasses.join(" ")}${quote}`
    }

    replacements.set(fullMatch, replacement)
  }

  return {replacements, residualRules: allResidualRules}
}

/**
 * Apply text replacements to a line element's text nodes.
 * This handles the case where the pattern spans multiple text nodes.
 */
function applyReplacementsToLine(
  lineElement: Element,
  replacements: Map<string, string>,
): void {
  if (replacements.size === 0) {
    return
  }

  const textSegments: {end: number; node: Text; start: number}[] = []
  let position = 0

  visit({children: [lineElement], type: "root"}, "text", (node: Text) => {
    const start = position
    const end = position + node.value.length
    textSegments.push({end, node, start})
    position = end
  })

  const fullText = textSegments.map((s) => s.node.value).join("")

  for (const [original, replacement] of replacements) {
    const matchStart = fullText.indexOf(original)
    if (matchStart === -1) {
      continue
    }

    const matchEnd = matchStart + original.length

    for (const segment of textSegments) {
      const {end, node, start} = segment

      if (end <= matchStart || start >= matchEnd) {
        continue
      }

      const overlapStart = Math.max(0, matchStart - start)
      const overlapEnd = Math.min(node.value.length, matchEnd - start)

      const before = node.value.slice(0, overlapStart)
      const after = node.value.slice(overlapEnd)

      if (start <= matchStart && matchStart < end) {
        node.value = before + replacement + after
      } else {
        node.value = before + after
      }
    }
  }
}

/**
 * Replace class strings with inline styles in HAST text nodes.
 * Works at the line level to handle Shiki's tokenization.
 * Returns all residual CSS rules for non-inlineable classes.
 */
function replaceClassesWithInlineStyles(
  tree: Root,
  compiler: {build(candidates: string[]): string},
  styleFormat: "html" | "jsx" = "html",
): Map<string, string> {
  const allResidualRules = new Map<string, string>()

  visit(tree, "element", (element: Element) => {
    const className = element.properties?.className
    const classAttr = element.properties?.class

    const isLine =
      (Array.isArray(className) && className.includes("line")) ||
      (typeof className === "string" && className.includes("line")) ||
      (Array.isArray(classAttr) && classAttr.includes("line")) ||
      (typeof classAttr === "string" && classAttr.includes("line"))

    if (!isLine) {
      return
    }

    const lineText = getLineText(element)
    const {replacements, residualRules} = computeLineReplacements(
      lineText,
      compiler,
      styleFormat,
    )

    for (const [cls, rule] of residualRules) {
      allResidualRules.set(cls, rule)
    }

    applyReplacementsToLine(element, replacements)
  })

  return allResidualRules
}

/**
 * Create a Shiki transformer that inlines Tailwind styles.
 * Must be called with `await` before using the transformer.
 */
export async function createShikiTailwindTransformer(
  options: ShikiTailwindTransformerOptions,
): Promise<ShikiTransformer> {
  const {onResidualCss, styleFormat = "html", styles} = options
  const compiler = await getCompiler(styles)

  return {
    enforce: "post",
    name: "shiki-transformer-tailwind-to-inline",
    root(hast) {
      const residualRules = replaceClassesWithInlineStyles(
        hast,
        compiler,
        styleFormat,
      )

      if (onResidualCss && residualRules.size > 0) {
        const css = [...residualRules.values()].join("\n\n")
        onResidualCss(css)
      }
    },
  }
}
