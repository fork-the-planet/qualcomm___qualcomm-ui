// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import Im from "immutable"
import {ChevronUpIcon} from "lucide-react"

import {Collapsible} from "@qualcomm-ui/react/collapsible"
import {Icon} from "@qualcomm-ui/react/icon"
import {clsx} from "@qualcomm-ui/utils/clsx"

import type {GetComponent} from "./types"
import {useJumpToHash} from "./use-jump-to-hash"
import {useSwaggerContext} from "./use-swagger-context"

Models.displayName = "Models"

export interface ModelsProps {
  fn: any
  getComponent: GetComponent
  getConfigs: () => any
  layoutActions?: any
  layoutSelectors?: any
  specActions: any
  specSelectors?: any
}

export function Models(props: ModelsProps): ReactNode {
  const getSchemaBasePath = () => {
    const isOAS3 = props.specSelectors.isOAS3()
    return isOAS3 ? ["components", "schemas"] : ["definitions"]
  }

  const handleToggle = (name: string, isExpanded: boolean) => {
    const {layoutActions} = props
    layoutActions.show([...getSchemaBasePath(), name], isExpanded)
    if (isExpanded) {
      props.specActions.requestResolvedSubtree([...getSchemaBasePath(), name])
    }
  }

  const onLoadModels = (ref: any) => {
    if (ref) {
      props.layoutActions.readyToScroll(getSchemaBasePath(), ref)
    }
  }

  const onLoadModel = (ref: any) => {
    if (ref) {
      const name = ref.getAttribute("data-name")
      props.layoutActions.readyToScroll([...getSchemaBasePath(), name], ref)
    }
  }

  const {
    getComponent,
    getConfigs,
    layoutActions,
    layoutSelectors,
    specSelectors,
  } = props
  const definitions = specSelectors.definitions()
  const {defaultModelsExpandDepth, docExpansion} = getConfigs()

  const {hash} = useSwaggerContext()
  const nameFromHash = hash.substring(hash.indexOf("model-") + 6)

  useJumpToHash(props.fn?.getHash, "models")

  if (!definitions.size || defaultModelsExpandDepth < 0) {
    return null
  }

  const specPathBase = getSchemaBasePath()
  const showModels = layoutSelectors.isShown(
    specPathBase,
    defaultModelsExpandDepth > 0 && docExpansion !== "none",
  )
  const isOAS3 = specSelectors.isOAS3()

  const ModelWrapper = getComponent("ModelWrapper")
  const ModelCollapse = getComponent("ModelCollapse")

  return (
    <section
      ref={onLoadModels}
      className={showModels ? "models is-open" : "models"}
    >
      <button
        aria-expanded={showModels}
        className="model-collapse-title"
        id="models"
        onClick={() => layoutActions.show(specPathBase, !showModels)}
      >
        {isOAS3 ? "Schemas" : "Models"}
        <Icon
          aria-label="Model visibility icon"
          className={clsx("collapse-icon", {"is-open": showModels})}
          icon={ChevronUpIcon}
          size="md"
        />
      </button>

      <Collapsible.Root open={showModels}>
        <Collapsible.Content>
          {definitions
            .entrySeq()
            .map(([name]: any) => {
              const fullPath = [...specPathBase, name]
              const specPath = Im.List(fullPath)

              const schemaValue = specSelectors.specResolvedSubtree(fullPath)
              const rawSchemaValue = specSelectors.specJson().getIn(fullPath)

              const schema = Im.Map.isMap(schemaValue) ? schemaValue : Im.Map()
              const rawSchema = Im.Map.isMap(rawSchemaValue)
                ? rawSchemaValue
                : Im.Map()

              const displayName =
                schema.get("title") || rawSchema.get("title") || name
              const isShown = layoutSelectors.isShown(fullPath, false)

              if (isShown && schema.size === 0 && rawSchema.size > 0) {
                // Firing an action in a container render is not great,
                // but it works for now.
                props.specActions.requestResolvedSubtree(fullPath)
              }

              const activeInHash = nameFromHash && nameFromHash === name

              const content = (
                <ModelWrapper
                  activeInHash={activeInHash}
                  displayName={displayName}
                  expandDepth={defaultModelsExpandDepth}
                  fullPath={fullPath}
                  getComponent={getComponent}
                  getConfigs={getConfigs}
                  includeReadOnly
                  includeWriteOnly
                  layoutActions={layoutActions}
                  layoutSelectors={layoutSelectors}
                  name={name}
                  schema={schema || Im.Map()}
                  specPath={specPath}
                  specSelectors={specSelectors}
                />
              )

              const title = (
                <span className="model-box">
                  <span className="model model-title">{displayName}</span>
                </span>
              )

              const modelId = `model-${name}`

              return (
                <div
                  key={`models-section-${name}`}
                  ref={onLoadModel}
                  className="model-container"
                  data-name={name}
                >
                  <span className="model-box-anchor" id={modelId}></span>
                  <ModelCollapse
                    activeInHash={activeInHash}
                    classes="model-box"
                    collapsedContent=""
                    displayName={displayName}
                    expanded={defaultModelsExpandDepth > 0 && isShown}
                    getHash={props.fn.getHash}
                    hideSelfOnExpand
                    layoutActions={layoutActions}
                    layoutSelectors={layoutSelectors}
                    modelId={modelId}
                    modelName={name}
                    onToggle={handleToggle}
                    specPath={specPath}
                    title={title}
                  >
                    {content}
                  </ModelCollapse>
                </div>
              )
            })
            .toArray()}
        </Collapsible.Content>
      </Collapsible.Root>
    </section>
  )
}
