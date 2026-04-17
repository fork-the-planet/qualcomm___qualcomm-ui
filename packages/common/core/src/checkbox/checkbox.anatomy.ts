// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "root",
  "label",
  "control",
  "indicator",
  "hiddenInput",
  "hint",
  "errorText",
] as const

export const checkboxAnatomy: Anatomy<"checkbox", (typeof parts)[number]> =
  createAnatomy("checkbox").parts(...parts)
