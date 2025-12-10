import {useEffect, useMemo} from "react"

import immutable from "immutable"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"

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

  useEffect(() => {
    if (contentTypes && onChange) {
      onChange(contentTypes.first())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    <div>
      <Select
        className="q-swagger-input"
        clearable={false}
        collection={collection}
        controlProps={{"aria-controls": ariaControls, "aria-label": ariaLabel}}
        label={label}
        onValueChange={(value) => onChange?.(value[0])}
        value={value ? [value] : []}
      />
    </div>
  )
}
