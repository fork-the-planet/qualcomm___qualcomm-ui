import {createContext, useContext} from "react"

import {QuiTheme} from "@qui/base"

const ThemeContext = createContext<QuiTheme>("dark")

export const ThemeContextProvider = ThemeContext.Provider

export function useThemeContext() {
  return useContext(ThemeContext)
}
