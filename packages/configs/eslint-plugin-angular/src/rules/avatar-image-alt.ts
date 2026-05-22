// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ESLintUtils} from "@typescript-eslint/utils"

import {
  getElementSourceLocation,
  hasNonEmptyAttributeOrInput,
  hasSelector,
  type TemplateNode,
} from "./utils"

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-angular#${name}`,
)

type MessageIds = "missingAlt"

export const avatarImageAlt = createRule<[], MessageIds>({
  create(context) {
    return {
      Element(node: TemplateNode) {
        if (!hasSelector(node, "q-avatar-image")) {
          return
        }

        if (hasNonEmptyAttributeOrInput(node, "alt")) {
          return
        }

        context.report({
          loc: getElementSourceLocation(context, node)!,
          messageId: "missingAlt",
        })
      },
    }
  },
  meta: {
    docs: {
      description:
        "Enforce that q-avatar-image has an alt attribute for accessibility",
    },
    messages: {
      missingAlt: "q-avatar-image must have an alt attribute for accessibility",
    },
    schema: [],
    type: "problem",
  },
  name: "avatar-image-alt",
})
