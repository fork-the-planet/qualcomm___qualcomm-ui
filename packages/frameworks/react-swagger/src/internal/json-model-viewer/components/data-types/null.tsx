import {useJsonViewerStore} from "../../stores"

import {defineEasyType} from "./define-easy-type"

export const nullType = defineEasyType<null>({
  Renderer: () => {
    const backgroundColor = useJsonViewerStore(
      (store) => store.colorspace.base02,
    )
    return (
      <div
        className="rounded-sm px-0.5 py-[1px] q-font-metadata-md-mono"
        style={{
          backgroundColor,
        }}
      >
        NULL
      </div>
    )
  },
  colorKey: "base08",
  displayTypeLabel: false,
  is: (value) => value === null,
  type: "null",
})
