import type {ReactElement} from "react"

import {Switch} from "@qualcomm-ui/react/switch"

export function SwitchDisabledDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-3">
      {/* preview */}
      <Switch defaultChecked disabled label="Disabled" />
      <Switch disabled label="Disabled" />
      {/* preview */}
    </div>
  )
}
