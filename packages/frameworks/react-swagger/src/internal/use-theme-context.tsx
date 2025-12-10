import {createContext, useContext} from "react"

import type {QdsTheme} from "@qualcomm-ui/qds-core/theme"

const ThemeContext = createContext<QdsTheme>("dark")

export const ThemeContextProvider = ThemeContext.Provider

export function useThemeContext() {
  return useContext(ThemeContext)
}
