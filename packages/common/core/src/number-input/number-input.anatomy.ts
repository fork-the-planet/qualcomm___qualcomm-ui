// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "root",
  "label",
  "hint",
  "errorText",
  "errorIndicator",
  "inputGroup",
  "input",
  "control",
  "incrementTrigger",
  "decrementTrigger",
  "valueText",
  "unitSelect",
  "chevron",
] as const

export const numberInputAnatomy: Anatomy<"numberInput", (typeof parts)[number]> =
  createAnatomy("numberInput").parts(...parts)
