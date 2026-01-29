import figma from "@figma/code-connect"
import {Star} from "lucide-react"

import type {
  QdsTagEmphasis,
  QdsTagRadius,
  QdsTagSize,
} from "@qualcomm-ui/qds-core/tag"
import {Tag} from "@qualcomm-ui/react/tag"

// Note: Figma has additional emphasis values (blue, cyan, teal, green, kiwi,
// yellow, orange, red, magenta, purple). Only the currently implemented ones
// (brand, outline-neutral, and neutral) are mapped.
const sharedProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
  emphasis: figma.enum<QdsTagEmphasis>("emphasis", {
    neutral: "neutral",
    "outline-neutral": "outline-neutral",
  }),
  nested: figma.nestedProps("_Tag Foundation", {
    endIcon: figma.boolean("endIcon", {
      false: undefined,
      true: Star,
    }),
    radius: figma.enum<QdsTagRadius>("radius", {
      rounded: "rounded",
    }),
    size: figma.enum<QdsTagSize>("size", {
      lg: "lg",
      sm: "sm",
    }),
    startIcon: figma.boolean("startIcon", {
      false: undefined,
      true: Star,
    }),
  }),
}

// Link Tag
figma.connect(Tag, "<FIGMA_COMPONENTS_BASE>?node-id=6975-13697", {
  example: ({disabled, emphasis, nested}) => (
    <Tag
      disabled={disabled}
      emphasis={emphasis}
      endIcon={nested.endIcon}
      radius={nested.radius}
      size={nested.size}
      startIcon={nested.startIcon}
      variant="link"
    >
      Label
    </Tag>
  ),
  props: sharedProps,
})

// Selectable Tag
figma.connect(Tag, "<FIGMA_COMPONENTS_BASE>?node-id=6975-17666", {
  example: ({disabled, emphasis, nested}) => (
    <Tag
      disabled={disabled}
      emphasis={emphasis}
      endIcon={nested.endIcon}
      radius={nested.radius}
      size={nested.size}
      startIcon={nested.startIcon}
      variant="selectable"
    >
      Label
    </Tag>
  ),
  props: sharedProps,
})

// Dismissible Tag (endIcon is automatically X, user-provided endIcon is ignored)
figma.connect(Tag, "<FIGMA_COMPONENTS_BASE>?node-id=6975-21606", {
  example: ({disabled, emphasis, nested}) => (
    <Tag
      disabled={disabled}
      emphasis={emphasis}
      radius={nested.radius}
      size={nested.size}
      startIcon={nested.startIcon}
      variant="dismissable"
    >
      Label
    </Tag>
  ),
  props: sharedProps,
})

// Read Only Tag (no variant - static/non-interactive)
figma.connect(Tag, "<FIGMA_COMPONENTS_BASE>?node-id=16762-2131", {
  example: ({disabled, emphasis, nested}) => (
    <Tag
      disabled={disabled}
      emphasis={emphasis}
      endIcon={nested.endIcon}
      radius={nested.radius}
      size={nested.size}
      startIcon={nested.startIcon}
    >
      Label
    </Tag>
  ),
  props: sharedProps,
})
