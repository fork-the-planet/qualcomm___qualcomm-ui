import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"
import {Button} from "@qualcomm-ui/react/button"

export function AlertBannerActionDemo(): ReactElement {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* preview */}
      <AlertBanner
        action={
          <Button emphasis="white-persistent" size="sm" variant="outline">
            Take action
          </Button>
        }
        description="Use white-persistent emphasis for strong variant"
        heading="Strong"
        variant="strong"
      />

      <AlertBanner
        action={
          <Button emphasis="neutral" size="sm" variant="outline">
            Take action
          </Button>
        }
        description="Use neutral emphasis for subtle variant"
        heading="Subtle"
        variant="subtle"
      />
      {/* preview */}
    </div>
  )
}
