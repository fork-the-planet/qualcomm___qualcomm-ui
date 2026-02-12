import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"

export function AlertBannerVariantDemo(): ReactElement {
  return (
    <div className="grid w-full gap-4">
      {/* preview */}
      <AlertBanner emphasis="info" heading="info" variant="subtle" />
      <AlertBanner emphasis="success" heading="success" variant="subtle" />
      <AlertBanner emphasis="warning" heading="warning" variant="subtle" />
      <AlertBanner emphasis="danger" heading="danger" variant="subtle" />
      <AlertBanner emphasis="neutral" heading="neutral" variant="subtle" />
      {/* preview */}
    </div>
  )
}
