// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "root",
  "label",
  "control",
  "thumb",
  "hiddenInput",
  "hint",
  "errorText",
] as const

export const switchAnatomy: Anatomy<"switch", (typeof parts)[number]> =
  createAnatomy("switch").parts(...parts)
