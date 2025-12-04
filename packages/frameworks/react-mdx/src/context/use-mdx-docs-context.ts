// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createContext,
  type Dispatch,
  type Provider,
  type SetStateAction,
  useContext,
} from "react"

import type {
  DocPropsSettings,
  RenderLink,
  TocHighlightStrategy,
} from "@qualcomm-ui/react-mdx/docs-layout"

export type PackageManager = "npm" | "yarn" | "pnpm"

export interface DemoStateEntry {
  expanded: boolean
}

/**
 * <demoId, DemoStateEntry>
 */
export type DemoState = Record<string, DemoStateEntry>

/**
 * <routeUrl, DemoState>
 */
export type RouteDemoState = Record<string, DemoState>

export interface DemoSettings {
  /**
   * If true, transform tailwind classes in demos to inline styles and vanilla CSS.
   */
  transformTailwindClasses?: boolean
}

export interface MdxDocsContextValue {
  /**
   * @default {styleMode: 'default'}
   */
  demoSettings?: DemoSettings

  /**
   * Demo state for each route, typically persisted via localStorage or a session
   * cookie (SSR). This preserves the expand/collapse state of each demo on reload.
   */
  demoState: RouteDemoState

  docProps?: DocPropsSettings

  /**
   * When the user selects the package manager in our npm install tabs component,
   * we persist their choice here.
   */
  packageManager?: PackageManager

  renderLink: RenderLink

  setDemoSettings?: Dispatch<SetStateAction<DemoSettings>>

  /**
   * onChange handler for the {@link packageManager field}
   */
  setPackageManager?: (packageManager: PackageManager) => void

  /**
   * User agent from SSR>
   */
  ssrUserAgent?: string | null

  /**
   * @default 'nearest'
   */
  tocHighlightStrategy?: TocHighlightStrategy

  updateDemoState: (
    routeUrl: string,
    demoId: string,
    state: DemoStateEntry,
  ) => void
}

const MdxDocsContext = createContext<MdxDocsContextValue | null>(null)

export const MdxDocsProvider: Provider<MdxDocsContextValue | null> =
  MdxDocsContext.Provider

export function useMdxDocsContext(): MdxDocsContextValue {
  const context = useContext(MdxDocsContext)

  if (!context) {
    throw new Error(
      "useMdxDocsContext can only be used as children of an <MdxDocsProvider> instance.",
    )
  }

  return context
}
