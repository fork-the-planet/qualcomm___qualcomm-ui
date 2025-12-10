import {createContext, useContext} from "react"

import type {QuiSwaggerContext} from "./types"

const SwaggerContext = createContext<QuiSwaggerContext | null>(null)

export const SwaggerContextProvider = SwaggerContext.Provider

export function useSwaggerContext(): QuiSwaggerContext {
  const context = useContext(SwaggerContext)

  if (!context) {
    throw new Error("QUI Swagger must be wrapped by a <SwaggerContextProvider>")
  }

  return context
}
