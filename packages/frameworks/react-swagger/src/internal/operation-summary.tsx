import {MouseEvent, ReactNode} from "react"

import {List} from "immutable"
import {toString} from "lodash-es"
import {ChevronUpIcon, Link2} from "lucide-react"

import {clsx} from "@qui/base"
import {QIcon, QIconButton} from "@qui/react"

import {GetComponent} from "./types"
import {useJumpToHash} from "./use-jump-to-hash"
import {RenderLink} from "./utils"

OperationSummary.displayName = "OperationSummary"

export interface OperationSummaryProps {
  authActions?: any
  authSelectors?: any
  fn: any
  getComponent: GetComponent
  getConfigs: () => any
  isShown: boolean
  operationProps: any
  specPath: List<any>
  toggleShown: () => void
}

export function OperationSummary({
  authActions,
  authSelectors,
  fn,
  getComponent,
  isShown,
  operationProps,
  specPath,
  toggleShown,
}: OperationSummaryProps): ReactNode {
  const {
    displayOperationId,
    isAuthorized,
    method,
    op,
    operationId,
    originalOperationId,
    showSummary,
    summary,
  } = operationProps.toJS()

  const {summary: resolvedSummary} = op

  const security = operationProps.get("security")

  const AuthorizeOperationBtn = getComponent("authorizeOperationBtn", true)
  const OperationSummaryMethod = getComponent("OperationSummaryMethod")
  const OperationSummaryPath = getComponent("OperationSummaryPath")

  const hasSecurity = security && !!security.count()
  const securityIsOptional =
    hasSecurity && security.size === 1 && security.first().isEmpty()
  const allowAnonymous = !hasSecurity || securityIsOptional

  const id = `${operationId}-1`

  const Link: RenderLink = getComponent("RenderLink")

  useJumpToHash(fn.getHash, id, () => {
    toggleShown()
  })

  return (
    <div className="opblock-summary">
      <div className="opblock-summary-id" id={id}></div>
      <button
        aria-expanded={isShown}
        className="opblock-summary-control"
        onClick={toggleShown}
      >
        <QIconButton
          as={Link}
          href={`#${id}`}
          icon={Link2}
          onClick={(event: MouseEvent) => {
            if (!isShown) {
              toggleShown()
            }
            event.stopPropagation()
          }}
          size="m"
          style={{marginRight: 8}}
          variant="outline"
        />
        <OperationSummaryMethod method={method} />
        <div className="opblock-summary-path-description-wrapper">
          <OperationSummaryPath
            getComponent={getComponent}
            operationProps={operationProps}
            specPath={specPath}
          />

          {!showSummary ? null : (
            <div className="opblock-summary-description">
              {toString(resolvedSummary || summary)}
            </div>
          )}
        </div>

        {displayOperationId && (originalOperationId || operationId) ? (
          <span className="opblock-summary-operation-id">
            {originalOperationId || operationId}
          </span>
        ) : null}
        <QIcon
          className={clsx("collapse-icon", {"is-open": isShown})}
          icon={ChevronUpIcon}
          size={24}
        />
      </button>
      {allowAnonymous ? null : (
        <AuthorizeOperationBtn
          isAuthorized={isAuthorized}
          onClick={() => {
            const applicableDefinitions =
              authSelectors.definitionsForRequirements(security)
            authActions.showDefinitions(applicableDefinitions)
          }}
        />
      )}
    </div>
  )
}
