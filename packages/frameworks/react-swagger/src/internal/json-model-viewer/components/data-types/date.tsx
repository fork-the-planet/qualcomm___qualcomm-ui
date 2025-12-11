// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineEasyType} from "./define-easy-type"

const displayOptions: Intl.DateTimeFormatOptions = {
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
  weekday: "short",
  year: "numeric",
}

export const dateType = defineEasyType<Date>({
  colorKey: "base0D",
  is: (value) => value instanceof Date,
  Renderer: ({value}) => (
    <>{value.toLocaleTimeString("en-us", displayOptions)}</>
  ),
  type: "date",
})
