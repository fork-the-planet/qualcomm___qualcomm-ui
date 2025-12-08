// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ESLintUtils} from "@typescript-eslint/utils"

import {hasDirective, hasValidAriaLabel, type TemplateNode} from "./utils"

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-angular#${name}`,
)

const DIRECTIVES_REQUIRING_LABEL = [
  "q-icon-button",
  "q-inline-icon-button",
] as const

type MessageIds = "missingLabel"

export const accessibleName = createRule<[], MessageIds>({
  create(context) {
    const parserServices = context.sourceCode.parserServices as
      | {
          convertElementSourceSpanToLoc?: (
            context: unknown,
            node: unknown,
          ) => {
            end: {column: number; line: number}
            start: {column: number; line: number}
          }
        }
      | undefined

    if (!parserServices || !parserServices.convertElementSourceSpanToLoc) {
      return {}
    }

    const convertLoc = parserServices.convertElementSourceSpanToLoc

    return {
      Element(node: TemplateNode) {
        const matchedDirective = DIRECTIVES_REQUIRING_LABEL.find((directive) =>
          hasDirective(node, directive),
        )

        if (!matchedDirective) {
          return
        }

        if (!hasValidAriaLabel(node)) {
          context.report({
            data: {componentName: matchedDirective},
            loc: convertLoc(context, node),
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
