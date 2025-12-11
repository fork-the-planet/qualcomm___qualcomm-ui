// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineEasyType} from "./define-easy-type"

export const numberSchemaType = defineEasyType<string>({
  colorKey: "base09",
  is: (value: unknown) =>
    !!(
      value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "integer"
    ),
  Renderer: () => {
    return <span className="data-value">integer</span>
  },
  type: "integer",
})
