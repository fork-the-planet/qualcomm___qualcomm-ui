// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ESLintUtils} from "@typescript-eslint/utils"

import {
  forEachElementChild,
  getElementSourceLocation,
  hasSelector,
  type TemplateNode,
} from "./utils"

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-angular#${name}`,
)

type MessageIds =
  | "preferHeaderBarActionButton"
  | "preferHeaderBarActionIconButton"

export const preferHeaderBarActions = createRule<[], MessageIds>({
  create(context) {
    const reported = new Set<TemplateNode>()

    function report(node: TemplateNode, messageId: MessageIds): void {
      if (reported.has(node)) {
        return
      }
      reported.add(node)

      context.report({
        loc: getElementSourceLocation(context, node)!,
        messageId,
      })
    }

    function checkElement(node: TemplateNode): void {
      if (hasSelector(node, "q-button")) {
        report(node, "preferHeaderBarActionButton")
      }
      if (hasSelector(node, "q-icon-button")) {
        report(node, "preferHeaderBarActionIconButton")
      }
    }

    return {
      Element(node: TemplateNode) {
        if (!hasSelector(node, "q-header-bar-action-bar")) {
          return
        }

        forEachElementChild(node.children, checkElement)
      },
    }
  },
  meta: {
    docs: {
      description:
        "Prefer q-header-bar-action-button and q-header-bar-action-icon-button inside q-header-bar-action-bar",
    },
    messages: {
      preferHeaderBarActionButton:
        "Use q-header-bar-action-button for button actions inside q-header-bar-action-bar",
      preferHeaderBarActionIconButton:
        "Use q-header-bar-action-icon-button for icon actions inside q-header-bar-action-bar",
    },
    schema: [],
    type: "problem",
  },
  name: "prefer-header-bar-actions",
})
