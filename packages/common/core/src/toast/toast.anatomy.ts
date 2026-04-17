// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "group",
  "root",
  "label",
  "description",
  "actionTrigger",
  "closeTrigger",
  "ghostBefore",
  "ghostAfter",
] as const

export const toastAnatomy: Anatomy<"toast", (typeof parts)[number]> =
  createAnatomy("toast").parts(...parts)
