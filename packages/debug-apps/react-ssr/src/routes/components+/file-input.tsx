/// <reference types="vite/client" />

import type {ReactNode} from "react"

import {DemoPageLayout} from "~/components/demo-page-layout"

type DemoComponent = () => ReactNode

const demoModules = import.meta.glob<Record<string, DemoComponent>>(
  "../../../../../docs/react-docs/src/routes/components+/file-input+/demos/*-demo.tsx",
  {eager: true},
)

function kebabToUppercased(str: string): string[] {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
}

function kebabToPascal(str: string): string {
  return kebabToUppercased(str).join("")
}

function kebabToTitle(str: string): string {
  return kebabToUppercased(str).join(" ")
}

const demos = Object.entries(demoModules)
  .map(([modulePath, module]) => {
    const demoFileName = modulePath.match(/\/([^/]+)\.tsx$/)?.[1]

    if (!demoFileName) {
      return undefined
    }

    const demoName = demoFileName
      .replace(/^file-input-/, "")
      .replace(/-demo$/, "")
    const componentName = kebabToPascal(demoFileName)
    const component = module[componentName]

    if (!component) {
      const MissingDemo: DemoComponent = () => (
        <div className="text-danger" role="alert">
          Missing demo export: {componentName}
        </div>
      )

      return {component: MissingDemo, title: kebabToTitle(demoName)}
    }

    return {component, title: kebabToTitle(demoName)}
  })
  .filter((demo): demo is {component: DemoComponent; title: string} =>
    Boolean(demo),
  )
  .sort((a, b) => a.title.localeCompare(b.title))

export default function FileInputDemos() {
  return <DemoPageLayout componentName="file-input" demos={demos} />
}
