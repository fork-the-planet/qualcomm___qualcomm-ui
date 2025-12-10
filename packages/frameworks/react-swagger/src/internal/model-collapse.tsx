import {type ReactNode, useEffect, useRef, useState} from "react"

import {ChevronUpIcon} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {Icon} from "@qualcomm-ui/react/icon"

ModelCollapse.displayName = "ModelCollapse"

export interface ModelCollapseProps {
  activeInHash?: boolean
  children: any
  classes: string
  collapsedContent: any
  expanded: boolean
  hideSelfOnExpand: boolean
  layoutActions: Record<string, any>
  layoutSelectors: Record<string, any>
  modelId?: string
  modelName: string
  onToggle?: (modelName: string, expanded: boolean) => void
  specPath: any
  title: ReactNode
}

export function ModelCollapse({
  activeInHash,
  children,
  classes,
  collapsedContent = "{...}",
  expanded: expandedProp = false,
  hideSelfOnExpand = false,
  modelId,
  modelName,
  onToggle,
  title,
}: ModelCollapseProps): ReactNode {
  const [expanded, setExpanded] = useState(expandedProp)

  const mounted = useRef(false)

  useEffect(() => {
    setExpanded(expandedProp)
  }, [expandedProp])

  const toggleCollapsed = () => {
    onToggle?.(modelName, !expanded)
    setExpanded((prevState) => !prevState)
  }

  useEffect(() => {
    if (
      !mounted.current &&
      window.location.hash &&
      modelId &&
      window.location.hash === `#${modelId}`
    ) {
      const anchor = document.getElementById(modelId)
      if (anchor) {
        anchor.scrollIntoView()
      }
    }
    // Only scroll after first mounting the component.
    // We do this because the swagger component is mounted after the page loads.
    mounted.current = true
  }, [modelId, modelName, onToggle])

  if (expanded && hideSelfOnExpand) {
    return <span className={classes || ""}>{children}</span>
  }

  return (
    <span>
      <Button
        aria-expanded={expanded}
        endIcon={<Icon className="collapse-icon" icon={ChevronUpIcon} />}
        id={modelId}
        onClick={toggleCollapsed}
        variant={activeInHash ? "outline" : "ghost"}
      >
        {title && <span>{title}</span>}
      </Button>

      {!expanded && <span>{collapsedContent}</span>}

      {expanded && children}
    </span>
  )
}
