import figma from "@figma/code-connect"

import type {QdsLinkEmphasis, QdsLinkSize} from "@qualcomm-ui/qds-core/link"
import {Link} from "@qualcomm-ui/react/link"

const sharedProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
  emphasis: figma.enum<QdsLinkEmphasis>("emphasis", {
    brand: "brand",
    default: "default",
    neutral: "neutral",
    "white-persistent": "white-persistent",
  }),
  label: figma.textContent("Action"),
  size: figma.enum<QdsLinkSize>("size", {
    lg: "lg",
    md: "md",
    sm: "sm",
    xl: "xl",
    xs: "xs",
    xxl: "xxl",
  }),
}

figma.connect(Link, "<FIGMA_COMPONENTS_BASE>?node-id=55-4432", {
  example: ({label, ...props}) => <Link {...props}>{label}</Link>,
  props: {
    ...sharedProps,
  },
})

figma.connect(Link, "<FIGMA_COMPONENTS_BASE>?node-id=55-4432", {
  example: ({label, ...props}) => <Link {...props}>{label}</Link>,
  props: {
    ...sharedProps,
    endIcon: figma.instance("endIconXs"),
    startIcon: figma.instance("startIconXs"),
  },
  variant: {
    size: "xs",
  },
})

figma.connect(Link, "<FIGMA_COMPONENTS_BASE>?node-id=55-4432", {
  example: ({label, ...props}) => <Link {...props}>{label}</Link>,
  props: {
    ...sharedProps,
    endIcon: figma.instance("endIconXs"),
    startIcon: figma.instance("startIconXs"),
  },
  variant: {
    size: "sm",
  },
})

figma.connect(Link, "<FIGMA_COMPONENTS_BASE>?node-id=55-4432", {
  example: ({label, ...props}) => <Link {...props}>{label}</Link>,
  props: {
    ...sharedProps,
    endIcon: figma.instance("endIconSm"),
    startIcon: figma.instance("startIconSm"),
  },
  variant: {
    size: "md",
  },
})

figma.connect(Link, "<FIGMA_COMPONENTS_BASE>?node-id=55-4432", {
  example: ({label, ...props}) => <Link {...props}>{label}</Link>,
  props: {
    ...sharedProps,
    endIcon: figma.instance("endIconSm"),
    startIcon: figma.instance("startIconSm"),
  },
  variant: {
    size: "lg",
  },
})

figma.connect(Link, "<FIGMA_COMPONENTS_BASE>?node-id=55-4432", {
  example: ({label, ...props}) => <Link {...props}>{label}</Link>,
  props: {
    ...sharedProps,
    endIcon: figma.instance("endIconSm"),
    startIcon: figma.instance("startIconSm"),
  },
  variant: {
    size: "xl",
  },
})

figma.connect(Link, "<FIGMA_COMPONENTS_BASE>?node-id=55-4432", {
  example: ({label, ...props}) => <Link {...props}>{label}</Link>,
  props: {
    ...sharedProps,
    endIcon: figma.instance("endIconMd"),
    startIcon: figma.instance("startIconMd"),
  },
  variant: {
    size: "xxl",
  },
})
