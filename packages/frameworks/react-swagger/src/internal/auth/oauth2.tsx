import {MouseEvent, ReactNode, SyntheticEvent, useState} from "react"

import {QButton, QCheckbox, QCombobox, QTextInput} from "@qui/react"
import SwaggerUI from "@qui/swagger-ui-react"

const oauth2Authorize = SwaggerUI.oauth2Authorize

import {GetComponent} from "../types"

Oauth2.displayName = "Oauth2"

export interface Oauth2Props {
  authActions: any
  authSelectors: any
  authorized?: any
  errActions: any
  errSelectors: any
  getComponent: GetComponent
  getConfigs?: any
  name?: string
  oas3Selectors: any
  schema: any
  specSelectors: any
}

export function Oauth2(props: Oauth2Props): ReactNode {
  const {
    authSelectors,
    authorized,
    errSelectors,
    getComponent,
    name,
    schema,
    specSelectors,
  } = props
  const auth = authorized && authorized.get(name)
  let authConfigs = authSelectors.getConfigs() || {}
  const username = (auth && auth.get("username")) || ""
  const clientId = (auth && auth.get("clientId")) || authConfigs.clientId || ""
  const clientSecret =
    (auth && auth.get("clientSecret")) || authConfigs.clientSecret || ""
  const passwordType = (auth && auth.get("passwordType")) || "basic"
  let scopes = (auth && auth.get("scopes")) || authConfigs.scopes || []
  if (typeof scopes === "string") {
    scopes = scopes.split(authConfigs.scopeSeparator || " ")
  }

  const [state, setState] = useState({
    appName: authConfigs.appName,
    clientId,
    clientSecret,
    name,
    password: "",
    passwordType,
    schema,
    scopes,
    username,
  })

  const close = (e: SyntheticEvent) => {
    e.preventDefault()
    const {authActions} = props

    authActions.showDefinitions(false)
  }

  const authorize = () => {
    const {authActions, authSelectors, errActions, getConfigs, oas3Selectors} =
      props
    const configs = getConfigs()
    const authConfigs = authSelectors.getConfigs()

    errActions.clear({authId: name, source: "auth", type: "auth"})
    oauth2Authorize({
      auth: state,
      authActions,
      authConfigs,
      configs,
      currentServer: oas3Selectors.serverEffectiveValue(
        oas3Selectors.selectedServer(),
      ),
      errActions,
    })
  }

  const onScopeChange = (scope: string, checked: boolean) => {
    if (checked && state.scopes.indexOf(scope) === -1) {
      const newScopes = state.scopes.concat([scope])
      setState((prevState) => ({...prevState, scopes: newScopes}))
    } else if (!checked && state.scopes.indexOf(scope) > -1) {
      setState((prevState) => ({
        ...prevState,
        scopes: state.scopes.filter((val: any) => val !== scope),
      }))
    }
  }

  const onInputChange = (name: string, value: any) => {
    const state = {
      [name]: value,
    }

    setState((prevState) => ({...prevState, ...state}))
  }

  const selectScopes = (e: any) => {
    if (e.target.dataset.all) {
      setState((prevState) => ({
        ...prevState,
        scopes: Array.from(
          (
            props.schema.get("allowedScopes") || props.schema.get("scopes")
          ).keys(),
        ),
      }))
    } else {
      setState((prevState) => ({...prevState, scopes: []}))
    }
  }

  const logout = (e: any) => {
    e.preventDefault()
    const {authActions, errActions, name} = props

    errActions.clear({authId: name, source: "auth", type: "auth"})
    authActions.logoutWithPersistOption([name])
  }

  const Row = getComponent("Row")
  const Col = getComponent("Col")
  const AuthError = getComponent("authError")
  const JumpToPath = getComponent("JumpToPath", true)
  const Markdown = getComponent("Markdown", true)

  const {isOAS3} = specSelectors

  const oidcUrl = isOAS3() ? schema.get("openIdConnectUrl") : null

  // Auth type consts
  const AUTH_FLOW_IMPLICIT = "implicit"
  const AUTH_FLOW_PASSWORD = "password"
  const AUTH_FLOW_ACCESS_CODE = isOAS3()
    ? oidcUrl
      ? "authorization_code"
      : "authorizationCode"
    : "accessCode"
  const AUTH_FLOW_APPLICATION = isOAS3()
    ? oidcUrl
      ? "client_credentials"
      : "clientCredentials"
    : "application"

  authConfigs = authSelectors.getConfigs() || {}
  const isPkceCodeGrant = !!authConfigs.usePkceWithAuthorizationCodeGrant

  const flow = schema.get("flow")
  const flowToDisplay =
    flow === AUTH_FLOW_ACCESS_CODE && isPkceCodeGrant
      ? `${flow} with PKCE`
      : flow
  scopes = schema.get("allowedScopes") || schema.get("scopes")
  const authorizedAuth = authSelectors.authorized().get(name)
  const isAuthorized = !!authorizedAuth
  const errors = errSelectors
    .allErrors()
    .filter((err: any) => err.get("authId") === name)
  const isValid = !errors.filter(
    (err: any) => err.get("source") === "validation",
  ).size
  const description = schema.get("description")

  return (
    <div className="oauth2-wrapper">
      <h4 className="q-font-heading-xs-subtle">
        {name} (OAuth2, {flowToDisplay}){" "}
        <JumpToPath path={["securityDefinitions", name]} />
      </h4>
      {!state.appName ? null : <h5>Application: {state.appName} </h5>}
      {description && <Markdown source={schema.get("description")} />}

      {isAuthorized && <h6>Authorized</h6>}

      {oidcUrl && (
        <p className="text-primary q-font-body-sm">
          OpenID Connect URL: <code className="qui-code">{oidcUrl}</code>
        </p>
      )}
      {(flow === AUTH_FLOW_IMPLICIT || flow === AUTH_FLOW_ACCESS_CODE) && (
        <p className="text-primary q-font-body-sm">
          Authorization URL:{" "}
          <code className="qui-code">{schema.get("authorizationUrl")}</code>
        </p>
      )}
      {(flow === AUTH_FLOW_PASSWORD ||
        flow === AUTH_FLOW_ACCESS_CODE ||
        flow === AUTH_FLOW_APPLICATION) && (
        <p className="text-primary q-font-body-sm">
          Token URL:<code className="qui-code"> {schema.get("tokenUrl")}</code>
        </p>
      )}
      <p className="text-primary q-font-body-sm">
        Flow: <code className="qui-code">{flowToDisplay}</code>
      </p>

      {flow !== AUTH_FLOW_PASSWORD ? null : (
        <Row>
          <Row>
            {isAuthorized ? (
              <code className="qui-code">{state.username}</code>
            ) : (
              <Col desktop={10} tablet={10}>
                <QTextInput
                  autoFocus
                  data-name="username"
                  label="Username:"
                  onChange={(event, value) => onInputChange("username", value)}
                />
              </Col>
            )}
          </Row>
          <Row>
            <label htmlFor="oauth_password">password:</label>
            {isAuthorized ? (
              <code className="qui-code">******</code>
            ) : (
              <Col desktop={10} tablet={10}>
                <QTextInput
                  className="q-swagger-input"
                  data-name="password"
                  id="oauth_password"
                  inputProps={{type: "password"}}
                  onChange={(event, value) => onInputChange("password", value)}
                />
              </Col>
            )}
          </Row>
          <Row>
            <label htmlFor="password_type">Client credentials location:</label>
            {isAuthorized ? (
              <code> {state.passwordType} </code>
            ) : (
              <Col desktop={10} tablet={10}>
                <QCombobox
                  data-name="passwordType"
                  id="password_type"
                  onChange={(event, value) =>
                    onInputChange("passwordType", value)
                  }
                  options={["Authorization header", "Request body"]}
                />
              </Col>
            )}
          </Row>
        </Row>
      )}
      {(flow === AUTH_FLOW_APPLICATION ||
        flow === AUTH_FLOW_IMPLICIT ||
        flow === AUTH_FLOW_ACCESS_CODE ||
        flow === AUTH_FLOW_PASSWORD) &&
        (!isAuthorized || (isAuthorized && state.clientId)) && (
          <Row>
            <label htmlFor={`client_id_${flow}`}>client_id:</label>
            {isAuthorized ? (
              <QTextInput clearable={false} disabled value="******" />
            ) : (
              <Col desktop={10} tablet={10}>
                <QTextInput
                  className="q-swagger-input"
                  data-name="clientId"
                  defaultValue={state.clientId}
                  id={`client_id_${flow}`}
                  onChange={(event, value) => onInputChange("clientId", value)}
                />
              </Col>
            )}
          </Row>
        )}

      {(flow === AUTH_FLOW_APPLICATION ||
        flow === AUTH_FLOW_ACCESS_CODE ||
        flow === AUTH_FLOW_PASSWORD) && (
        <Row>
          <label htmlFor={`client_secret_${flow}`}>client_secret:</label>
          {isAuthorized ? (
            <QTextInput clearable={false} disabled value="******" />
          ) : (
            <Col desktop={10} tablet={10}>
              <QTextInput
                className="q-swagger-input"
                data-name="clientSecret"
                defaultValue={state.clientSecret}
                id={`client_secret_${flow}`}
                inputProps={{type: "password"}}
                onChange={(event, value) =>
                  onInputChange("clientSecret", value)
                }
              />
            </Col>
          )}
        </Row>
      )}

      {!isAuthorized && scopes && scopes.size ? (
        <div className="scopes">
          <div className="scope-actions">
            Scopes:
            <button className="q-text-link" data-all onClick={selectScopes}>
              select all
            </button>
            <button className="q-text-link" onClick={selectScopes}>
              select none
            </button>
          </div>
          {scopes
            .map((description: any, name: string) => {
              return (
                <Row key={name}>
                  <QCheckbox
                    checked={state.scopes.includes(name)}
                    data-value={name}
                    disabled={isAuthorized}
                    inputProps={{["data-value"]: name} as any}
                    label={
                      <div className="text">
                        <p className="name">{name}</p>
                        <p className="description">{description}</p>
                      </div>
                    }
                    onChange={(event, checked) => {
                      onScopeChange(name, checked)
                    }}
                    onClick={(event: MouseEvent) => {
                      event.preventDefault()
                      onScopeChange(name, !state.scopes.includes(name))
                    }}
                  />
                </Row>
              )
            })
            .toArray()}
        </div>
      ) : null}

      {errors.valueSeq().map((error: any, key: string) => {
        return <AuthError key={key} error={error} />
      })}
      <div className="auth-btn-wrapper">
        {isValid &&
          (isAuthorized ? (
            <QButton
              aria-label="Remove authorization"
              onClick={logout}
              variant="fill"
            >
              Logout
            </QButton>
          ) : (
            <QButton
              aria-label="Apply given OAuth2 credentials"
              color="primary"
              onClick={authorize}
              variant="fill"
            >
              Authorize
            </QButton>
          ))}
        <QButton onClick={close} variant="outline">
          Close
        </QButton>
      </div>
    </div>
  )
}
