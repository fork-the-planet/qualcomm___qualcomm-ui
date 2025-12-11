import type {ReactElement} from "react"

import {X} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"

export function InlineIconButtonVariantsDemo(): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* preview */}
      <InlineIconButton aria-label="Close" icon={X} />
      <div className="bg-persistent-white p-2">
        <InlineIconButton
          aria-label="Close"
          emphasis="persistent-black"
          icon={X}
        />
      </div>
      <div className="bg-persistent-black p-2">
        <InlineIconButton
          aria-label="Close"
          emphasis="persistent-white"
          icon={X}
        />
      </div>
      {/* preview */}
    </div>
  )
}
