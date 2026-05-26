// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineConfig} from "eslint/config"
import * as mdx from "eslint-plugin-mdx"
import reactPlugin from "eslint-plugin-react"

const recommended = defineConfig({
  ...mdx.flat,
  plugins: {
    ...mdx.flat.plugins,
    react: reactPlugin,
  },
  rules: {
    ...mdx.flat.rules,
    "mdx/remark": "error",
    "no-unused-expressions": "off",
  },
})

export default recommended
