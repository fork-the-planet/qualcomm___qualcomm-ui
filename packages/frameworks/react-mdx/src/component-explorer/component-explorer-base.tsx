// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"

interface HighlightRect {
  height: number
  left: number
  top: number
  width: number
}

export interface ComponentExplorerBaseProps
  extends ComponentPropsWithRef<"div"> {
  /**
   * The component to explore. Should contain elements with `data-part` attributes.
   */
  children: ReactNode

  /**
   * Array of part names to exclude from the component anatomy list.
   */
  excludeParts?: string[]

  /**
   * Links to API documentation for each part.
   * Maps part names to anchor URLs (e.g., "#slider-root").
   */
  partLinks?: Record<string, string>
}

export function ComponentExplorerBase({
  children,
  excludeParts = [],
  partLinks = {},
  ...props
}: ComponentExplorerBaseProps): ReactElement {
  const {renderLink: Link} = useMdxDocsContext()
  const previewRef = useRef<HTMLDivElement>(null)
  const [parts, setParts] = useState<string[]>([])
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  const [highlightRects, setHighlightRects] = useState<HighlightRect[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!previewRef.current) {
        return
      }

      const elements =
        previewRef.current.querySelectorAll<HTMLElement>("[data-part]")
      const seen = new Set<string>()

      const discovered = Array.from(elements)
        .map((el) => el.getAttribute("data-part"))
        .filter((part): part is string => {
          if (!part || seen.has(part) || excludeParts.includes(part)) {
            return false
          }
          seen.add(part)
          return true
        })

      setParts(discovered)
    }, 100)

    return () => clearTimeout(timer)
  }, [children, excludeParts])

  useLayoutEffect(() => {
    const previewElement = previewRef.current

    if (!previewElement || !hoveredPart) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM measurement requires post-render setState
      setHighlightRects([])
      return
    }

    const targetElements = Array.from(
      previewElement.querySelectorAll<HTMLElement>(
        `[data-part="${hoveredPart}"]`,
      ),
    )

    if (targetElements.length === 0) {
      setHighlightRects([])
      return
    }

    const previewRect = previewElement.getBoundingClientRect()
    const highlightOffset = 4
    const rects = targetElements.map((targetElement) => {
      const elementRect = targetElement.getBoundingClientRect()
      return {
        height: elementRect.height + highlightOffset * 2,
        left: elementRect.left - previewRect.left - highlightOffset,
        top: elementRect.top - previewRect.top - highlightOffset,
        width: elementRect.width + highlightOffset * 2,
      }
    })

    setHighlightRects(rects)
  }, [hoveredPart])

  return (
    <div {...props} className="qui-component-explorer__root">
      <div ref={previewRef} className="qui-component-explorer__preview">
        {children}
        {highlightRects.map((rect, index) => (
          <div
            key={index}
            className="qui-component-explorer__highlight"
            style={{
              height: `${rect.height}px`,
              left: `${rect.left}px`,
              top: `${rect.top}px`,
              width: `${rect.width}px`,
            }}
          />
        ))}
      </div>
      <div className="qui-component-explorer__anatomy">
        <div className="qui-component-explorer__anatomy-header">
          <h3 className="qui-component-explorer__anatomy-title">
            Component Anatomy
          </h3>
          <p className="qui-component-explorer__anatomy-subtitle">
            Hover to highlight, click to view API
          </p>
        </div>
        <div className="qui-component-explorer__parts">
          {parts.map((part) => {
            const link = partLinks[part]

            return link ? (
              <Link
                key={part}
                className="qui-component-explorer__part"
                data-active={hoveredPart === part || undefined}
                href={link}
                onMouseEnter={() => setHoveredPart(part)}
                onMouseLeave={() => setHoveredPart(null)}
              >
                {part}
              </Link>
            ) : (
              <span
                key={part}
                className="qui-component-explorer__part"
                data-active={hoveredPart === part || undefined}
                onMouseEnter={() => setHoveredPart(part)}
                onMouseLeave={() => setHoveredPart(null)}
              >
                {part}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
