import type {ComponentPropsWithRef, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"

interface MdxH1Props extends ComponentPropsWithRef<"h1"> {
  "data-page-title"?: ""
}

export function MdxH1({
  children,
  className,
  "data-page-title": dataPageTitle,
  id,
  ...props
}: MdxH1Props): ReactNode {
  if (dataPageTitle === "") {
    return null
  }

  return (
    <h1 className={clsx(className, "mdx")} id={id || undefined} {...props}>
      {children}
    </h1>
  )
}
