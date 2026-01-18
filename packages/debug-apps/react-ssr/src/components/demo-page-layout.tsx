import type {ReactNode} from "react"

import {Link} from "react-router"

interface Demo {
  component: () => ReactNode
  title: string
}

interface DemoPageLayoutProps {
  componentName: string
  demos: Demo[]
}

export function DemoPageLayout({componentName, demos}: DemoPageLayoutProps) {
  return (
    <div className="page">
      {demos.map(({component: Demo, title}) => {
        const demoSlug = title.toLowerCase().replace(/\s+/g, "-")
        return (
          <div className="section" key={title}>
            <h2 className="section-title">
              <Link
                to={`/components/${componentName}/${demoSlug}`}
                className="hover:underline"
              >
                {title}
              </Link>
            </h2>
            <div className="demo-container">
              <Demo />
            </div>
          </div>
        )
      })}
    </div>
  )
}
