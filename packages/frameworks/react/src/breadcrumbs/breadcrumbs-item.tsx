// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import type {BindingRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  BreadcrumbsItemIcon,
  type BreadcrumbsItemIconProps,
} from "./breadcrumbs-item-icon"
import {
  BreadcrumbsItemRoot,
  type BreadcrumbsItemRootProps,
} from "./breadcrumbs-item-root"
import {
  BreadcrumbsItemSeparator,
  type BreadcrumbsItemSeparatorProps,
} from "./breadcrumbs-item-separator"
import {
  BreadcrumbsItemTrigger,
  type BreadcrumbsItemTriggerProps,
} from "./breadcrumbs-item-trigger"
import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context"

export interface BreadcrumbsItemProps extends BreadcrumbsItemRootProps {
  /**
   * The `aria-current` attribute, should be set to `page` when the item is
   * the current page.
   */
  "aria-current"?: "page" | undefined

  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * URL the breadcrumb item links to. If omitted alongside `render`, the item
   * renders non-link content.
   */
  href?: string

  /**
   * The icon to display next to the item trigger.
   */
  icon?: LucideIconOrElement

  /**
   * Props applied to the item icon element.
   * @inheritDoc
   */
  itemIconProps?: BreadcrumbsItemIconProps

  /**
   * Props applied to the item trigger element.
   * @inheritDoc
   */
  itemTriggerProps?: BreadcrumbsItemTriggerProps

  /**
   * Replaces the trigger element (e.g., with a router Link). If omitted
   * alongside `href`, the item renders non-link content.
   * {@link https://react-next.qui.qualcomm.com/polymorphic-components Learn more}
   */
  render?: BindingRenderProp<object>

  /**
   * The separator element to render between items.
   * @default ChevronRight
   */
  separator?: LucideIconOrElement

  /**
   * Props applied to the separator element.
   * @inheritDoc
   */
  separatorProps?: BreadcrumbsItemSeparatorProps
}

export function BreadcrumbsItem({
  "aria-current": ariaCurrent,
  children,
  href,
  icon,
  itemIconProps,
  itemTriggerProps,
  render,
  separator,
  separatorProps,
  ...props
}: BreadcrumbsItemProps): ReactElement {
  const qdsContext = useQdsBreadcrumbsContext()
  const {
    href: triggerHrefProp,
    render: triggerRenderProp,
    ...baseTriggerProps
  } = itemTriggerProps ?? {}
  const finalHref = triggerHrefProp ?? href
  const finalRender = triggerRenderProp ?? render
  const isLink = finalHref != null || finalRender != null
  const triggerContent = (
    <>
      {icon ? <BreadcrumbsItemIcon icon={icon} {...itemIconProps} /> : null}
      {children}
    </>
  )

  return (
    <BreadcrumbsItemRoot {...props}>
      {isLink ? (
        <BreadcrumbsItemTrigger
          aria-current={ariaCurrent}
          href={finalHref}
          render={finalRender}
          {...baseTriggerProps}
        >
          {triggerContent}
        </BreadcrumbsItemTrigger>
      ) : (
        <span
          {...mergeProps(
            qdsContext.getItemTriggerBindings(),
            baseTriggerProps,
            {"aria-current": ariaCurrent},
          )}
        >
          {triggerContent}
        </span>
      )}
      <BreadcrumbsItemSeparator icon={separator} {...separatorProps} />
    </BreadcrumbsItemRoot>
  )
}
