import type {ReactElement} from "react"

import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

export function RadioGroupHintDemo(): ReactElement {
  return (
    <form>
      {/* preview */}
      <RadioGroup.Root defaultValue="weekly">
        <RadioGroup.Label>Email frequency</RadioGroup.Label>
        <RadioGroup.Items>
          <Radio label="Daily" value="daily" />
          <Radio label="Weekly" value="weekly" />
          <Radio label="Monthly" value="monthly" />
        </RadioGroup.Items>
        <RadioGroup.Hint>You can change this in settings later</RadioGroup.Hint>
      </RadioGroup.Root>
      {/* preview */}
    </form>
  )
}
