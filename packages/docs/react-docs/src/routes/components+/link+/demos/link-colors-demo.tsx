import type {ReactElement} from "react"

import {Link} from "@qualcomm-ui/react/link"

export function LinkColorsDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <Link>default</Link>
      <Link emphasis="neutral">neutral</Link>
      <Link emphasis="brand">brand</Link>
      <div className="bg-persistent-black p-4">
        <Link emphasis="white-persistent">white-persistent</Link>
      </div>
      {/* preview */}
    </div>
  )
}
