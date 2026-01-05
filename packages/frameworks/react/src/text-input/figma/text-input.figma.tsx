// @ts-nocheck
import figma from "@figma/code-connect"

import {TextInput} from "@qualcomm-ui/react/text-input"

const sharedProps = {
  defaultInputValue: figma.boolean("filled", {
    true: figma.string("inputText"),
  }),
  disabled: figma.enum("state", {
    disabled: true,
  }),
  errorText: figma.string("errorText"),
  invalid: figma.enum("state", {
    invalid: true,
  }),
  label: figma.boolean("label", {
    true: figma.string("labelText"),
  }),
  required: figma.boolean("required"),
  size: figma.enum("size", {
    lg: "lg",
    md: "md",
    sm: "sm",
  }),
}

figma.connect(TextInput, "<FIGMA_COMPONENTS_BASE>?node-id=4227-2418", {
  example: ({label, ...props}) => <TextInput label={label} {...props} />,
  props: {
    ...sharedProps,
    endIcon: figma.instance("iconRxs"),
    startIcon: figma.instance("iconLxs"),
  },
})

figma.connect(TextInput, "<FIGMA_COMPONENTS_BASE>?node-id=4227-2418", {
  example: ({label, ...props}) => <TextInput label={label} {...props} />,
  props: {
    ...sharedProps,
    endIcon: figma.instance("iconRsm"),
    startIcon: figma.instance("iconLsm"),
  },
  variant: {
    size: "lg",
  },
})
