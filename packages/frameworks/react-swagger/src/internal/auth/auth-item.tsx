// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {GetComponent, Schema} from "../types"

interface AuthItemProps {
  authorized: any
  errSelectors: any
  getComponent: GetComponent
  name: string
  onAuthChange: (auth: any) => void
  schema: Schema
}

export function AuthItem(props: AuthItemProps) {
  const {authorized, errSelectors, getComponent, name, onAuthChange, schema} =
    props
  const ApiKeyAuth = getComponent("apiKeyAuth")
  const BasicAuth = getComponent("basicAuth")

  let authEl
  const type: any = schema.get("type")

  switch (type) {
    case "apiKey":
      authEl = (
        <ApiKeyAuth
          key={name}
          authorized={authorized}
          errSelectors={errSelectors}
          getComponent={getComponent}
          name={name}
          onChange={onAuthChange}
          schema={schema}
        />
      )
      break
    case "basic":
      authEl = (
        <BasicAuth
          key={name}
          authorized={authorized}
          errSelectors={errSelectors}
          getComponent={getComponent}
          name={name}
          onChange={onAuthChange}
          schema={schema}
        />
      )
      break
    default:
      authEl = <div key={name}>Unknown security definition type {type}</div>
  }

  return <div key={`${name}-jump`}>{authEl}</div>
}
