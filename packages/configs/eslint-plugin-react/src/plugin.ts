// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ESLint, Linter} from "eslint"

import {accessibleName, iconDecorative, inputLabelAssociation} from "./rules"

export const rules = {
  "accessible-name": accessibleName,
  "icon-decorative": iconDecorative,
  "input-label-association": inputLabelAssociation,
}

export const plugin: ESLint.Plugin = {
  rules: rules as unknown as ESLint.Plugin["rules"],
}

export const config: Linter.Config[] = [
  {
    plugins: {
      "@qualcomm-ui/react": plugin,
    },
    rules: {
      "@qualcomm-ui/react/accessible-name": "error",
      "@qualcomm-ui/react/icon-decorative": "error",
      "@qualcomm-ui/react/input-label-association": "error",
    },
  },
]
