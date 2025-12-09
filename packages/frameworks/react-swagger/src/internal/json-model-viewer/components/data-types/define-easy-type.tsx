import {ComponentType, FC, memo} from "react"

import {useJsonViewerStore} from "../../stores"
import type {Colorspace} from "../../theme/base16"
import type {DataItemProps, DataType} from "../../type"
import {DataTypeLabel} from "../data-type-label"

export type EasyTypeConfig<Value> = Pick<
  DataType<Value>,
  "is" | "serialize" | "deserialize"
> & {
  Renderer: ComponentType<DataItemProps<Value>>
  colorKey: keyof Colorspace
  displayTypeLabel?: boolean
  type: string
}
/**
 * Enhanced version of `defineDataType` that creates a `DataType` with editor and a
 * optional type label. It will take care of the color and all the necessary props.
 *
 * All of the built-in data types are defined with this function.*
 *
 * @param type The type name.
 * @param colorKey The color key in the colorspace. ('base00' - 'base0F')
 * @param displayTypeLabel Whether to display the type label.
 * @param Renderer The component to render the value.
 */
export function defineEasyType<Value>({
  Renderer,
  colorKey,
  deserialize,
  displayTypeLabel = true,
  is,
  serialize,
  type,
}: EasyTypeConfig<Value>): DataType<Value> {
  const Render = memo(Renderer)
  const EasyType: FC<DataItemProps<Value>> = (props) => {
    const storeDisplayDataTypes = useJsonViewerStore(
      (store) => store.displayDataTypes,
    )
    const color = useJsonViewerStore((store) => store.colorspace[colorKey])

    return (
      <div className="simple-type" style={{color}}>
        {displayTypeLabel && storeDisplayDataTypes && (
          <DataTypeLabel dataType={type} />
        )}
        <div className={`${type}-value simple-value`}>
          <Render
            inspect={props.inspect}
            path={props.path}
            prevValue={props.prevValue}
            setInspect={props.setInspect}
            value={props.value}
          />
        </div>
      </div>
    )
  }
  EasyType.displayName = `easy-${type}-type`

  if (!serialize || !deserialize) {
    return {
      Component: EasyType,
      is,
    }
  }

  return {
    Component: EasyType,
    deserialize,
    is,
    serialize,
  }
}
