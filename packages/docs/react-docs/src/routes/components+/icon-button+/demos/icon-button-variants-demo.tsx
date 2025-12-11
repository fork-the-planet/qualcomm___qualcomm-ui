import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export function IconButtonVariantsDemo(): ReactElement {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-1">
      <div className="text-neutral-primary font-heading-xs">Fill</div>
      <div className="text-neutral-primary font-heading-xs">Outline</div>
      <div className="text-neutral-primary font-heading-xs">Ghost</div>

      {/* preview */}
      <IconButton aria-label="Navigate" icon={ExternalLink} variant="fill" />
      <IconButton aria-label="Navigate" icon={ExternalLink} variant="outline" />
      <IconButton aria-label="Navigate" icon={ExternalLink} variant="ghost" />
      {/* preview */}
    </div>
  )
}
