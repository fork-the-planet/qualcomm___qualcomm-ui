import {
  QDialog,
  QDialogBody,
  QDialogCloseButton,
  QDialogContent,
  QDialogHeader,
} from "@qui/react"

import {GetComponent} from "../types"

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
    <>
      <QDialog
        defaultOpen
        dismissAction={<QDialogCloseButton onClick={close} />}
        onOpenChange={(open) => {
          if (!open) {
            close()
          }
        }}
      >
        <QDialogContent className="swagger-ui">
          <QDialogHeader>Available Authorizations</QDialogHeader>
          <QDialogBody className="authorization-popup-dialog-body">
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
          </QDialogBody>
        </QDialogContent>
      </QDialog>
    </>
  )
}
