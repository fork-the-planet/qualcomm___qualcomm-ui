import figma from "@figma/code-connect"
import {SomeIcon} from "lucide-react"

import type {QdsTabsSize} from "@qualcomm-ui/qds-core/tabs"
import {Tab, Tabs} from "@qualcomm-ui/react/tabs"

/** Line Tab Group */

const lineSharedProps = {
  orientation: figma.enum("orientation", {
    vertical: "vertical",
  }),
  size: figma.enum<QdsTabsSize>("size", {
    lg: "lg",
    sm: "sm",
    xl: "xl",
  }),
}

// Line tab group - text only (icon=none)
figma.connect(Tabs.Root, "<FIGMA_COMPONENTS_BASE>?node-id=8863-9067", {
  example: (props) => (
    <Tabs.Root defaultValue="tab1" {...props}>
      <Tabs.List>
        <Tabs.Indicator />
        <Tab.Root value="tab1">
          <Tab.Button>Tab label</Tab.Button>
        </Tab.Root>
        <Tab.Root value="tab2">
          <Tab.Button>Tab label</Tab.Button>
        </Tab.Root>
      </Tabs.List>
      <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
      <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
    </Tabs.Root>
  ),
  props: lineSharedProps,
  variant: {icon: "none"},
})

// Line tab group - icon + text (icon=start)
figma.connect(Tabs.Root, "<FIGMA_COMPONENTS_BASE>?node-id=8863-9067", {
  example: (props) => (
    <Tabs.Root defaultValue="tab1" {...props}>
      <Tabs.List>
        <Tabs.Indicator />
        <Tab.Root value="tab1">
          <Tab.Button startIcon={SomeIcon}>Tab label</Tab.Button>
        </Tab.Root>
        <Tab.Root value="tab2">
          <Tab.Button startIcon={SomeIcon}>Tab label</Tab.Button>
        </Tab.Root>
      </Tabs.List>
      <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
      <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
    </Tabs.Root>
  ),
  props: lineSharedProps,
  variant: {icon: "start"},
})

// Line tab group - icon only (icon=only)
figma.connect(Tabs.Root, "<FIGMA_COMPONENTS_BASE>?node-id=8863-9067", {
  example: (props) => (
    <Tabs.Root defaultValue="tab1" {...props}>
      <Tabs.List>
        <Tabs.Indicator />
        <Tab.Root value="tab1">
          <Tab.Button startIcon={SomeIcon} />
        </Tab.Root>
        <Tab.Root value="tab2">
          <Tab.Button startIcon={SomeIcon} />
        </Tab.Root>
      </Tabs.List>
      <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
      <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
    </Tabs.Root>
  ),
  props: lineSharedProps,
  variant: {icon: "only"},
})

/** Contained Tab Group */

const containedSharedProps = {
  iconVariant: figma.enum("iconVariant", {
    filled: "filled",
  }),
  orientation: figma.enum("orientation", {
    vertical: "vertical",
  }),
  size: figma.enum<QdsTabsSize>("size", {
    sm: "sm",
  }),
}

// Contained tab group - text only (icon=none)
figma.connect(Tabs.Root, "<FIGMA_COMPONENTS_BASE>?node-id=7394-1748", {
  example: ({iconVariant, ...props}) => (
    <Tabs.Root
      defaultValue="tab1"
      iconVariant={iconVariant}
      variant="contained"
      {...props}
    >
      <Tabs.List>
        <Tab.Root value="tab1">
          <Tab.Button>Tab item 1</Tab.Button>
        </Tab.Root>
        <Tab.Root value="tab2">
          <Tab.Button>Tab item 2</Tab.Button>
        </Tab.Root>
      </Tabs.List>
      <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
      <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
    </Tabs.Root>
  ),
  props: containedSharedProps,
  variant: {icon: "none"},
})

