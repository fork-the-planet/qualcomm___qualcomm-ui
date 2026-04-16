// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsButtonSize} from "@qualcomm-ui/qds-core/button"
import type {QdsLinkSize} from "@qualcomm-ui/qds-core/link"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"

import type {cardClasses} from "./card.classes"

export type QdsCardVariant = "outline" | "outline-elevated" | "elevated"

export type QdsCardSize = "sm" | "md" | "lg"

export type QdsCardAlignment = "start" | "center"

export type QdsCardButtonVariant = "primary" | "secondary"

export type QdsCardLinkVariant = "primary" | "secondary"

export type QdsCardMediaPadding = "sm" | "lg"

export interface QdsCardApiProps extends DirectionProperty {
  /**
   * The alignment of the card's content.
   *
   * @option 'start': The content is aligned to the start of the card.
   * @option 'center': The content is centered horizontally within the card.
   */
  alignment?: QdsCardAlignment

  /**
   * If `true`, the root of the card will be styled as a button with interactive
   * states.
   */
  interactive?: boolean | undefined

  /**
   * The size of the card, controlling internal spacing and typography.
   *
   * @default 'sm'
   */
  size?: QdsCardSize

  /**
   * The visual style of the card.
   *
   * @option `outline`: The card has a border and a background color.
   * @option `outline-elevated`: The card has a border and a subtle elevation.
   * @option `elevated`: The card has a subtle elevation.
   *
   * @default 'outline'
   */
  variant?: QdsCardVariant
}

export interface QdsCardMediaApiProps {
  /**
   * The vertical padding of the media component.
   *
   * @default 'sm'
   */
  padding?: QdsCardMediaPadding
}

export interface QdsCardButtonApiProps {
  /**
   * The style variant of the button.
   *
   * @option `primary`: reserved for the primary action of the card.
   * @option `secondary`: a secondary action denoted by a subtle outline style.
   */
  variant?: QdsCardButtonVariant
}

export interface QdsCardLinkApiProps {
  /**
   * The style variant of the button.
   *
   * @option `primary`: reserved for the primary link of the card.
   * @option `secondary`: a secondary link denoted by a subtle style.
   */
  variant?: QdsCardLinkVariant
}

type CardClasses = typeof cardClasses

interface CommonBindings extends Required<DirectionProperty> {
  "data-scope": "card"
}

export interface QdsCardRootBindings extends CommonBindings {
  className: CardClasses["root"]
  "data-alignment": QdsCardAlignment
  "data-interactive": BooleanDataAttr
  "data-part": "root"
  "data-size": QdsCardSize
  "data-variant": QdsCardVariant
}

export interface QdsCardMediaBindings extends CommonBindings {
  className: CardClasses["media"]
  "data-padding": QdsCardMediaPadding
  "data-part": "media"
  "data-size": QdsCardSize
}

export interface QdsCardAvatarBindings extends CommonBindings {
  className: CardClasses["avatar"]
  "data-part": "avatar"
  "data-size": "xl"
}

export interface QdsCardContentBindings extends CommonBindings {
  className: CardClasses["content"]
  "data-alignment": QdsCardAlignment
  "data-part": "content"
  "data-size": QdsCardSize
}

export interface QdsCardHeadingBindings extends CommonBindings {
  className: CardClasses["heading"]
  "data-part": "heading"
  "data-size": QdsCardSize
}

export interface QdsCardHeadingTextBindings extends CommonBindings {
  className: CardClasses["headingText"]
  "data-part": "heading-text"
  "data-size": QdsCardSize
}

export interface QdsCardParagraphTextBindings extends CommonBindings {
  className: CardClasses["paragraphText"]
  "data-part": "paragraph-text"
  "data-size": QdsCardSize
}

export interface QdsCardSubheadingTextBindings extends CommonBindings {
  className: CardClasses["subheadingText"]
  "data-part": "subheading-text"
  "data-size": QdsCardSize
}

export interface QdsCardEyebrowTextBindings extends CommonBindings {
  className: CardClasses["eyebrowText"]
  "data-part": "eyebrow-text"
  "data-size": QdsCardSize
}

export interface QdsCardMenuTriggerBindings {
  className: CardClasses["menuTrigger"]
  "data-size": QdsCardSize
}

export interface QdsCardFooterBindings {
  className: CardClasses["footer"]
  "data-alignment": QdsCardAlignment
  "data-part": "footer"
  "data-size": QdsCardSize
}

export interface QdsCardButtonBindings {
  className: CardClasses["button"]
  "data-size": QdsButtonSize
}

export interface QdsCardLinkBindings {
  className: CardClasses["link"]
  "data-size": QdsLinkSize
}

export interface QdsCardBadgeBindings extends CommonBindings {
  className: CardClasses["badge"]
}

export interface QdsCardApi {
  alignment: QdsCardAlignment
  size: QdsCardSize
  variant: QdsCardVariant

  // group: bindings
  getAvatarBindings(): QdsCardAvatarBindings
  getBadgeBindings(): QdsCardBadgeBindings
  getButtonBindings(): QdsCardButtonBindings
  getContentBindings(): QdsCardContentBindings
  getEyebrowTextBindings(): QdsCardEyebrowTextBindings
  getFooterBindings(): QdsCardFooterBindings
  getHeadingBindings(): QdsCardHeadingBindings
  getHeadingTextBindings(): QdsCardHeadingTextBindings
  getLinkBindings(): QdsCardLinkBindings
  getMediaBindings(props: QdsCardMediaApiProps): QdsCardMediaBindings
  getMenuTriggerBindings(): QdsCardMenuTriggerBindings
  getParagraphTextBindings(): QdsCardParagraphTextBindings
  getRootBindings(): QdsCardRootBindings
  getSubheadingTextBindings(): QdsCardSubheadingTextBindings
}
