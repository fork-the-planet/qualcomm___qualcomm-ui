import {useCallback, useEffect, useMemo, useRef, useState} from "react"

import randomBytes from "randombytes"

import {QTab, QTabList, QTabPanel, QTabPanels, QTabs} from "@qui/react"

import {GetComponent, Schema} from "./types"

const usePrevious = (value: any) => {
  const ref = useRef(undefined)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const useTabs = ({
  example,
  initialTab,
  isExecute,
  schema,
}: {
  example: string
  initialTab: string
  isExecute: boolean
  schema: Schema
}) => {
  const tabs = useMemo(() => ({example: "example", model: "model"}), [])
  const allowedTabs = useMemo(() => Object.keys(tabs), [tabs])
  const tab =
    !allowedTabs.includes(initialTab) || !schema || isExecute
      ? tabs.example
      : initialTab
  const prevIsExecute = usePrevious(isExecute)
  const [activeTab, setActiveTab] = useState(tab)
  const handleTabChange = useCallback((e: string) => {
    setActiveTab(e)
  }, [])

  useEffect(() => {
    if (prevIsExecute && !isExecute && example) {
      setActiveTab(tabs.example)
    }
  }, [prevIsExecute, isExecute, example, tabs.example])

  return {activeTab, onTabChange: handleTabChange, tabs}
}

interface Props {
  example: any
  getComponent: GetComponent
  getConfigs: () => any
  includeReadOnly?: boolean
  includeWriteOnly?: boolean
  isExecute?: boolean
  schema: any
  specPath: any[]
  specSelectors: {
    isOAS3: () => boolean
  }
}

export function ModelExample({
  example,
  getComponent,
  getConfigs,
  includeReadOnly = false,
  includeWriteOnly = false,
  isExecute = false,
  schema,
  specPath,
  specSelectors,
}: Props) {
  const {defaultModelExpandDepth, defaultModelRendering} = getConfigs()
  const ModelWrapper = getComponent("ModelWrapper")
  const HighlightCode = getComponent("HighlightCode", true)
  const exampleTabId = randomBytes(5).toString("base64")
  const examplePanelId = randomBytes(5).toString("base64")
  const modelTabId = randomBytes(5).toString("base64")
  const modelPanelId = randomBytes(5).toString("base64")
  const isOAS3 = specSelectors.isOAS3()
  const {activeTab, onTabChange, tabs} = useTabs({
    example,
    initialTab: defaultModelRendering,
    isExecute,
    schema,
  })

  return (
    <div className="model-example">
      <QTabs
        index={activeTab === "example" ? 0 : 1}
        onChange={(index) => {
          onTabChange(index === 0 ? "example" : "model")
        }}
      >
        <QTabList>
          <QTab>{isExecute ? "Edit Value" : "Example"}</QTab>
          {schema ? <QTab>{isOAS3 ? "Schema" : "Model"}</QTab> : null}
        </QTabList>
        <QTabPanels>
          <QTabPanel>
            <div
              aria-hidden={activeTab !== tabs.example}
              aria-labelledby={exampleTabId}
              data-name="examplePanel"
              id={examplePanelId}
              role="tabpanel"
              tabIndex={0}
            >
              {example ? (
                example
              ) : (
                <HighlightCode>(no example available</HighlightCode>
              )}
            </div>
          </QTabPanel>
          {schema ? (
            <QTabPanel>
              <div
                aria-hidden={activeTab === tabs.example}
                aria-labelledby={modelTabId}
                data-name="modelPanel"
                id={modelPanelId}
                role="tabpanel"
                tabIndex={0}
              >
                <ModelWrapper
                  expandDepth={defaultModelExpandDepth}
                  getComponent={getComponent}
                  getConfigs={getConfigs}
                  includeReadOnly={includeReadOnly}
                  includeWriteOnly={includeWriteOnly}
                  schema={schema}
                  specPath={specPath}
                  specSelectors={specSelectors}
                />
              </div>
            </QTabPanel>
          ) : null}
        </QTabPanels>
      </QTabs>
    </div>
  )
}
