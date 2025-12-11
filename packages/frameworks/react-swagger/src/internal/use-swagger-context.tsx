// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

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
