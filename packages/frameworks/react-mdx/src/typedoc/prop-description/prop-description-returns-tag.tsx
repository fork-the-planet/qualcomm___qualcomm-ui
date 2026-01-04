import type {ReactElement} from "react"

import type {QuiCommentTag} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionSummary} from "./prop-description-summary"

export interface PropDescriptionReturnsTagProps {
  tag: QuiCommentTag
}

export function PropDescriptionReturnsTag({
  tag,
}: PropDescriptionReturnsTagProps): ReactElement {
  return (
    <div className="doc-props-description__returns-tag-root">
      <div className="doc-props-description__returns-tag-label">Returns:</div>
      <div className="doc-props-description__returns-tag-content">
        <PropDescriptionSummary summary={tag.content} />
      </div>
    </div>
  )
}
