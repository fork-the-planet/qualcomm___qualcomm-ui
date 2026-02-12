// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {AlertBanner as SimpleAlertBanner} from "./alert-banner"
import {
  AlertBannerActionContainer,
  type AlertBannerActionContainerProps,
} from "./alert-banner-action-container"
import {
  AlertBannerCloseButton,
  type AlertBannerCloseButtonProps,
} from "./alert-banner-close-button"
import {
  AlertBannerDescription,
  type AlertBannerDescriptionProps,
} from "./alert-banner-description"
import {
  AlertBannerHeading,
  type AlertBannerHeadingProps,
} from "./alert-banner-heading"
import {AlertBannerIcon, type AlertBannerIconProps} from "./alert-banner-icon"
import {AlertBannerRoot, type AlertBannerRootProps} from "./alert-banner-root"

export {
  AlertBannerContextProvider,
  type AlertBannerContextValue,
  useAlertBannerContext,
} from "./qds-alert-banner-context"

export type {
  AlertBannerActionContainerProps,
  AlertBannerCloseButtonProps,
  AlertBannerDescriptionProps,
  AlertBannerHeadingProps,
  AlertBannerIconProps,
  AlertBannerRootProps,
}

type AlertBannerComponent = typeof SimpleAlertBanner & {
  /**
   * A container for the banner's action button. Renders a `<div>` element by
   * default.
   */
  ActionContainer: typeof AlertBannerActionContainer
  /**
   * Calls the root's `onClose` when clicked. Renders a `<button>` element by
   * default.
   */
  CloseButton: typeof AlertBannerCloseButton
  /**
   * A paragraph with additional information about the banner. Renders a
   * `<div>` element by default.
   */
  Description: typeof AlertBannerDescription
  /**
   * A heading that labels the banner. Renders a `<div>` element by default.
   */
  Heading: typeof AlertBannerHeading
  /**
   * An icon that indicates the banner's status. Renders a `<span>` element by
   * default.
   */
  Icon: typeof AlertBannerIcon
  /**
   * Groups all parts of the banner. Renders a `<div>` element by default.
   */
  Root: typeof AlertBannerRoot
}

export const AlertBanner: AlertBannerComponent =
  SimpleAlertBanner as AlertBannerComponent

AlertBanner.ActionContainer = AlertBannerActionContainer
AlertBanner.CloseButton = AlertBannerCloseButton
AlertBanner.Description = AlertBannerDescription
AlertBanner.Heading = AlertBannerHeading
AlertBanner.Icon = AlertBannerIcon
AlertBanner.Root = AlertBannerRoot
