// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import {TypeDocAttributes, TypeDocProps} from "@qualcomm-ui/react-mdx/typedoc"

interface HighlightRect {
  height: number
  left: number
  top: number
  width: number
}

interface PartDocumentation {
  /**
   * The name(s) of the TypeDoc interface(s) for attributes.
   */
  attributesName: string | string[]

  /**
   * The name of the TypeDoc interface for props.
   */
  propsName: string
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
   * Documentation configuration for each part.
   * Maps part names to their TypeDoc interface names.
   */
  partDocs?: Record<string, PartDocumentation>
}

export function ComponentExplorerBase({
  children,
  excludeParts = [],
  partDocs = {},
  ...props
}: ComponentExplorerBaseProps): ReactElement {
  const previewRef = useRef<HTMLDivElement>(null)
  const [parts, setParts] = useState<string[]>([])
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [highlightRects, setHighlightRects] = useState<HighlightRect[]>([])

  const discoverParts = useCallback(() => {
    if (!previewRef.current) {
      return
    }

    const elements =
      previewRef.current.querySelectorAll<HTMLElement>("[data-part]")
    const discoveredParts: string[] = []
    const seenParts = new Set<string>()

    elements.forEach((element) => {
      const partName = element.getAttribute("data-part")
      if (
        partName &&
        !seenParts.has(partName) &&
        !excludeParts.includes(partName)
      ) {
        seenParts.add(partName)
        discoveredParts.push(partName)
      }
    })

    setParts(discoveredParts)
  }, [excludeParts])

  useEffect(() => {
    const timer = setTimeout(() => {
      discoverParts()
    }, 100)

    return () => clearTimeout(timer)
  }, [discoverParts, children])

  const handlePartHover = (partName: string | null) => setHoveredPart(partName)

  const handlePartClick = (partName: string) =>
    setSelectedPart((current) => (current === partName ? null : partName))

  const activePart = selectedPart || hoveredPart

  const updateHighlightPosition = useCallback(() => {
    const previewElement = previewRef.current

    if (!previewElement || !activePart) {
      setHighlightRects([])
      return
    }

    const targetElements = Array.from(
      previewElement.querySelectorAll<HTMLElement>(
        `[data-part="${activePart}"]`,
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
  }, [activePart])

  useLayoutEffect(() => {
    if (!activePart) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHighlightRects([])
      return
    }

    updateHighlightPosition()
  }, [activePart, updateHighlightPosition])

  const selectedPartDoc = selectedPart ? partDocs[selectedPart] : null

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
            Hover to highlight, click to select parts
          </p>
        </div>
        <div className="qui-component-explorer__parts">
          {parts.map((part) => (
            <button
              key={part}
              className="qui-component-explorer__part"
              data-active={activePart === part || undefined}
              onClick={() => handlePartClick(part)}
              onMouseEnter={() => handlePartHover(part)}
              onMouseLeave={() => handlePartHover(null)}
              type="button"
            >
              {part}
            </button>
          ))}
        </div>
      </div>
      {selectedPartDoc && (
        <div className="qui-component-explorer__documentation">
          <div className="qui-component-explorer__documentation-header">
            <h4 className="qui-component-explorer__documentation-title">
              {selectedPart}
            </h4>
          </div>
          <div className="qui-component-explorer__documentation-content">
            <TypeDocProps name={selectedPartDoc.propsName} />
            <TypeDocAttributes name={selectedPartDoc.attributesName} />
          </div>
        </div>
      )}
    </div>
  )
}
