import {ReactNode} from "react"

import {DocsCodeMirror} from "../code-mirror"

import {JsonSchemaProps} from "./types"
import {useThemeContext} from "./use-theme-context"
import {stringify} from "./utils"

JsonSchemaObject.displayName = "JsonSchemaObject"

export function JsonSchemaObject(props: JsonSchemaProps): ReactNode {
  const onChange = (value: any) => {
    props.onChange?.(value)
  }

  const handleOnChange = (value: string) => {
    onChange(value)
  }

  const {disabled, value} = props

  const theme = useThemeContext()

  return (
    <div>
      <DocsCodeMirror
        basicSetup={{
          foldGutter: false,
          lineNumbers: false,
          lintKeymap: true,
        }}
        editable={!disabled}
        language="json"
        onChange={handleOnChange}
        theme={theme}
        value={stringify(value)}
      />
    </div>
  )
}
