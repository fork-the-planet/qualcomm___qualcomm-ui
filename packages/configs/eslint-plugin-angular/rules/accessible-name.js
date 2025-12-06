// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ESLintUtils} from "@typescript-eslint/utils"

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-angular#${name}`,
)

const DIRECTIVES_REQUIRING_LABEL = ["q-icon-button"]

function hasDirective(node, directiveName) {
  return node.attributes.some((attr) => attr.name === directiveName)
}

function hasValidAriaLabel(node) {
  for (const attr of node.attributes) {
    if (attr.name === "aria-label" || attr.name === "aria-labelledby") {
      if (attr.value && attr.value.trim() !== "") {
        return true
      }
    }
  }

  for (const input of node.inputs) {
    if (input.name === "aria-label" || input.name === "aria-labelledby") {
      return true
    }
  }

  return false
}

export const accessibleName = createRule({
  create(context) {
    const parserServices = context.sourceCode.parserServices

    if (!parserServices || !parserServices.convertElementSourceSpanToLoc) {
      return {}
    }

    return {
      Element(node) {
        const matchedDirective = DIRECTIVES_REQUIRING_LABEL.find((directive) =>
          hasDirective(node, directive),
        )

        if (!matchedDirective) {
          return
        }

        if (!hasValidAriaLabel(node)) {
          context.report({
            data: {componentName: matchedDirective},
            loc: parserServices.convertElementSourceSpanToLoc(context, node),
            messageId: "missingLabel",
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
