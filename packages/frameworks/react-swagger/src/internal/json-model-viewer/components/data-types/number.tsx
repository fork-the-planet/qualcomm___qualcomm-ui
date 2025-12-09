import {useJsonViewerStore} from "../../stores"

import {defineEasyType} from "./define-easy-type"

const isInt = (n: number) => n % 1 === 0

export const nanType = defineEasyType<number>({
  Renderer: () => {
    const backgroundColor = useJsonViewerStore(
      (store) => store.colorspace.base02,
    )
    return (
      <div className="rounded-sm px-0.5 py-[1px]" style={{backgroundColor}}>
        NaN
      </div>
    )
  },
  colorKey: "base08",
  // allow deserialize the value back to number
  deserialize: (value) => parseFloat(value),
  displayTypeLabel: false,
  is: (value) => typeof value === "number" && isNaN(value),
  serialize: () => "NaN",
  type: "NaN",
})

export const floatType = defineEasyType<number>({
  Renderer: ({value}) => <>{value}</>,
  colorKey: "base0B",
  deserialize: (value) => parseFloat(value),
  is: (value) => typeof value === "number" && !isInt(value) && !isNaN(value),
  serialize: (value) => value.toString(),
  type: "float",
})

export const intType = defineEasyType<number>({
  Renderer: ({value}) => <>{value}</>,
  colorKey: "base0F",
  // allow deserialize the value to float
  deserialize: (value) => parseFloat(value),
  is: (value) => typeof value === "number" && isInt(value),
  serialize: (value) => value.toString(),
  type: "int",
})

export const bigIntType = defineEasyType<bigint>({
  Renderer: ({value}) => <>{`${value}n`}</>,
  colorKey: "base0F",
  deserialize: (value) => BigInt(value.replace(/\D/g, "")),
  is: (value) => typeof value === "bigint",
  serialize: (value) => value.toString(),
  type: "bigint",
})
