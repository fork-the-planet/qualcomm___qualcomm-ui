// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {AST_NODE_TYPES, type TSESTree} from "@typescript-eslint/utils"

export const QUI_PACKAGE_PREFIXES = [
  "@qualcomm-ui/react/",
  "@qualcomm-ui/react-internal/",
] as const

export function isQuiPackage(source: string): boolean {
  return QUI_PACKAGE_PREFIXES.some((prefix) => source.startsWith(prefix))
}

export function getAttributeValue(
  attribute: TSESTree.JSXAttribute,
): unknown | null {
  if (!attribute.value) {
    return null
  }
  if (attribute.value.type === AST_NODE_TYPES.Literal) {
    return attribute.value.value
  }
  if (attribute.value.type === AST_NODE_TYPES.JSXExpressionContainer) {
    const expression = attribute.value.expression
    if (expression.type === AST_NODE_TYPES.Literal) {
      return expression.value
    }
    return expression
  }
  return null
}

export function hasValidAriaLabel(
  attributes: (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)[],
): boolean {
  for (const attr of attributes) {
    if (attr.type !== AST_NODE_TYPES.JSXAttribute || !attr.name) {
      continue
    }
    const attrName =
      attr.name.type === AST_NODE_TYPES.JSXIdentifier
        ? attr.name.name
        : attr.name.type === AST_NODE_TYPES.JSXNamespacedName
          ? `${attr.name.namespace.name}:${attr.name.name.name}`
          : null

    if (attrName === "aria-label" || attrName === "aria-labelledby") {
      const value = getAttributeValue(attr)
      if (value !== null && value !== "" && value !== undefined) {
        return true
      }
    }
  }
  return false
}

export function getJsxElementName(name: TSESTree.JSXOpeningElement["name"]): {
  identifier: string | null
  namespace: string | null
  property: string | null
} {
  if (name.type === AST_NODE_TYPES.JSXIdentifier) {
    return {identifier: name.name, namespace: null, property: null}
  }
  if (name.type === AST_NODE_TYPES.JSXMemberExpression) {
    const property = name.property.name
    if (name.object.type === AST_NODE_TYPES.JSXIdentifier) {
      return {identifier: name.object.name, namespace: null, property}
    }
    if (name.object.type === AST_NODE_TYPES.JSXMemberExpression) {
      if (name.object.object.type === AST_NODE_TYPES.JSXIdentifier) {
        return {
          identifier: name.object.property.name,
          namespace: name.object.object.name,
          property,
        }
      }
    }
  }
  return {identifier: null, namespace: null, property: null}
}
