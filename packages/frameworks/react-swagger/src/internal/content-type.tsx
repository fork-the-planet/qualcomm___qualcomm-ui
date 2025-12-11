import {useEffect, useMemo} from "react"

import immutable from "immutable"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"
import {useEffectOnce} from "@qualcomm-ui/react-core/effects"

export interface ContentTypeProps {
  ariaControls?: string
  ariaLabel?: string
  className?: string
  contentTypes?: any[] | Set<any> | {[key: string]: any}
  controlId?: string
  label?: string
  onChange?: (value: any) => void
  value?: string | null
}

export function ContentType({
  ariaControls,
  ariaLabel,
  contentTypes: contentTypesProp,
  label,
  onChange,
  value = null,
}: ContentTypeProps) {
  const contentTypes = useMemo(() => {
    return immutable.fromJS(contentTypesProp)
  }, [contentTypesProp])

  const collection = useMemo(() => {
    if (!contentTypes || !contentTypes.size) {
      return null
    }
    return selectCollection({items: contentTypes.toArray()})
  }, [contentTypes])

  useEffectOnce(() => {
    if (contentTypes && onChange) {
      onChange(contentTypes.first())
    }
  })

  useEffect(() => {
    if (
      contentTypes &&
      value &&
      !contentTypes.includes(value) &&
      onChange &&
      contentTypes.size
    ) {
      onChange(contentTypes.first())
    }
  }, [contentTypes, onChange, value])

  if (!contentTypes || !contentTypes.size || !collection) {
    return null
  }

  return (
    <Select
      clearable={false}
      collection={collection}
      controlProps={{
        "aria-controls": ariaControls,
        "aria-label": ariaLabel || "Content Type",
      }}
      label={label?.trim() || undefined}
      onClick={(event) => {
        // something is causing this to click twice, so the menu never opens.
        event.preventDefault()
      }}
      onValueChange={(value) => onChange?.(value[0])}
      size="sm"
      style={{minWidth: 180}}
      value={value ? [value] : []}
    />
  )
}
