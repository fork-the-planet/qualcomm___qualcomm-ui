import {ReactNode} from "react"

import {DocsCodeMirror} from "../code-mirror"

import {useThemeContext} from "./use-theme-context"

SyntaxHighlighter.displayName = "SyntaxHighlighter"

export interface SyntaxHighlighterProps {
  children: string
  fn: any
  language?: string
}

export function SyntaxHighlighter({
  children,
  ...props
}: SyntaxHighlighterProps): ReactNode {
  const theme = useThemeContext()

  return (
    <DocsCodeMirror language={props.language} theme={theme} value={children} />
  )
}
