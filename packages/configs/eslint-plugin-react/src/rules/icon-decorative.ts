// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TSESTree} from "@typescript-eslint/utils"
import {ESLintUtils} from "@typescript-eslint/utils"

import {
  getAttributeValue,
  getJSXElementName,
  hasValidAriaLabel,
  QUI_PACKAGES,
} from "./utils"

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-react#${name}`,
)

const ICON_COMPONENTS = ["Icon"] as const
const PARENT_COMPONENTS = [
  "IconButton",
  "InlineIconButton",
  "Button",
  "HeaderBarActionIconButton",
] as const

type MessageIds = "missingAccessibility"

function hasAriaHidden(
  attributes: (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)[],
): boolean {
  for (const attr of attributes) {
    if (attr.type !== "JSXAttribute" || !attr.name) {
      continue
    }
    const attrName =
      attr.name.type === "JSXIdentifier"
        ? attr.name.name
        : attr.name.type === "JSXNamespacedName"
          ? `${attr.name.namespace.name}:${attr.name.name.name}`
          : null

    if (attrName === "aria-hidden") {
      const value = getAttributeValue(attr)
      if (value === true || value === "true") {
        return true
      }
    }
  }
  return false
}

function getJSXElementComponentName(
  element: TSESTree.JSXElement,
  importedParents: Map<string, string>,
  namespaceImports: Set<string>,
): string | null {
  const {identifier, property} = getJSXElementName(element.openingElement.name)

  if (identifier && !property && importedParents.has(identifier)) {
    return importedParents.get(identifier)!
  }

  if (
    identifier &&
    property &&
    namespaceImports.has(identifier) &&
    PARENT_COMPONENTS.includes(property as (typeof PARENT_COMPONENTS)[number])
  ) {
    return property
  }

  return null
}

function hasAccessibleParent(
  node: TSESTree.JSXOpeningElement,
  importedParents: Map<string, string>,
  namespaceImports: Set<string>,
): boolean {
  let current: TSESTree.Node | undefined = node.parent

  while (current) {
    if (current.type === "JSXElement") {
      const componentName = getJSXElementComponentName(
        current,
        importedParents,
        namespaceImports,
      )

      if (componentName && hasValidAriaLabel(current.openingElement.attributes)) {
        return true
      }
    }
    current = current.parent
  }

  return false
}

export const iconDecorative = createRule<[], MessageIds>({
  create(context) {
    const importedIcons = new Map<string, string>()
    const importedParents = new Map<string, string>()
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
              ICON_COMPONENTS.includes(
                importedName as (typeof ICON_COMPONENTS)[number],
              )
            ) {
              importedIcons.set(localName, importedName)
            }

            if (
              PARENT_COMPONENTS.includes(
                importedName as (typeof PARENT_COMPONENTS)[number],
              )
            ) {
              importedParents.set(localName, importedName)
            }
          } else if (specifier.type === "ImportNamespaceSpecifier") {
            namespaceImports.add(specifier.local.name)
          }
        }
      },

      JSXOpeningElement(node) {
        const {identifier, namespace, property} = getJSXElementName(node.name)
        let originalName: string | null = null

        if (identifier && !property && importedIcons.has(identifier)) {
          originalName = importedIcons.get(identifier)!
        } else if (
          identifier &&
          property &&
          !namespace &&
          namespaceImports.has(identifier) &&
          ICON_COMPONENTS.includes(
            property as (typeof ICON_COMPONENTS)[number],
          )
        ) {
          originalName = property
        }

        if (!originalName) {
          return
        }

        if (hasAccessibleParent(node, importedParents, namespaceImports)) {
          return
        }

        const isDecorative = hasAriaHidden(node.attributes)
        const hasLabel = hasValidAriaLabel(node.attributes)

        if (!isDecorative && !hasLabel) {
          context.report({
            data: {componentName: originalName},
            messageId: "missingAccessibility",
            node,
          })
        }
      },
    }
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Enforce that Icon components are either marked as decorative (aria-hidden) or have an accessible label.",
    },
    messages: {
      missingAccessibility:
        '{{componentName}} must have aria-hidden="true" for decorative icons or aria-label/aria-labelledby for meaningful icons.',
    },
    schema: [],
    type: "problem",
  },
  name: "icon-decorative",
})
