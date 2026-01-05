import figma from "@figma/code-connect"

import {Button, IconButton} from "@qualcomm-ui/react/button"

const iconProp = {
  icon: figma.enum("icon", {
    end: "end",
    none: "none",
    only: "only",
    start: "start",
  }),
}

const sizeProp = {
  size: figma.enum("size", {
    lg: "lg",
    md: "md",
    sm: "sm",
  }),
}

figma.connect(Button, "<FIGMA_COMPONENTS_BASE>?node-id=3571-1297", {
  example: (props) => {
    return (
      <Button emphasis="neutral" size={props.size}>
        {props.label}
      </Button>
    )
  },
  props: {
    ...iconProp,
    ...sizeProp,
    label: figma.string("label"),
  },
  variant: {
    icon: "none",
  },
})

// icon: start
figma.connect(Button, "<FIGMA_COMPONENTS_BASE>?node-id=3571-1297", {
  example: (props) => {
    return (
      <Button emphasis="neutral" size={props.size} startIcon={props.iconNode}>
        {props.label}
      </Button>
    )
  },
  props: {
    ...iconProp,
    ...sizeProp,
    iconNode: figma.instance("iconSm"),
    label: figma.string("label"),
  },
  variant: {
    icon: "start",
    size: "sm",
  },
})

figma.connect(Button, "<FIGMA_COMPONENTS_BASE>?node-id=3571-1297", {
  example: (props) => {
    return (
      <Button emphasis="neutral" size={props.size} startIcon={props.iconNode}>
        {props.label}
      </Button>
    )
  },
  props: {
    ...iconProp,
    ...sizeProp,
    iconNode: figma.instance("iconMd"),
    label: figma.string("label"),
  },
  variant: {
    icon: "start",
    size: "md",
  },
})

figma.connect(Button, "<FIGMA_COMPONENTS_BASE>?node-id=3571-1297", {
  example: (props) => {
    return (
      <Button emphasis="neutral" size={props.size} startIcon={props.iconNode}>
        {props.label}
      </Button>
    )
  },
  props: {
    ...iconProp,
    ...sizeProp,
    iconNode: figma.instance("iconLg"),
    label: figma.string("label"),
  },
  variant: {
    icon: "start",
    size: "lg",
  },
})

// icon: end
figma.connect(Button, "<FIGMA_COMPONENTS_BASE>?node-id=3571-1297", {
  example: (props) => {
    return (
      <Button emphasis="neutral" endIcon={props.iconNode} size={props.size}>
        {props.label}
      </Button>
    )
  },
  props: {
    ...iconProp,
    ...sizeProp,
    iconNode: figma.instance("iconSm"),
    label: figma.string("label"),
  },
  variant: {
    icon: "end",
    size: "sm",
  },
})

figma.connect(Button, "<FIGMA_COMPONENTS_BASE>?node-id=3571-1297", {
  example: (props) => {
    return (
      <Button emphasis="neutral" endIcon={props.iconNode} size={props.size}>
        {props.label}
      </Button>
    )
  },
  props: {
    ...iconProp,
    ...sizeProp,
    iconNode: figma.instance("iconMd"),
    label: figma.string("label"),
  },
  variant: {
    icon: "end",
    size: "md",
  },
})

figma.connect(Button, "<FIGMA_COMPONENTS_BASE>?node-id=3571-1297", {
  example: (props) => {
    return (
      <Button emphasis="neutral" endIcon={props.iconNode} size={props.size}>
        {props.label}
      </Button>
    )
  },
  props: {
    ...iconProp,
    ...sizeProp,
    iconNode: figma.instance("iconLg"),
    label: figma.string("label"),
  },
  variant: {
    icon: "end",
    size: "lg",
  },
})

// icon: only
figma.connect(IconButton, "<FIGMA_COMPONENTS_BASE>?node-id=3571-1297", {
  example: (props) => {
    return (
      <IconButton emphasis="neutral" icon={props.iconSm} size={props.size} />
    )
  },
  props: {
    ...iconProp,
    ...sizeProp,
    iconSm: figma.instance("iconSm"),
  },
  variant: {
    icon: "only",
    size: "sm",
  },
})

figma.connect(IconButton, "<FIGMA_COMPONENTS_BASE>?node-id=3571-1297", {
  example: (props) => {
    return (
      <IconButton emphasis="neutral" icon={props.iconMd} size={props.size} />
    )
  },
  props: {
    ...iconProp,
    ...sizeProp,
    iconMd: figma.instance("iconMd"),
  },
  variant: {
    icon: "only",
    size: "md",
  },
})

figma.connect(IconButton, "<FIGMA_COMPONENTS_BASE>?node-id=3571-1297", {
  example: (props) => {
    return (
      <IconButton emphasis="neutral" icon={props.iconLg} size={props.size} />
    )
  },
  props: {
    ...iconProp,
    ...sizeProp,
    iconLg: figma.instance("iconLg"),
  },
  variant: {
    icon: "only",
    size: "lg",
  },
})
