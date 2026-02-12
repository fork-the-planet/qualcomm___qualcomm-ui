import {type ReactElement, useState} from "react"

import {AlertBanner} from "@qualcomm-ui/react/alert-banner"
import {Button} from "@qualcomm-ui/react/button"

export function AlertBannerDismissableDemo(): ReactElement {
  const [simpleVisible, setSimpleVisible] = useState(true)
  const [compositeVisible, setCompositeVisible] = useState(true)

  const allDismissed = !simpleVisible && !compositeVisible

  return (
    <div className="flex w-full flex-col gap-4">
      {/* preview */}
      {simpleVisible && (
        <AlertBanner
          closeButtonAriaLabel="Close this banner"
          dismissable
          heading="Simple API"
          onClose={() => setSimpleVisible(false)}
        />
      )}

      {compositeVisible && (
        <AlertBanner.Root
          closeButtonAriaLabel="Close this banner"
          onClose={() => setCompositeVisible(false)}
          variant="subtle"
        >
          <AlertBanner.Icon />
          <AlertBanner.Heading>Composite API</AlertBanner.Heading>
          <AlertBanner.CloseButton />
        </AlertBanner.Root>
      )}
      {/* preview */}
      {allDismissed && (
        <Button
          onClick={() => {
            setSimpleVisible(true)
            setCompositeVisible(true)
          }}
        >
          Reset demo
        </Button>
      )}
    </div>
  )
}
