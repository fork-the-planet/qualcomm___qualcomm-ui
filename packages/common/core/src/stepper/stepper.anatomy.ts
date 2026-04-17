// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "root",
  "list",
  "item",
  "trigger",
  "content",
  "indicator",
  "separator",
  "label",
  "completedContent",
  "hint",
  "nextTrigger",
  "prevTrigger",
] as const

export const stepperAnatomy: Anatomy<"stepper", (typeof parts)[number]> =
  createAnatomy("stepper").parts(...parts)
