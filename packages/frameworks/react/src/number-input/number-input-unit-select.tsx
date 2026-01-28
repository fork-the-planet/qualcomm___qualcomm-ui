// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useCallback, useMemo, useState} from "react"

import {ChevronDown, ChevronUp} from "lucide-react"

import type {UnitOption} from "@qualcomm-ui/qds-core/number-input"
import {Icon} from "@qualcomm-ui/react/icon"
import {Menu} from "@qualcomm-ui/react/menu"
import {useMenuContext} from "@qualcomm-ui/react-core/menu"
import {useNumberInputContext} from "@qualcomm-ui/react-core/number-input"
import {Portal} from "@qualcomm-ui/react-core/portal"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsNumberInputContext} from "./qds-number-input-context"

export type {UnitOption}

export interface NumberInputUnitSelectProps extends IdProp {
  /**
   * The initial selected unit. Defaults to the first option if not provided.
   */
  defaultUnit?: string

  /**
   * Callback fired when the selected unit changes.
   */
  onUnitChange?: (value: string) => void

  /**
   * Array of unit options to display in the dropdown.
   */
  options: UnitOption[]
}

function NumberInputUnitSelectTriggerContent(): ReactElement {
  const menuContext = useMenuContext()

  return (
    <Icon
      data-part="chevron"
      icon={menuContext.open ? ChevronUp : ChevronDown}
      size="sm"
    />
  )
}

export function NumberInputUnitSelect({
  defaultUnit,
  id,
  onUnitChange,
  options,
}: NumberInputUnitSelectProps): ReactElement {
  const numberInputContext = useNumberInputContext()
  const qdsNumberInputContext = useQdsNumberInputContext()

  const [selectedValue, setSelectedValue] = useState(
    () => defaultUnit ?? options[0]?.value ?? "",
  )

  const effectiveSelectedValue = useMemo(() => {
    const isValidSelection = options.some((opt) => opt.value === selectedValue)
    if (isValidSelection) {
      return selectedValue
    }

    return options.some((opt) => opt.value === defaultUnit)
      ? defaultUnit!
      : (options[0]?.value ?? "")
  }, [options, defaultUnit, selectedValue])

  const handleValueChange = useCallback(
    (newValue: string) => {
      setSelectedValue(newValue)
      onUnitChange?.(newValue)
    },
    [onUnitChange],
  )

  const menuSize =
    qdsNumberInputContext.size === "lg" ? "md" : qdsNumberInputContext.size
  const selectedOption = options.find(
    (opt) => opt.value === effectiveSelectedValue,
  )
  const displayLabel = selectedOption?.label ?? ""

  const buttonBindings = mergeProps(
    numberInputContext.getUnitSelectBindings(),
    qdsNumberInputContext.getUnitSelectBindings(),
  )

  return (
    <Menu.Root size={menuSize}>
      <Menu.Trigger>
        <button id={id} {...buttonBindings}>
          <span>{displayLabel}</span>
          <NumberInputUnitSelectTriggerContent />
        </button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.RadioItemGroup
              onValueChange={handleValueChange}
              value={effectiveSelectedValue}
            >
              {options.map((option) => (
                <Menu.RadioItem key={option.value} value={option.value}>
                  <Menu.ItemLabel>
                    {option.displayText ?? option.label}
                  </Menu.ItemLabel>
                  <Menu.ItemIndicator />
                </Menu.RadioItem>
              ))}
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
