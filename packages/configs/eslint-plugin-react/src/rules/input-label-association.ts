// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TSESTree} from "@typescript-eslint/utils"
import {ESLintUtils} from "@typescript-eslint/utils"

import {getJSXElementName, hasValidAriaLabel, QUI_PACKAGES} from "./utils"

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-react#${name}`,
)

const INPUT_COMPONENTS = [
  "TextInput",
  "NumberInput",
  "PasswordInput",
  "Select",
  "Combobox",
  "Slider",
  "Switch",
  "Checkbox",
  "Radio",
] as const

type MessageIds = "missingLabel" | "missingLabelChild"

function isLabelComponent(
  jsxElement: TSESTree.JSXElement,
  localName: string,
  baseComponentName: string,
  namespaceImports: Set<string>,
): boolean {
  const elementName = jsxElement.openingElement.name

  if (elementName.type === "JSXMemberExpression") {
    const objectName =
      elementName.object.type === "JSXIdentifier"
        ? elementName.object.name
        : null
    const propertyName = elementName.property.name

    if (objectName === localName && propertyName === "Label") {
      return true
    }

    if (
      elementName.object.type === "JSXMemberExpression" &&
      elementName.object.object.type === "JSXIdentifier"
    ) {
      const nsName = elementName.object.object.name
      const componentPart = elementName.object.property.name
      if (
        namespaceImports.has(nsName) &&
        componentPart === baseComponentName &&
        propertyName === "Label"
      ) {
        return true
      }
    }
  }

  return false
}

function hasLabelChild(
  node: TSESTree.JSXOpeningElement,
  baseComponentName: string,
  localName: string,
  namespaceImports: Set<string>,
): boolean {
  const parent = node.parent
  if (!parent || parent.type !== "JSXElement") {
    return false
  }

  for (const child of parent.children) {
    if (child.type === "JSXElement") {
      if (
        isLabelComponent(child, localName, baseComponentName, namespaceImports)
      ) {
        return true
      }
    }
  }

  return false
}

export const inputLabelAssociation = createRule<[], MessageIds>({
  create(context) {
    const importedComponents = new Map<string, string>()
    const namespaceImports = new Set<string>()

    return {
      ImportDeclaration(node) {
        const source = node.source.value
        if (!QUI_PACKAGES.includes(source as (typeof QUI_PACKAGES)[number])) {
          return
        }

        for (const specifier of node.specifiers) {
          if (specifier.type === "ImportSpecifier") {
            const importedName =
              specifier.imported.type === "Identifier"
                ? specifier.imported.name
                : specifier.imported.value
            const localName = specifier.local.name
            if (
              INPUT_COMPONENTS.includes(
                importedName as (typeof INPUT_COMPONENTS)[number],
              )
            ) {
              importedComponents.set(localName, importedName)
            }
          } else if (specifier.type === "ImportNamespaceSpecifier") {
            namespaceImports.add(specifier.local.name)
          }
        }
      },

      JSXOpeningElement(node) {
        const {identifier, namespace, property} = getJSXElementName(node.name)
        let originalName: string | null = null
        let localName: string | null = null
        let isCompoundRoot = false

        if (identifier && !property && importedComponents.has(identifier)) {
          originalName = importedComponents.get(identifier)!
          localName = identifier
        } else if (
          identifier &&
          property === "Root" &&
          !namespace &&
          importedComponents.has(identifier)
        ) {
          originalName = importedComponents.get(identifier)!
          localName = identifier
          isCompoundRoot = true
        } else if (
          identifier &&
          property &&
          property !== "Root" &&
          !namespace &&
          namespaceImports.has(identifier) &&
          INPUT_COMPONENTS.includes(
            property as (typeof INPUT_COMPONENTS)[number],
          )
        ) {
          originalName = property
          localName = property
        } else if (
          namespace &&
          identifier &&
          property === "Root" &&
          namespaceImports.has(namespace) &&
          INPUT_COMPONENTS.includes(
            identifier as (typeof INPUT_COMPONENTS)[number],
          )
        ) {
          originalName = identifier
          localName = identifier
          isCompoundRoot = true
        }

        if (!originalName || !localName) {
          return
        }

        if (hasValidAriaLabel(node.attributes)) {
          return
        }

        if (isCompoundRoot) {
          if (hasLabelChild(node, originalName, localName, namespaceImports)) {
            return
          }
        }

        context.report({
          data: {componentName: originalName},
          messageId: isCompoundRoot ? "missingLabelChild" : "missingLabel",
          node,
        })
      },
    }
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Enforce that form input components have proper label association for accessibility.",
    },
    messages: {
      missingLabel:
        "{{componentName}} must have an aria-label or aria-labelledby attribute for accessibility.",
      missingLabelChild:
        "{{componentName}}.Root must have a {{componentName}}.Label child or aria-label/aria-labelledby attribute for accessibility.",
    },
    schema: [],
    type: "problem",
  },
  name: "input-label-association",
})
