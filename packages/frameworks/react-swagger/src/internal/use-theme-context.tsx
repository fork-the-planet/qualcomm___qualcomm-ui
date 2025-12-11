// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createContext, useContext} from "react"

import type {QdsTheme} from "@qualcomm-ui/qds-core/theme"

const ThemeContext = createContext<QdsTheme>("dark")

export const ThemeContextProvider = ThemeContext.Provider

export function useThemeContext() {
  return useContext(ThemeContext)
}
