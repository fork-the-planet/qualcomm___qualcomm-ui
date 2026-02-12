import type {ReactElement} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"
import {Button} from "@qualcomm-ui/react/button"

export function AlertBannerCompositeDemo(): ReactElement {
  return (
    // preview
    <AlertBanner.Root onClose={() => console.log("close")}>
      <AlertBanner.Icon />
      <AlertBanner.Heading>Heading</AlertBanner.Heading>
      <AlertBanner.Description>Description</AlertBanner.Description>
      <AlertBanner.ActionContainer>
        <Button emphasis="white-persistent" size="sm" variant="outline">
          Action
        </Button>
      </AlertBanner.ActionContainer>
      <AlertBanner.CloseButton />
    </AlertBanner.Root>
    // preview
  )
}
