import {Dialog} from "@qualcomm-ui/react/dialog"

import type {GetComponent} from "../types"

interface AuthorizationPopupProps {
  authActions: any
  authSelectors: any
  errSelectors: object
  fn: any
  getComponent: GetComponent
  specSelectors: object
}

export function AuthorizationPopup({
  authActions,
  authSelectors,
  errSelectors,
  fn,
  getComponent,
  specSelectors,
}: AuthorizationPopupProps) {
  const close = () => {
    authActions.showDefinitions(false)
  }

  const definitions = authSelectors.shownDefinitions()
  const Auths = getComponent("auths")

  return (
    <Dialog.Root
      defaultOpen
      onOpenChange={(details) => {
        if (!details.open) {
          close()
        }
      }}
    >
      <Dialog.FloatingPortal>
        <Dialog.Body className="swagger-ui">
          <Dialog.CloseButton />
          <Dialog.Heading>Available Authorizations</Dialog.Heading>
          <Dialog.Description className="authorization-popup-dialog-body">
            {definitions.valueSeq().map((definition: any, key: any) => (
              <Auths
                key={key}
                AST={fn.AST}
                authActions={authActions}
                authSelectors={authSelectors}
                definitions={definition}
                errSelectors={errSelectors}
                getComponent={getComponent}
                specSelectors={specSelectors}
              />
            ))}
          </Dialog.Description>
        </Dialog.Body>
      </Dialog.FloatingPortal>
    </Dialog.Root>
  )
}
