// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig} from "eslint/config"

import {accessibleName} from "./rules/accessible-name.js"

export const rules = {
  "accessible-name": accessibleName,
}

export const plugin = {
  rules,
}

export const config = defineConfig({
  plugins: {
    "@qualcomm-ui/angular": plugin,
  },
  rules: {
    "@qualcomm-ui/angular/accessible-name": "error",
  },
})
