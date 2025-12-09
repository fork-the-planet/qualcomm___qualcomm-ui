import {useEffect, useMemo} from "react"

import {fromJS} from "immutable"

import {QCombobox} from "@qui/react"

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
    return fromJS(contentTypesProp)
  }, [contentTypesProp])

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

  if (!contentTypes || !contentTypes.size) {
    return null
  }

  return (
    <div>
      <QCombobox
        aria-controls={ariaControls}
        aria-label={ariaLabel}
        className="q-swagger-input"
        clearable={false}
        disableOptionToggle
        label={label}
        onChange={(event, value) => onChange?.(value)}
        options={contentTypes.toArray()}
        value={value}
      />
    </div>
  )
}
