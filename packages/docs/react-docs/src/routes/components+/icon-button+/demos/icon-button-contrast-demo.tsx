import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export function IconButtonContrastDemo(): ReactElement {
  return (
    <div className="grid gap-4">
      {/* preview */}
      <div className="bg-persistent-black flex gap-6 p-4">
        <IconButton
          aria-label="Navigate"
          emphasis="white-persistent"
          icon={ExternalLink}
          variant="fill"
        />
        <IconButton
          aria-label="Navigate"
          emphasis="white-persistent"
          icon={ExternalLink}
          variant="outline"
        />
        <IconButton
          aria-label="Navigate"
          emphasis="white-persistent"
          icon={ExternalLink}
          variant="ghost"
        />
      </div>
      {/* preview */}

      <div className="bg-persistent-white flex gap-6 p-4">
        <IconButton
          aria-label="Navigate"
          emphasis="black-persistent"
          icon={ExternalLink}
          variant="fill"
        />
        <IconButton
          aria-label="Navigate"
          emphasis="black-persistent"
          icon={ExternalLink}
          variant="outline"
        />
        <IconButton
          aria-label="Navigate"
          emphasis="black-persistent"
          icon={ExternalLink}
          variant="ghost"
        />
      </div>
    </div>
  )
}
