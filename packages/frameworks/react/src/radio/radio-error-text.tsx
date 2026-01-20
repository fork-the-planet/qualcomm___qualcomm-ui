// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {AlertCircle} from "lucide-react"

import {
  InputErrorText,
  type InputErrorTextProps,
} from "@qualcomm-ui/react/input"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {useRadioItemErrorText} from "@qualcomm-ui/react-core/radio"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsRadioContext} from "./qds-radio-context"

export interface RadioErrorTextProps extends IdProp, InputErrorTextProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * An icon to display next to the error text.
   *
   * @default `<AlertCircle />`
   */
  icon?: LucideIconOrElement
}

/**
 * Error message displayed when the radio is invalid. Renders a `<div>` element
 * by default.
 */
export function RadioErrorText({
  children,
  id,
  ...props
}: RadioErrorTextProps): ReactElement {
  const contextProps = useRadioItemErrorText({id})
  const qdsContext = useQdsRadioContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getItemErrorTextBindings(),
    props,
  )

  return (
    <InputErrorText icon={AlertCircle} {...mergedProps}>
      {children}
    </InputErrorText>
  )
}
