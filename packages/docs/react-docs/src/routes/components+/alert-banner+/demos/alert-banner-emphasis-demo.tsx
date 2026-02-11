import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"

export function AlertBannerEmphasisDemo(): ReactElement {
  return (
    <div className="grid w-full gap-4">
      {/* preview */}
      <AlertBanner emphasis="info" heading="info" />
      <AlertBanner emphasis="success" heading="success" />
      <AlertBanner emphasis="warning" heading="warning" />
      <AlertBanner emphasis="danger" heading="danger" />
      <AlertBanner emphasis="neutral" heading="neutral" />
      {/* preview */}
    </div>
  )
}
