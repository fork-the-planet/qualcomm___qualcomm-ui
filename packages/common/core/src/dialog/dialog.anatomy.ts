// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "trigger",
  "backdrop",
  "positioner",
  "content",
  "heading",
  "description",
  "body",
  "closeTrigger",
  "footer",
] as const

export const dialogAnatomy: Anatomy<"dialog", (typeof parts)[number]> =
  createAnatomy("dialog").parts(...parts)
