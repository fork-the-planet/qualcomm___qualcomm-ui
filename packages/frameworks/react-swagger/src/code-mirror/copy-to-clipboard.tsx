import {
  type ComponentProps,
  type ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react"

import {CheckIcon, CopyIcon} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export interface CopyToClipboardProps
  extends Omit<ComponentProps<"button">, "color" | "ref"> {
  getValue: () => string
}

export function CopyToClipboard({
  getValue,
  onClick,
  ...props
}: CopyToClipboardProps): ReactElement {
  const [isCopied, setCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) {
      return () => {}
    }
    const timerId = setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => {
      clearTimeout(timerId)
    }
  }, [isCopied])

  const handleClick = useCallback<
    NonNullable<ComponentProps<"button">["onClick"]>
  >(
    async (event) => {
      setCopied(true)
      if (!navigator?.clipboard) {
        console.error("Access to clipboard rejected!")
      }
      try {
        await navigator.clipboard.writeText(getValue())
      } catch {
        console.error("Failed to copy!")
      }
      onClick?.(event)
    },
    [getValue, onClick],
  )

  return (
    <IconButton
      emphasis="primary"
      icon={isCopied ? CheckIcon : CopyIcon}
      onClick={handleClick}
      size="sm"
      tabIndex={0}
      title="Copy code"
      {...props}
    />
  )
}
