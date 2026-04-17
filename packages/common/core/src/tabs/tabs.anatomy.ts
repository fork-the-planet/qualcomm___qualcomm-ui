// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "root",
  "list",
  "tab",
  "tabButton",
  "tabIcon",
  "tabDismissButton",
  "panel",
  "indicator",
] as const

export const tabsAnatomy: Anatomy<"tabs", (typeof parts)[number]> =
  createAnatomy("tabs").parts(...parts)
