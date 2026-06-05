// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  QdsButtonGroupCommonBindings,
  QdsButtonGroupCommonProps,
} from "@qualcomm-ui/qds-core/button"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"

import type {splitButtonAnatomy} from "./menu-split-button.anatomy"
import type {menuClasses} from "./menu.classes"

/**
 * @since next-release
 */
export interface QdsSplitButtonApiProps extends QdsButtonGroupCommonProps {}

type PartName = AnatomyPartName<typeof splitButtonAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"splitButton", P> {}

/**
 * @since next-release
 */
export interface QdsSplitButtonBindings
  extends Part<"root">, QdsButtonGroupCommonBindings {
  className: (typeof menuClasses)["splitButton"]
}
