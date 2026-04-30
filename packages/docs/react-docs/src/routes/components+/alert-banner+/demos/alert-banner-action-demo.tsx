import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"

export function AlertBannerActionDemo(): ReactElement {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* preview */}
      <AlertBanner
        action={<AlertBanner.Button>Take action</AlertBanner.Button>}
        description="Use white-persistent emphasis for strong variant"
        heading="Strong"
        variant="strong"
      />

      <AlertBanner
        action={<AlertBanner.Button>Take action</AlertBanner.Button>}
        description="Use neutral emphasis for subtle variant"
        heading="Subtle"
        variant="subtle"
      />
      {/* preview */}
    </div>
  )
}
