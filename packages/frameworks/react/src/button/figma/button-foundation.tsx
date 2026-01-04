import figma from "@figma/code-connect"

import {Button} from "@qualcomm-ui/react/button"

figma.connect(Button, "<FIGMA_FILE_URL>?node-id=3571-1297", {
  example: (props) => {
    return (
      <Button emphasis="neutral" size={props.size}>
        {props.label}
      </Button>
    )
  },
  props: {
    // These props were automatically mapped based on your linked code:
    label: figma.string("label"),
    size: figma.enum("size", {
      lg: "lg",
      md: "md",
      sm: "sm",
    }),
  },
})
