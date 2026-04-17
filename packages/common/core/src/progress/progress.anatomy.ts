// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "root",
  "label",
  "track",
  "bar",
  "valueText",
  "errorText",
  "hint",
  "circle",
  "circleContainer",
  "circleTrack",
  "circleBar",
] as const

export const progressAnatomy: Anatomy<"progress", (typeof parts)[number]> =
  createAnatomy("progress").parts(...parts)
