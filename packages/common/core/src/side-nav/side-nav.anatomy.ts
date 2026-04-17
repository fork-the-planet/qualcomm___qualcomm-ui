// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "filterInput",
  "header",
  "headerAction",
  "headerLogo",
  "headerTitle",
  "root",
  "trigger",
] as const

export const sideNavAnatomy: Anatomy<"sideNav", (typeof parts)[number]> =
  createAnatomy("sideNav").parts(...parts)
