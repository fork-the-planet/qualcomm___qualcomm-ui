import type {ReactElement} from "react"

import {X} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"

export function InlineIconButtonShowcaseDemo(): ReactElement {
  return (
    // preview
    <InlineIconButton aria-label="Close" icon={X} />
    // preview
  )
}
