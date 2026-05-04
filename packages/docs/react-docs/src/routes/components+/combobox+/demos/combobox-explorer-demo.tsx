import type {ReactElement} from "react"

import {Combobox} from "@qualcomm-ui/react/combobox"
import {useListCollection} from "@qualcomm-ui/react-core/collection"

export function ComboboxExplorerDemo(): ReactElement {
  const {collection} = useListCollection({
    initialItems: ["React", "Angular", "Vue"],
  })

  return (
    <Combobox
      className="w-48"
      collection={collection}
      defaultOpen
      defaultValue={["React"]}
      hint="Choose a framework"
      label="Framework"
      placeholder="Select a framework"
      portalProps={{disabled: true}}
    />
  )
}
