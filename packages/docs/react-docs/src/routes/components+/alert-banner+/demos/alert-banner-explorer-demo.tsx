import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"
import {Button} from "@qualcomm-ui/react/button"

export function AlertBannerExplorerDemo(): ReactElement {
  return (
    <AlertBanner
      action={
        <Button emphasis="neutral" size="sm" variant="outline">
          Action
        </Button>
      }
      description="Description"
      dismissable
      heading="Heading"
      variant="subtle"
    />
  )
}
