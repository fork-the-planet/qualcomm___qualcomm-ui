import type {ReactElement} from "react"

import {Search} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export function IconButtonVariantCombinationsDemo(): ReactElement {
  return (
    <div className="grid grid-cols-3 grid-rows-4 gap-x-8 gap-y-5">
      <span className="text-neutral-primary font-heading-xs">Fill</span>
      <span className="text-neutral-primary font-heading-xs">Outline</span>
      <span className="text-neutral-primary font-heading-xs">Ghost</span>

      {/* preview */}
      <IconButton
        aria-label="Search"
        emphasis="neutral"
        icon={Search}
        variant="fill"
      />
      <IconButton
        aria-label="Search"
        emphasis="neutral"
        icon={Search}
        variant="outline"
      />
      <IconButton
        aria-label="Search"
        emphasis="neutral"
        icon={Search}
        variant="ghost"
      />
      {/* preview */}

      <IconButton
        aria-label="Search"
        emphasis="primary"
        icon={Search}
        variant="fill"
      />
      <IconButton
        aria-label="Search"
        emphasis="primary"
        icon={Search}
        variant="outline"
      />
      <IconButton
        aria-label="Search"
        emphasis="primary"
        icon={Search}
        variant="ghost"
      />

      <IconButton
        aria-label="Search"
        emphasis="danger"
        icon={Search}
        variant="fill"
      />
      <IconButton
        aria-label="Search"
        emphasis="danger"
        icon={Search}
        variant="outline"
      />
      <IconButton
        aria-label="Search"
        emphasis="danger"
        icon={Search}
        variant="ghost"
      />

      <IconButton aria-label="Search" disabled icon={Search} variant="fill" />
      <IconButton
        aria-label="Search"
        disabled
        icon={Search}
        variant="outline"
      />
      <IconButton aria-label="Search" disabled icon={Search} variant="ghost" />
    </div>
  )
}
