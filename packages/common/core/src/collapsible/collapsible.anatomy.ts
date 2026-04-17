// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = ["root", "trigger", "content"] as const

export const collapsibleAnatomy: Anatomy<
  "collapsible",
  (typeof parts)[number]
> = createAnatomy("collapsible").parts(...parts)
