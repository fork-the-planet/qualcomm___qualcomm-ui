import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderExplorerDemo(): ReactElement {
  return (
    <Slider
      className="sm:w-80"
      defaultValue={[25]}
      hint="Some contextual help here"
      label="Choose a value"
    />
  )
}
