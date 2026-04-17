// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "root",
  "item",
  "itemTrigger",
  "itemText",
  "itemSecondaryText",
  "itemIndicator",
  "itemContent",
] as const

export const accordionAnatomy: Anatomy<"accordion", (typeof parts)[number]> =
  createAnatomy("accordion").parts(...parts)
