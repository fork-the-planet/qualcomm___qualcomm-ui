import {type FormEvent, type MouseEvent, useState} from "react"

import type {Map} from "immutable"

import {Button} from "@qualcomm-ui/react/button"

interface AuthsProps {
  authActions: any
  authSelectors: any
  definitions: Map<any, any>
  errSelectors: any
  getComponent: (name: string, fallback?: boolean) => any
  specSelectors: any
}

export function Auths(props: AuthsProps) {
  const [state, setState] = useState<any>({})

  const onAuthChange = (auth: any) => {
    const {name} = auth
    setState({...state, [name]: auth})
  }

  const submitAuth = (e: FormEvent) => {
    e.preventDefault()
    const {authActions} = props
    authActions.authorizeWithPersistOption(state)
  }

  const logoutClick = (e: MouseEvent) => {
    e.preventDefault()
    const {authActions, definitions} = props
    const auths = definitions.map((val: any, key: string) => key).toArray()
    setState(
      auths.reduce((prev: any, auth: any) => ({...prev, [auth]: ""}), {}),
    )
    authActions.logoutWithPersistOption(auths)
  }

  const close = (e: MouseEvent) => {
    e.preventDefault()
    const {authActions} = props
    authActions.showDefinitions(false)
  }

  const {authSelectors, definitions, errSelectors, getComponent} = props
  const AuthItem = getComponent("AuthItem")
  const Oauth2 = getComponent("oauth2", true)

  const authorized = authSelectors.authorized()
  const authorizedAuth = definitions.filter(
    (definition: any, key: string) => !!authorized.get(key),
  )
  const nonOauthDefinitions = definitions.filter(
    (schema: any) => schema.get("type") !== "oauth2",
  )
  const oauthDefinitions = definitions.filter(
    (schema: any) => schema.get("type") === "oauth2",
  )

  const defs: any = nonOauthDefinitions
    .entrySeq()
    .map(([name, schema]: any) => {
      return (
        <AuthItem
          key={name}
          authorized={authorized}
          errSelectors={errSelectors}
          getComponent={getComponent}
          name={name}
          onAuthChange={onAuthChange}
          schema={schema}
        />
      )
    })

  return (
    <div className="auth-container">
      {!!nonOauthDefinitions.size && (
        <form onSubmit={submitAuth}>
          {defs}
          <div className="auth-btn-wrapper">
            {nonOauthDefinitions.size === authorizedAuth.size ? (
              <Button
                aria-label="Remove authorization"
                onClick={logoutClick}
                variant="outline"
              >
                Logout
              </Button>
            ) : (
              <Button
                aria-label="Apply credentials"
                emphasis="primary"
                type="submit"
                variant="fill"
              >
                Authorize
              </Button>
            )}
            <Button onClick={close} variant="outline">
              Close
            </Button>
          </div>
        </form>
      )}
      {oauthDefinitions && oauthDefinitions.size ? (
        <div className="oauth-wrapper">
          <div className="scope-def">
            <p>
              Scopes are used to grant an application different levels of access
              to data on behalf of the end user. Each API may declare one or
              more scopes.
            </p>
            <p>
              API requires the following scopes. Select which ones you want to
              grant to Swagger UI.
            </p>
          </div>
          {definitions
            .filter((schema) => schema.get("type") === "oauth2")
            .entrySeq()
            .map(([name, schema]: any) => {
              return (
                <div key={name}>
                  <Oauth2 authorized={authorized} name={name} schema={schema} />
                </div>
              )
            })
            .toArray()}
        </div>
      ) : null}
    </div>
  )
}
