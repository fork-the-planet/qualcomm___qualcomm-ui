// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TSESTree} from "@typescript-eslint/utils"

export const QUI_PACKAGES = [
  "@qualcomm-ui/react",
  "@qualcomm-ui/react-internal",
] as const

export function getAttributeValue(
  attribute: TSESTree.JSXAttribute,
): unknown | null {
  if (!attribute.value) {
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

export function hasValidAriaLabel(
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

    if (attrName === "aria-label" || attrName === "aria-labelledby") {
      const value = getAttributeValue(attr)
      if (value !== null && value !== "" && value !== undefined) {
        return true
      }
    }
  }
  return false
}

export function getJSXElementName(
  name: TSESTree.JSXOpeningElement["name"],
): {identifier: string | null; property: string | null; namespace: string | null} {
  if (name.type === "JSXIdentifier") {
    return {identifier: name.name, namespace: null, property: null}
  }
  if (name.type === "JSXMemberExpression") {
    const property = name.property.name
    if (name.object.type === "JSXIdentifier") {
      return {identifier: name.object.name, namespace: null, property}
    }
    if (name.object.type === "JSXMemberExpression") {
      if (name.object.object.type === "JSXIdentifier") {
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
