import {DocsCodeMirror} from "../code-mirror"

import {GetComponent} from "./types"
import {useThemeContext} from "./use-theme-context"
import {jsFileDownload} from "./utils"

interface HighlightCodeProps {
  canCopy?: boolean
  children: string
  className?: string
  downloadable?: boolean
  fileName?: string
  fn: any
  getComponent: GetComponent
  language?: string
}

export function HighlightCode({
  canCopy,
  children,
  downloadable,
  fileName = "response.txt",
  language,
}: HighlightCodeProps) {
  const handleDownload = () => {
    jsFileDownload(children, fileName)
  }

  const copyable =
    canCopy || children?.startsWith("{") || children?.startsWith("[")

  const theme = useThemeContext()

  return (
    <div className="qui-code-mirror" style={{maxWidth: 700}}>
      <DocsCodeMirror
        copyable={copyable}
        downloadable={downloadable}
        handleDownload={handleDownload}
        language={language}
        theme={theme}
        value={children}
      />
    </div>
  )
}
