// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ESLintUtils} from "@typescript-eslint/utils"

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-react#${name}`,
)

const QUI_PACKAGES = ["@qualcomm-ui/react", "@qualcomm-ui/react-internal"]
const COMPONENTS_REQUIRING_LABEL = ["IconButton"]

function getAttributeValue(attribute) {
  if (!attribute || !attribute.value) {
    return null
  }
  if (attribute.value.type === "Literal") {
    return attribute.value.value
  }
  if (attribute.value.type === "JSXExpressionContainer") {
    const expression = attribute.value.expression
    if (expression.type === "Literal") {
      return expression.value
    }
    return expression
  }
  return null
}

function hasValidAriaLabel(attributes) {
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

    if (attrName === "aria-label") {
      const value = getAttributeValue(attr)
      if (value !== null && value !== "" && value !== undefined) {
        return true
      }
    }

    if (attrName === "aria-labelledby") {
      const value = getAttributeValue(attr)
      if (value !== null && value !== "" && value !== undefined) {
        return true
      }
    }
  }
  return false
}

export const accessibleName = createRule({
  create(context) {
    const importedComponents = new Map()
    const namespaceImports = new Set()

    return {
      ImportDeclaration(node) {
        const source = node.source.value
        if (!QUI_PACKAGES.includes(source)) {
          return
        }

        for (const specifier of node.specifiers) {
          if (specifier.type === "ImportSpecifier") {
            const importedName = specifier.imported.name
            const localName = specifier.local.name
            if (COMPONENTS_REQUIRING_LABEL.includes(importedName)) {
              importedComponents.set(localName, importedName)
            }
          } else if (specifier.type === "ImportNamespaceSpecifier") {
            namespaceImports.add(specifier.local.name)
          }
        }
      },

      JSXOpeningElement(node) {
        let originalName = null

        if (node.name.type === "JSXIdentifier") {
          const name = node.name.name
          if (importedComponents.has(name)) {
            originalName = importedComponents.get(name)
          }
        } else if (node.name.type === "JSXMemberExpression") {
          const objectName =
            node.name.object.type === "JSXIdentifier"
              ? node.name.object.name
              : null
          const propertyName = node.name.property.name

          if (
            objectName &&
            namespaceImports.has(objectName) &&
            COMPONENTS_REQUIRING_LABEL.includes(propertyName)
          ) {
            originalName = propertyName
          }
        }

        if (!originalName) {
          return
        }

        if (!hasValidAriaLabel(node.attributes)) {
          context.report({
            data: {componentName: originalName},
            messageId: "missingLabel",
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
        "Enforce that certain QUI components have an aria-label or aria-labelledby attribute for accessibility.",
    },
    messages: {
      missingLabel:
        "{{componentName}} must have an aria-label or aria-labelledby attribute for accessibility.",
    },
    schema: [],
    type: "problem",
  },
  name: "accessible-name",
})
