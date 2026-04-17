// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Anatomy, createAnatomy} from "@qualcomm-ui/utils/anatomy"

const parts = [
  "root",
  "control",
  "track",
  "range",
  "thumb",
  "thumbIndicator",
  "label",
  "valueText",
  "hint",
  "errorText",
  "marker",
  "markerGroup",
  "min",
  "max",
] as const

export const sliderAnatomy: Anatomy<"slider", (typeof parts)[number]> =
  createAnatomy("slider").parts(...parts)
