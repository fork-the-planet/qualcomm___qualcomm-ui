import {ReactNode} from "react"

import {Link2Icon} from "lucide-react"

import {clsx} from "@qui/base"
import {QIconButton} from "@qui/react"

import {useJsonViewerStore} from "../../stores"

RefName.displayName = "RefName"

export interface RefNameProps {
  inspect: boolean
  isArray?: boolean
  refName: string
}

export function RefName({inspect, isArray, refName}: RefNameProps): ReactNode {
  const Link = useJsonViewerStore((store) => store.renderLink)
  return (
    <span className="data-ref-name-wrapper">
      <span className={clsx("data-ref-name", {inspect})}>
        {refName}
        {isArray ? "[]" : ""}
      </span>
      <QIconButton
        as={Link}
        dense
        href={`#model-${refName}`}
        icon={Link2Icon}
        size="s"
      />
    </span>
  )
}
