import {useCallback, useEffect, useMemo, useRef, useState} from "react"

import randomBytes from "randombytes"

import {Tab, Tabs} from "@qualcomm-ui/react/tabs"

import type {GetComponent, Schema} from "./types"

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
      <Tabs.Root onValueChange={onTabChange} value={activeTab}>
        <Tabs.List>
          <Tabs.Indicator />
          <Tab.Root value="example">
            <Tab.Button>{isExecute ? "Edit Value" : "Example"}</Tab.Button>
          </Tab.Root>
          {schema ? (
            <Tab.Root value="model">
              <Tab.Button>{isOAS3 ? "Schema" : "Model"}</Tab.Button>
            </Tab.Root>
          ) : null}
        </Tabs.List>
        <Tabs.Panel value="example">
          <div
            aria-hidden={activeTab !== tabs.example}
            aria-labelledby={exampleTabId}
            data-name="examplePanel"
            id={examplePanelId}
            tabIndex={0}
          >
            {example ? (
              example
            ) : (
              <HighlightCode>(no example available</HighlightCode>
            )}
          </div>
        </Tabs.Panel>
        {schema ? (
          <Tabs.Panel value="model">
            <div
              aria-hidden={activeTab === tabs.example}
              aria-labelledby={modelTabId}
              data-name="modelPanel"
              id={modelPanelId}
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
          </Tabs.Panel>
        ) : null}
      </Tabs.Root>
    </div>
  )
}
