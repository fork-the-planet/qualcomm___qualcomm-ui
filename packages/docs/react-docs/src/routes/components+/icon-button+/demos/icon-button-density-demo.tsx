import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export function IconButtonDensityDemo(): ReactElement {
  return (
    <div className="grid justify-items-center gap-4">
      {/* preview */}
      <IconButton
        aria-label="Navigate"
        density="compact"
        emphasis="primary"
        icon={ExternalLink}
        size="sm"
        variant="fill"
      />
      <IconButton
        aria-label="Navigate"
        density="compact"
        emphasis="primary"
        icon={ExternalLink}
        size="md"
        variant="fill"
      />
      <IconButton
        aria-label="Navigate"
        density="compact"
        emphasis="primary"
        icon={ExternalLink}
        size="lg"
        variant="fill"
      />
      {/* preview */}
    </div>
  )
}
