// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ESLintUtils} from "@typescript-eslint/utils"

import {getJSXElementName, hasValidAriaLabel, QUI_PACKAGES} from "./utils"

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-react#${name}`,
)

const COMPONENTS_REQUIRING_LABEL = [
  "IconButton",
  "InlineIconButton",
  "HeaderBarActionIconButton",
  "Avatar",
] as const

type MessageIds = "missingLabel"

export const accessibleName = createRule<[], MessageIds>({
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
              COMPONENTS_REQUIRING_LABEL.includes(
                importedName as (typeof COMPONENTS_REQUIRING_LABEL)[number],
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

        if (identifier && !property && importedComponents.has(identifier)) {
          originalName = importedComponents.get(identifier)!
        } else if (
          identifier &&
          property &&
          !namespace &&
          namespaceImports.has(identifier) &&
          COMPONENTS_REQUIRING_LABEL.includes(
            property as (typeof COMPONENTS_REQUIRING_LABEL)[number],
          )
        ) {
          originalName = property
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
