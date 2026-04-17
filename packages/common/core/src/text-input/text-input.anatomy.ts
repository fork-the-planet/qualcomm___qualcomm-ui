// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "root",
  "label",
  "input",
  "inputGroup",
  "clearTrigger",
  "errorIndicator",
  "errorText",
  "hint",
] as const

export const textInputAnatomy: Anatomy<"textInput", (typeof parts)[number]> =
  createAnatomy("textInput").parts(...parts)
