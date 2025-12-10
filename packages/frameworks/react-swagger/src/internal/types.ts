import type {List, OrderedMap} from "immutable"

export type GetComponent = (name: string, flag?: boolean) => any

export type Schema = OrderedMap<string, string | Schema>

export interface QuiSwaggerContext {
  hash: string
  hideTitleSection?: boolean
}

export interface JsonSchemaProps {
  description: any
  disabled: boolean
  dispatchInitialValue?: boolean
  errors: List<any>
  fn?: any
  getComponent: GetComponent
  keyName: any
  onChange?: Function
  required: boolean
  schema: any
  value: any
}
