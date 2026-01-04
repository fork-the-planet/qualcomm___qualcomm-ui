import figma from "@figma/code-connect"

import type {QdsCheckboxSize} from "@qualcomm-ui/qds-core/checkbox"
import {Checkbox} from "@qualcomm-ui/react/checkbox"

const sharedProps = {
  defaultChecked: figma.enum("variant", {
    checked: true,
    "invalid-checked": true,
  }),
  disabled: figma.enum("state", {
    disabled: true,
  }),
  indeterminate: figma.enum("variant", {
    indeterminate: true,
    "invalid-indeterminate": true,
  }),
  invalid: figma.enum("variant", {
    "invalid-checked": true,
    "invalid-indeterminate": true,
    "invalid-unchecked": true,
  }),
  size: figma.enum<QdsCheckboxSize>("size", {
    lg: "lg",
    md: "md",
    sm: "sm",
  }),
}

// no label
figma.connect(Checkbox, "<FIGMA_FILE_URL>?node-id=12550-185694", {
  example: (props) => {
    return <Checkbox {...props} />
  },
  props: {
    ...sharedProps,
  },
})

// label
figma.connect(Checkbox, "<FIGMA_FILE_URL>?node-id=67-706", {
  example: ({labelText, ...props}) => {
    return <Checkbox label={labelText} {...props} />
  },
  props: {
    ...sharedProps,
    errorText: figma.string("errorText"),
    labelText: figma.string("labelText"),
  },
})
