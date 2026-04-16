// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"
import type {QdsLinkApiProps} from "@qualcomm-ui/qds-core/link"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {cardClasses} from "./card.classes"
import type {
  QdsCardApi,
  QdsCardApiProps,
  QdsCardAvatarBindings,
  QdsCardBadgeBindings,
  QdsCardButtonApiProps,
  QdsCardButtonBindings,
  QdsCardContentBindings,
  QdsCardEyebrowTextBindings,
  QdsCardFooterBindings,
  QdsCardHeadingBindings,
  QdsCardHeadingTextBindings,
  QdsCardLinkApiProps,
  QdsCardLinkBindings,
  QdsCardMediaBindings,
  QdsCardMenuTriggerBindings,
  QdsCardParagraphTextBindings,
  QdsCardRootBindings,
  QdsCardSubheadingTextBindings,
} from "./card.types"

export function createQdsCardApi(
  props: QdsCardApiProps,
  normalize: PropNormalizer,
): QdsCardApi {
  const size = props.size || "sm"
  const variant = props.variant || "outline"
  const alignment = props.alignment || "start"
  const dir = props.dir || "ltr"
  const interactive = props.interactive

  const commonBindings = {"data-scope": "card" as const, dir}

  return {
    alignment,
    size,
    variant,

    // group: bindings
    getAvatarBindings(): QdsCardAvatarBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.avatar,
        "data-part": "avatar",
        "data-size": "xl",
      })
    },
    getBadgeBindings(): QdsCardBadgeBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.badge,
      })
    },
    getButtonBindings(): QdsCardButtonBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.button,
        "data-part": "button",
        "data-size": size === "lg" ? "md" : "sm",
      })
    },
    getContentBindings(): QdsCardContentBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.content,
        "data-alignment": alignment,
        "data-part": "content",
        "data-size": size,
      })
    },
    getEyebrowTextBindings(): QdsCardEyebrowTextBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.eyebrowText,
        "data-part": "eyebrow-text",
        "data-size": size,
      })
    },
    getFooterBindings(): QdsCardFooterBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.footer,
        "data-alignment": alignment,
        "data-part": "footer",
        "data-size": size,
      })
    },
    getHeadingBindings(): QdsCardHeadingBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.heading,
        "data-alignment": alignment,
        "data-part": "heading",
        "data-size": size,
      })
    },
    getHeadingTextBindings(): QdsCardHeadingTextBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.headingText,
        "data-part": "heading-text",
        "data-size": size,
      })
    },
    getLinkBindings(): QdsCardLinkBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.link,
        "data-part": "link",
        "data-size": size === "lg" ? "md" : size === "md" ? "sm" : "xs",
      })
    },
    getMediaBindings(props): QdsCardMediaBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.media,
        "data-padding": props.padding || "sm",
        "data-part": "media",
        "data-size": size,
      })
    },
    getMenuTriggerBindings(): QdsCardMenuTriggerBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.menuTrigger,
        "data-part": "menu-trigger",
        "data-size": size,
      })
    },
    getParagraphTextBindings(): QdsCardParagraphTextBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.paragraphText,
        "data-part": "paragraph-text",
        "data-size": size,
      })
    },
    getRootBindings(): QdsCardRootBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.root,
        "data-alignment": alignment,
        "data-interactive": booleanDataAttr(interactive),
        "data-part": "root",
        "data-size": size,
        "data-variant": variant,
      })
    },
    getSubheadingTextBindings(): QdsCardSubheadingTextBindings {
      return normalize.element({
        ...commonBindings,
        className: cardClasses.subheadingText,
        "data-part": "subheading-text",
        "data-size": size,
      })
    },
  }
}

export function translateCardButtonProps(
  props: QdsCardButtonApiProps,
): QdsButtonApiProps {
  return {
    emphasis: props.variant === "primary" ? "primary" : "neutral",
    variant: props.variant === "primary" ? "fill" : "outline",
  }
}

export function translateCardLinkProps(
  props: QdsCardLinkApiProps,
): QdsLinkApiProps {
  return {
    emphasis: props.variant === "secondary" ? "neutral" : "default",
  }
}