// Contained tab group - icon + text (icon=start)
figma.connect(Tabs.Root, "<FIGMA_COMPONENTS_BASE>?node-id=7394-1748", {
  example: ({iconVariant, ...props}) => (
    <Tabs.Root
      defaultValue="tab1"
      iconVariant={iconVariant}
      variant="contained"
      {...props}
    >
      <Tabs.List>
        <Tab.Root value="tab1">
          <Tab.Button startIcon={SomeIcon}>Tab item 1</Tab.Button>
        </Tab.Root>
        <Tab.Root value="tab2">
          <Tab.Button startIcon={SomeIcon}>Tab item 2</Tab.Button>
        </Tab.Root>
      </Tabs.List>
      <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
      <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
    </Tabs.Root>
  ),
  props: containedSharedProps,
  variant: {icon: "start"},
})

// Contained tab group - icon only (icon=only)
figma.connect(Tabs.Root, "<FIGMA_COMPONENTS_BASE>?node-id=7394-1748", {
  example: ({iconVariant, ...props}) => (
    <Tabs.Root
      defaultValue="tab1"
      iconVariant={iconVariant}
      variant="contained"
      {...props}
    >
      <Tabs.List>
        <Tab.Root value="tab1">
          <Tab.Button startIcon={SomeIcon} />
        </Tab.Root>
        <Tab.Root value="tab2">
          <Tab.Button startIcon={SomeIcon} />
        </Tab.Root>
      </Tabs.List>
      <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
      <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
    </Tabs.Root>
  ),
  props: containedSharedProps,
  variant: {icon: "only"},
})

/** Individual Line Tab */

const lineTabSharedProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
}

// Line tab - text only (icon=none)
figma.connect(Tab.Root, "<FIGMA_COMPONENTS_BASE>?node-id=7755-27338", {
  example: ({disabled}) => (
    <Tab.Root disabled={disabled} value="tab-id">
      <Tab.Button>Tab label</Tab.Button>
    </Tab.Root>
  ),
  props: lineTabSharedProps,
  variant: {icon: "none"},
})

// Line tab - icon + text (icon=start)
figma.connect(Tab.Root, "<FIGMA_COMPONENTS_BASE>?node-id=7755-27338", {
  example: ({disabled}) => (
    <Tab.Root disabled={disabled} value="tab-id">
      <Tab.Button startIcon={SomeIcon}>Tab label</Tab.Button>
    </Tab.Root>
  ),
  props: lineTabSharedProps,
  variant: {icon: "start"},
})

// Line tab - icon only (icon=only)
figma.connect(Tab.Root, "<FIGMA_COMPONENTS_BASE>?node-id=7755-27338", {
  example: ({disabled}) => (
    <Tab.Root disabled={disabled} value="tab-id">
      <Tab.Button startIcon={SomeIcon} />
    </Tab.Root>
  ),
  props: lineTabSharedProps,
  variant: {icon: "only"},
})

/** Individual Contained Tab */

const containedTabSharedProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
  dismissButton: figma.boolean("dismissible", {
    true: <Tab.DismissButton />,
  }),
}

// Contained tab - text only (icon=none)
figma.connect(Tab.Root, "<FIGMA_COMPONENTS_BASE>?node-id=7363-3965", {
  example: ({disabled, dismissButton}) => (
    <Tab.Root disabled={disabled} value="tab-id">
      <Tab.Button>Tab label</Tab.Button>
      {dismissButton}
    </Tab.Root>
  ),
  props: containedTabSharedProps,
  variant: {icon: "none"},
})

// Contained tab - icon + text (icon=start)
figma.connect(Tab.Root, "<FIGMA_COMPONENTS_BASE>?node-id=7363-3965", {
  example: ({disabled, dismissButton}) => (
    <Tab.Root disabled={disabled} value="tab-id">
      <Tab.Button startIcon={SomeIcon}>Tab label</Tab.Button>
      {dismissButton}
    </Tab.Root>
  ),
  props: containedTabSharedProps,
  variant: {icon: "start"},
})

// Contained tab - icon only (icon=only)
figma.connect(Tab.Root, "<FIGMA_COMPONENTS_BASE>?node-id=7363-3965", {
  example: ({disabled, dismissButton}) => (
    <Tab.Root disabled={disabled} value="tab-id">
      <Tab.Button startIcon={SomeIcon} />
      {dismissButton}
    </Tab.Root>
  ),
  props: containedTabSharedProps,
  variant: {icon: "only"},
})
