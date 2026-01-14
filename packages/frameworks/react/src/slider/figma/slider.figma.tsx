import figma from "@figma/code-connect"

import {Slider} from "@qualcomm-ui/react/slider"

const sharedProps = {
  disabled: figma.enum("state", {
    disabled: true,
  }),
  hint: figma.boolean("hint", {
    true: figma.string("hintText"),
  }),
  invalid: figma.enum("state", {
    invalid: true,
  }),
  label: figma.boolean("label", {
    true: figma.string("labelText"),
  }),
  sideMarkers: figma.enum("valuePosition", {
    side: true,
  }),
  size: figma.enum("size", {
    sm: "sm",
  }),
  variant: figma.enum("emphasis", {
    neutral: "neutral",
  }),
}

figma.connect(Slider, "<FIGMA_COMPONENTS_BASE>?node-id=6427-386", {
  example: ({defaultValue, hint, label, ...props}) => (
    <Slider defaultValue={defaultValue} hint={hint} label={label} {...props} />
  ),
  props: {
    ...sharedProps,
    defaultValue: figma.enum("variant", {
      range: [25, 75],
      single: [25],
    }),
  },
})
