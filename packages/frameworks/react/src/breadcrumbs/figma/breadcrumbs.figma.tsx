import figma from "@figma/code-connect"
import {FolderClosed} from "lucide-react"

import type {
  QdsBreadcrumbsEmphasis,
  QdsBreadcrumbsSize,
} from "@qualcomm-ui/qds-core/breadcrumbs"
import {Breadcrumbs} from "@qualcomm-ui/react/breadcrumbs"

// Shared props for size and emphasis (omitting defaults)
const sharedProps = {
  emphasis: figma.enum<QdsBreadcrumbsEmphasis>("emphasis", {
    neutral: "neutral",
  }),
  size: figma.enum<QdsBreadcrumbsSize>("size", {
    lg: "lg",
    sm: "sm",
  }),
}

/** Breadcrumb Container (Root + List) */
figma.connect(Breadcrumbs.Root, "<FIGMA_COMPONENTS_BASE>?node-id=3728-17610", {
  example: ({children, emphasis, size}) => (
    <Breadcrumbs.Root aria-label="Breadcrumbs" emphasis={emphasis} size={size}>
      <Breadcrumbs.List>{children}</Breadcrumbs.List>
    </Breadcrumbs.Root>
  ),
  props: {
    ...sharedProps,
    children: figma.children("_Breadcrumb item"),
  },
})

/** Breadcrumb Item */

// Default item (idle/hover/pressed/focus states)
figma.connect(Breadcrumbs.Item, "<FIGMA_COMPONENTS_BASE>?node-id=3728-13488", {
  example: ({icon}) => (
    <Breadcrumbs.Item icon={icon}>Breadcrumb</Breadcrumbs.Item>
  ),
  props: {
    icon: figma.boolean("showIcon", {
      true: FolderClosed,
    }),
  },
})

// Active item (current page)
figma.connect(Breadcrumbs.Item, "<FIGMA_COMPONENTS_BASE>?node-id=3728-13488", {
  example: ({icon}) => (
    <Breadcrumbs.Item aria-current="page" icon={icon}>
      Breadcrumb
    </Breadcrumbs.Item>
  ),
  props: {
    icon: figma.boolean("showIcon", {
      true: FolderClosed,
    }),
  },
  variant: {state: "active"},
})

// Disabled item
figma.connect(Breadcrumbs.Item, "<FIGMA_COMPONENTS_BASE>?node-id=3728-13488", {
  example: ({icon}) => (
    <Breadcrumbs.Item disabled icon={icon}>
      Breadcrumb
    </Breadcrumbs.Item>
  ),
  props: {
    icon: figma.boolean("showIcon", {
      true: FolderClosed,
    }),
  },
  variant: {state: "disabled"},
})
