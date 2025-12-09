import {useEffect, useState} from "react"

import {List} from "immutable"

import {QCollapse, QInlineAlert, QProgressBar} from "@qui/react"

import {GetComponent} from "./types"
import {
  escapeDeepLinkPath,
  getExtensions,
  getList,
  safeBuildUrl,
  sanitizeUrl,
} from "./utils"

interface Props {
  authActions?: any
  authSelectors?: any
  fn: any
  getComponent: GetComponent
  getConfigs: () => any
  layoutActions: any
  layoutSelectors: any
  oas3Actions: any
  oas3Selectors: any
  onCancelClick: () => void
  onExecute: () => void
  onResetClick: () => void
  onTryoutClick: () => void
  operation: any
  request?: Iterable<any>
  response?: any
  specActions: any
  specPath: any
  specSelectors: any
  summary?: string
  toggleShown: () => void
}

export function Operation({
  authActions,
  authSelectors,
  fn,
  getComponent,
  getConfigs,
  oas3Actions,
  oas3Selectors,
  onCancelClick,
  onExecute,
  onResetClick,
  onTryoutClick,
  operation: operationProps,
  request,
  response,
  specActions,
  specPath = List(),
  specSelectors,
  toggleShown,
}: Props) {
  const {
    allowTryItOut,
    deprecated,
    displayRequestDuration,
    executeInProgress,
    isShown,
    method,
    op,
    operationId,
    path,
    tag,
    tryItOutEnabled,
  } = operationProps.toJS()

  const {description, externalDocs, schemes} = op

  const externalDocsUrl = externalDocs
    ? safeBuildUrl(externalDocs.url, specSelectors.url(), {
        selectedServer: oas3Selectors.selectedServer(),
      })
    : ""
  const operation = operationProps.getIn(["op"])
  const responses = operation.get("responses")
  const parameters = getList(operation, ["parameters"])
  const operationScheme = specSelectors.operationScheme(path, method)
  const isShownKey = ["operations", tag, operationId]
  const extensions = getExtensions(operation)

  const Responses = getComponent("responses")
  const Parameters = getComponent("parameters")
  const Execute = getComponent("execute")
  const Collapse = getComponent("Collapse")
  const Clear = getComponent("clear")
  const Markdown = getComponent("Markdown", true)
  const Schemes = getComponent("schemes")
  const OperationServers = getComponent("OperationServers")
  const OperationExt = getComponent("OperationExt")
  const OperationSummary = getComponent("OperationSummary")
  const Link = getComponent("Link")

  const {showExtensions} = getConfigs()

  // Merge in Live Response
  if (responses && response && response.size > 0) {
    const notDocumented =
      !responses.get(String(response.get("status"))) &&
      !responses.get("default")
    response = response.set("notDocumented", notDocumented)
  }

  const onChangeKey = [path, method] // Used to add values to _this_ operation ( indexed by path and method )

  const validationErrors = specSelectors.validationErrors([path, method])

  const [loaded, setLoaded] = useState(false)

  /**
   * After the children load in, we replace the <Collapse> element with <QCollapse>.
   * There isn't a way to detect this, so wait 50ms.
   */
  useEffect(() => {
    let mounted = true
    if (isShown) {
      setTimeout(() => {
        if (mounted) {
          setLoaded(true)
        }
      }, 50)
    }
    return () => {
      mounted = false
    }
  }, [isShown])

  const body = (
    <div className="opblock-body">
      {(operation && operation.size) || operation === null ? null : (
        <QProgressBar />
      )}
      {deprecated && (
        <h4 className="opblock-title_normal"> Warning: Deprecated</h4>
      )}
      {description && (
        <div className="opblock-description-wrapper">
          <div className="opblock-description">
            <Markdown source={description} />
          </div>
        </div>
      )}
      {externalDocsUrl ? (
        <div className="opblock-external-docs-wrapper">
          <h4 className="opblock-title_normal">Find more details</h4>
          <div className="opblock-external-docs">
            {externalDocs.description && (
              <span className="opblock-external-docs__description">
                <Markdown source={externalDocs.description} />
              </span>
            )}
            <Link
              className="opblock-external-docs__link"
              href={sanitizeUrl(externalDocsUrl)}
              target="_blank"
            >
              {externalDocsUrl}
            </Link>
          </div>
        </div>
      ) : null}

      {!operation || !operation.size ? null : (
        <Parameters
          allowTryItOut={allowTryItOut}
          fn={fn}
          getComponent={getComponent}
          getConfigs={getConfigs}
          oas3Actions={oas3Actions}
          oas3Selectors={oas3Selectors}
          onCancelClick={onCancelClick}
          onChangeKey={onChangeKey}
          onResetClick={onResetClick}
          onTryoutClick={onTryoutClick}
          operation={operation}
          parameters={parameters}
          pathMethod={[path, method]}
          specActions={specActions}
          specPath={specPath.push("parameters")}
          specSelectors={specSelectors}
          tryItOutEnabled={tryItOutEnabled}
        />
      )}

      {!tryItOutEnabled ? null : (
        <OperationServers
          getComponent={getComponent}
          getEffectiveServerValue={oas3Selectors.serverEffectiveValue}
          getSelectedServer={oas3Selectors.selectedServer}
          getServerVariable={oas3Selectors.serverVariableValue}
          method={method}
          operationServers={operation.get("servers")}
          path={path}
          pathServers={specSelectors.paths().getIn([path, "servers"])}
          setSelectedServer={oas3Actions.setSelectedServer}
          setServerVariableValue={oas3Actions.setServerVariableValue}
        />
      )}

      {!tryItOutEnabled || !allowTryItOut ? null : schemes && schemes.size ? (
        <div className="opblock-schemes">
          <Schemes
            currentScheme={operationScheme}
            method={method}
            path={path}
            schemes={schemes}
            specActions={specActions}
          />
        </div>
      ) : null}

      {!tryItOutEnabled ||
      !allowTryItOut ||
      validationErrors.length <= 0 ? null : (
        <div className="errors-wrapper">
          <QInlineAlert
            color="negative"
            description={
              <div>
                Please correct the following validation errors and try again.
              </div>
            }
            label="Error"
          />
        </div>
      )}

      <div
        className={
          !tryItOutEnabled || !response || !allowTryItOut
            ? "execute-wrapper"
            : "btn-group"
        }
      >
        {!tryItOutEnabled || !allowTryItOut ? null : (
          <Execute
            disabled={executeInProgress}
            method={method}
            oas3Actions={oas3Actions}
            oas3Selectors={oas3Selectors}
            onExecute={onExecute}
            operation={operation}
            path={path}
            specActions={specActions}
            specSelectors={specSelectors}
          />
        )}

        {!tryItOutEnabled || !response || !allowTryItOut ? null : (
          <Clear method={method} path={path} specActions={specActions} />
        )}
      </div>

      {executeInProgress ? <QProgressBar /> : <div style={{height: 4}}></div>}

      {!responses ? null : (
        <Responses
          displayRequestDuration={displayRequestDuration}
          fn={fn}
          getComponent={getComponent}
          getConfigs={getConfigs}
          method={method}
          oas3Actions={oas3Actions}
          oas3Selectors={oas3Selectors}
          path={path}
          produces={specSelectors.producesOptionsFor([path, method])}
          producesValue={specSelectors.currentProducesFor([path, method])}
          request={request}
          responses={responses}
          specActions={specActions}
          specPath={specPath.push("responses")}
          specSelectors={specSelectors}
          tryItOutResponse={response}
        />
      )}

      {!showExtensions || !extensions.size ? null : (
        <OperationExt extensions={extensions} getComponent={getComponent} />
      )}
    </div>
  )

  return (
    <div
      className={
        deprecated
          ? "opblock opblock-deprecated"
          : isShown
            ? `opblock opblock-${method} is-open`
            : `opblock opblock-${method}`
      }
      id={escapeDeepLinkPath(isShownKey.join("-"))}
    >
      <OperationSummary
        authActions={authActions}
        authSelectors={authSelectors}
        fn={fn}
        getComponent={getComponent}
        isShown={isShown}
        operationProps={operationProps}
        specPath={specPath}
        toggleShown={toggleShown}
      />
      {loaded ? (
        <QCollapse in={isShown}>{body}</QCollapse>
      ) : (
        <Collapse isOpened={isShown}>{body}</Collapse>
      )}
    </div>
  )
}
