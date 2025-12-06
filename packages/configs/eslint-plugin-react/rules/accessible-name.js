// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ESLintUtils} from "@typescript-eslint/utils"

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-react#${name}`,
)

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

const COMPONENTS_REQUIRING_LABEL = ["IconButton"]

export const accessibleName = createRule({
  create(context) {
    return {
      JSXOpeningElement(node) {
        const elementName =
          node.name.type === "JSXIdentifier"
            ? node.name.name
            : node.name.type === "JSXMemberExpression"
              ? node.name.property.name
              : null

        if (!elementName || !COMPONENTS_REQUIRING_LABEL.includes(elementName)) {
          return
        }

        if (!hasValidAriaLabel(node.attributes)) {
          context.report({
            data: {componentName: elementName},
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
        "Enforce that certain components have an aria-label or aria-labelledby attribute for accessibility.",
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
