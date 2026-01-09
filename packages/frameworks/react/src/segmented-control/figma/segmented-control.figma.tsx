import figma from "@figma/code-connect"
import {SomeIcon} from "lucide-react"

import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"

const sharedProps = {
  layout: figma.enum("width", {
    fill: "fill",
  }),
  orientation: figma.enum("orientation", {
    vertical: "vertical",
  }),
  size: figma.enum("size", {
    lg: "lg",
    sm: "sm",
  }),
  variant: figma.enum("emphasis", {
    primary: "primary",
  }),
}

// Text-only items (icon=none)
figma.connect(
  SegmentedControl.Root,
  "<FIGMA_COMPONENTS_BASE>?node-id=7169-793",
  {
    example: (props) => (
      <SegmentedControl.Root defaultValue={["section1"]} {...props}>
        <SegmentedControl.Item text="Section" value="section1" />
        <SegmentedControl.Item text="Section" value="section2" />
      </SegmentedControl.Root>
    ),
    props: sharedProps,
    variant: {icon: "none"},
  },
)

// Icon + text items (icon=start)
figma.connect(
  SegmentedControl.Root,
  "<FIGMA_COMPONENTS_BASE>?node-id=7169-793",
  {
    example: (props) => (
      <SegmentedControl.Root defaultValue={["section1"]} {...props}>
        <SegmentedControl.Item
          icon={SomeIcon}
          text="Section"
          value="section1"
        />
        <SegmentedControl.Item
          icon={SomeIcon}
          text="Section"
          value="section2"
        />
      </SegmentedControl.Root>
    ),
    props: sharedProps,
    variant: {icon: "start"},
  },
)

// Icon-only items (icon=only)
figma.connect(
  SegmentedControl.Root,
  "<FIGMA_COMPONENTS_BASE>?node-id=7169-793",
  {
    example: (props) => (
      <SegmentedControl.Root defaultValue={["section1"]} {...props}>
        <SegmentedControl.Item icon={SomeIcon} value="section1" />
        <SegmentedControl.Item icon={SomeIcon} value="section2" />
      </SegmentedControl.Root>
    ),
    props: sharedProps,
    variant: {icon: "only"},
  },
)
