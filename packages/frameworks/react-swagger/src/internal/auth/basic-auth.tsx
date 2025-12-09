import {ChangeEvent, useState} from "react"

import {QTextInput} from "@qui/react"

import {GetComponent} from "../types"

interface BasicAuthProps {
  authorized: any
  errSelectors: any
  getComponent: GetComponent
  name: string
  onChange: (auth: any) => void
  schema: any
}

export function BasicAuth(props: BasicAuthProps) {
  const [state, setState] = useState({
    name: props.name,
    schema: props.schema,
    value: {},
  })

  const getValue = () => {
    const {authorized, name} = props
    return (authorized && authorized.getIn([name, "value"])) || {}
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {onChange} = props
    const {name, value} = e.target
    const newValue = {...state.value, [name]: value}
    setState({...state, value: newValue})
    onChange(state)
  }

  const {errSelectors, getComponent, name, schema} = props
  const Row = getComponent("Row")
  const Col = getComponent("Col")
  const AuthError = getComponent("authError")
  const JumpToPath = getComponent("JumpToPath", true)
  const Markdown = getComponent("Markdown", true)
  const username = getValue().username
  const errors = errSelectors
    .allErrors()
    .filter((err: any) => err.get("authId") === name)

  return (
    <div>
      <h4>
        Basic authorization
        <JumpToPath path={["securityDefinitions", name]} />
      </h4>
      {username && <h6>Authorized</h6>}
      <Row>
        <Markdown source={schema.get("description")} />
      </Row>
      <Row>
        <label htmlFor="auth_username">Username:</label>
        {username ? (
          <QTextInput clearable={false} disabled value={username} />
        ) : (
          <Col>
            <QTextInput
              autoFocus
              id="auth_username"
              inputProps={{type: "text"}}
              name="password"
              onChange={(event) =>
                onChange(event as ChangeEvent<HTMLInputElement>)
              }
            />
          </Col>
        )}
      </Row>
      <Row>
        <label htmlFor="auth_password">Password:</label>
        {username ? (
          <QTextInput clearable={false} disabled value="******" />
        ) : (
          <Col>
            <QTextInput
              id="auth_password"
              inputProps={{autoComplete: "new-password", type: "password"}}
              name="password"
              onChange={(event) =>
                onChange(event as ChangeEvent<HTMLInputElement>)
              }
            />
          </Col>
        )}
      </Row>
      {errors.valueSeq().map((error: any, key: number) => (
        <AuthError key={key} error={error} />
      ))}
    </div>
  )
}
