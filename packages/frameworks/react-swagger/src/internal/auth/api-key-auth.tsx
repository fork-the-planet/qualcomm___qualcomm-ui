import {useState} from "react"

import {TextInput} from "@qualcomm-ui/react/text-input"

import type {GetComponent} from "../types"

interface ApiKeyAuthProps {
  authorized: any
  errSelectors: any
  getComponent: GetComponent
  name: string
  onChange: (auth: any) => void
  schema: any
}

export function ApiKeyAuth(props: ApiKeyAuthProps) {
  const getValue = () => {
    const {authorized, name} = props
    return authorized && authorized.getIn([name, "value"])
  }

  const [state, setState] = useState({
    name: props.name,
    schema: props.schema,
    value: getValue(),
  })

  const onChange = (value: string) => {
    const newState = {...state, value}
    setState(newState)
    props.onChange?.(newState)
  }

  const {errSelectors, getComponent, name, schema} = props
  const Row = getComponent("Row")
  const Col = getComponent("Col")
  const AuthError = getComponent("authError")
  const Markdown = getComponent("Markdown", true)
  const JumpToPath = getComponent("JumpToPath", true)
  const value = getValue()
  const errors = errSelectors
    .allErrors()
    .filter((err: any) => err.get("authId") === name)

  return (
    <div className="api-key-wrapper">
      <h4 className="text-primary q-font-heading-sm-subtle">
        <code>{name || schema.get("name")}</code> (apiKey)
        <JumpToPath path={["securityDefinitions", name]} />
      </h4>
      {value && <h6>Authorized</h6>}
      <Row>
        <Markdown source={schema.get("description")} />
      </Row>
      <Row>
        <p className="text-primary q-font-body-sm">
          Name: <code className="qui-code">{schema.get("name")}</code>
        </p>
      </Row>
      <Row>
        <p className="text-primary q-font-body-sm">
          In: <code className="qui-code">{schema.get("in")}</code>
        </p>
      </Row>
      <Row>
        {value ? (
          <TextInput clearable={false} disabled value="******" />
        ) : (
          <Col>
            <TextInput
              className="q-swagger-input"
              inputProps={{autoFocus: true}}
              onValueChange={onChange}
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
