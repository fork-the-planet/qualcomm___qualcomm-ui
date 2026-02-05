import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"
import {Button} from "@qualcomm-ui/react/button"

export function AlertBannerSimpleDemo(): ReactElement {
  return (
    // preview
    <AlertBanner
      action={
        <Button emphasis="white-persistent" size="sm" variant="outline">
          Action
        </Button>
      }
      description="Description"
      dismissable
      heading="Heading"
      onClose={() => console.log("close")}
    />
    // preview
  )
}
