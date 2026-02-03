import type {Root} from "mdast"

import type {QuiComment} from "@qualcomm-ui/typedoc-common"

export interface ImportedModule {
  content: string
  path: string
}

export interface ComponentProps {
  input?: PropInfo[]
  name: string
  output?: PropInfo[]
  props?: PropInfo[]
}

export interface DocProps {
  props: Record<string, ComponentProps>
}

export interface PropInfo {
  comment?: QuiComment
  defaultValue?: string
  name: string
  resolvedType?: {
    baseType?: string
    name?: string
    prettyType?: string
    required?: boolean
    type?: string
  }
  type: string
}

export interface SimplifiedProp {
  defaultValue?: string
  description: string
  name: string
  propType?: "input" | "output" | undefined
  required: boolean | undefined
  type: string
}

export interface ProcessedPage {
  content: string
  frontmatter: Record<string, string>
  /** Content before meta blocks are stripped, used for section extraction */
  rawContent: string
  /** AST with data nodes preserved, used for section extraction */
  sectionAst: Root
  title: string
  url: string | undefined
}

export interface MdxFlowExpression {
  type: "mdxFlowExpression"
  value: string
}
