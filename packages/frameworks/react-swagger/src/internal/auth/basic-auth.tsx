// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useState} from "react"

import {PasswordInput} from "@qualcomm-ui/react/password-input"
import {TextInput} from "@qualcomm-ui/react/text-input"

import type {GetComponent} from "../types"

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

  const onChange = (value: string, name: string) => {
    const {onChange} = props
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
        {username ? (
          <TextInput
            clearable={false}
            disabled
            label="Username"
            value={username}
          />
        ) : (
          <Col>
            <TextInput
              inputProps={{
                autoFocus: true,
                id: "auth_username",
              }}
              label="Username"
              name="username"
              onValueChange={(value) => onChange(value, "username")}
            />
          </Col>
        )}
      </Row>
      <Row>
        {username ? (
          <PasswordInput
            clearable={false}
            disabled
            label="Password"
            value={((state.value as any)?.[state.name] as string) || ""}
          />
        ) : (
          <Col>
            <PasswordInput
              inputProps={{
                id: "auth_password",
              }}
              label="Password"
              name="password"
              onValueChange={(value) => onChange(value, "password")}
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
