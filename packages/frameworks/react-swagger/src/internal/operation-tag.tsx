import type {ReactNode} from "react"

import {ChevronUpIcon, ExternalLinkIcon} from "lucide-react"

import {Collapsible} from "@qualcomm-ui/react/collapsible"
import {Icon} from "@qualcomm-ui/react/icon"
import {Link} from "@qualcomm-ui/react/link"
import {clsx} from "@qualcomm-ui/utils/clsx"

import type {GetComponent} from "./types"
import {
  createDeepLinkPath,
  escapeDeepLinkPath,
  isFunc,
  safeBuildUrl,
  sanitizeUrl,
} from "./utils"

interface Props {
  children?: ReactNode
  getComponent: GetComponent
  getConfigs: () => any
  layoutActions: any
  layoutSelectors: any
  oas3Selectors: any
  specUrl: string
  tag: string
  tagObj: any
}

export function OperationTag(props: Props) {
  const {
    children,
    getComponent,
    getConfigs,
    layoutActions,
    layoutSelectors,
    oas3Selectors,
    specUrl,
    tag,
    tagObj,
  } = props

  const {deepLinking, docExpansion} = getConfigs()

  const Markdown = getComponent("Markdown", true)
  const DeepLink = getComponent("DeepLink")

  const tagDescription = tagObj.getIn(["tagDetails", "description"], null)
  const tagExternalDocsDescription = tagObj.getIn([
    "tagDetails",
    "externalDocs",
    "description",
  ])
  const rawTagExternalDocsUrl = tagObj.getIn([
    "tagDetails",
    "externalDocs",
    "url",
  ])
  let tagExternalDocsUrl
  if (isFunc(oas3Selectors) && isFunc(oas3Selectors.selectedServer)) {
    tagExternalDocsUrl = safeBuildUrl(rawTagExternalDocsUrl, specUrl, {
      selectedServer: oas3Selectors.selectedServer(),
    })
  } else {
    tagExternalDocsUrl = rawTagExternalDocsUrl
  }

  const isShownKey = ["operations-tag", tag]
  const showTag = layoutSelectors.isShown(
    isShownKey,
    docExpansion === "full" || docExpansion === "list",
  )

  return (
    <div
      className={
        showTag ? "opblock-tag-section is-open" : "opblock-tag-section"
      }
    >
      <h3
        className={!tagDescription ? "opblock-tag no-desc" : "opblock-tag"}
        data-is-open={showTag}
        data-tag={tag}
        id={isShownKey.map((v) => escapeDeepLinkPath(v)).join("-")}
        onClick={() => layoutActions.show(isShownKey, !showTag)}
      >
        <DeepLink
          enabled={deepLinking}
          isShown={showTag}
          path={createDeepLinkPath(tag)}
          text={tag}
        />
        {!tagDescription ? (
          <small></small>
        ) : (
          <small>
            <Markdown source={tagDescription} />
          </small>
        )}

        {!tagExternalDocsUrl ? null : (
          <Link
            className="info__externaldocs external-link"
            endIcon={ExternalLinkIcon}
            href={sanitizeUrl(tagExternalDocsUrl)}
            onClick={(e: any) => e.stopPropagation()}
            render={<a target="_blank" />}
          >
            {tagExternalDocsDescription || tagExternalDocsUrl}
          </Link>
        )}

        <button
          aria-expanded={showTag}
          className="expand-operation"
          onClick={() => layoutActions.show(isShownKey, !showTag)}
          title={showTag ? "Collapse operation" : "Expand operation"}
        >
          <Icon
            className={clsx("collapse-icon", {"is-open": showTag})}
            icon={ChevronUpIcon}
            size="xl"
          />
        </button>
      </h3>

      <Collapsible.Root open={showTag}>
        <Collapsible.Content>{children}</Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}
