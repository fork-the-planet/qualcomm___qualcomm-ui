import type {ReactElement} from "react"

import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

export function RadioGroupHintDemo(): ReactElement {
  return (
    <form>
      {/* preview */}
      <RadioGroup.Root defaultValue="html">
        <RadioGroup.Label>Language</RadioGroup.Label>
        <RadioGroup.Items>
          <Radio label="HTML" value="html" />
          <Radio label="CSS" value="css" />
          <Radio label="TypeScript" value="ts" />
        </RadioGroup.Items>
        <RadioGroup.Hint>You can change this later</RadioGroup.Hint>
      </RadioGroup.Root>
      {/* preview */}
    </form>
  )
}
