// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {memo, useMemo} from "react"

import SwaggerUI from "swagger-ui-react"

import type {QdsTheme} from "@qualcomm-ui/qds-core/theme"

import {
  ApiKeyAuth,
  ArrayModel,
  AuthItem,
  AuthorizationPopup,
  AuthorizeBtn,
  AuthorizeOperationBtn,
  Auths,
  BasicAuth,
  Clear,
  ContentType,
  EnumModel,
  Execute,
  HighlightCode,
  JsonSchemaArray,
  JsonSchemaObject,
  JsonSchemaString,
  Layout,
  ModelCollapse,
  ModelExample,
  Models,
  ModelWrapper,
  Oauth2,
  ObjectModel,
  Operation,
  OperationSummary,
  OperationSummaryMethod,
  OperationSummaryPath,
  OperationTag,
  ParamBody,
  type QuiSwaggerContext,
  type RenderLink,
  RequestBodyEditor,
  Schemes,
  Servers,
  SwaggerContextProvider,
  SyntaxHighlighter,
  ThemeContextProvider,
  TryItOutButton,
} from "./internal"

const quiSwaggerPlugin: PluginGenerator = () => ({
  components: {
    apiKeyAuth: ApiKeyAuth,
    ArrayModel,
    AuthItem,
    authorizationPopup: AuthorizationPopup,
    authorizeBtn: AuthorizeBtn,
    authorizeOperationBtn: AuthorizeOperationBtn,
    auths: Auths,
    basicAuth: BasicAuth,
    clear: Clear,
    contentType: memo(ContentType),
    EnumModel,
    execute: Execute,
    HighlightCode,
    JsonSchema_array: JsonSchemaArray,
    JsonSchema_object: JsonSchemaObject,
    JsonSchema_string: JsonSchemaString,
    Layout,
    ModelCollapse,
    modelExample: ModelExample,
    Models,
    ModelWrapper,
    oauth2: Oauth2,
    ObjectModel,
    operation: Operation,
    OperationSummary: memo(OperationSummary),
    OperationSummaryMethod: memo(OperationSummaryMethod),
    OperationSummaryPath: memo(OperationSummaryPath),
    OperationTag,
    ParamBody,
    RequestBodyEditor,
    schemes: Schemes,
    Servers,
    SyntaxHighlighter,
    TryItOutButton: memo(TryItOutButton),
  },
})

interface Request {
  [k: string]: any
}
interface Response {
  [k: string]: any
}
type System = any

type PluginGenerator = (system: System) => object

type Plugin = object | PluginGenerator

type Preset = () => unknown

export interface SwaggerUIProps {
  deepLinking?: boolean
  defaultModelExpandDepth?: number
  defaultModelRendering?: "example" | "model"
  defaultModelsExpandDepth?: number
  displayOperationId?: boolean
  displayRequestDuration?: boolean
  docExpansion?: "list" | "full" | "none"
  filter?: string | boolean
  layout?: string
  oauth2RedirectUrl?: string
  onComplete?: (system: System) => void
  persistAuthorization?: boolean
  plugins?: Plugin[]
  presets?: Preset[]
  queryConfigEnabled?: boolean
  requestInterceptor?: (req: Request) => Request | Promise<Request>
  requestSnippets?: object
  requestSnippetsEnabled?: boolean
  responseInterceptor?: (res: Response) => Response | Promise<Response>
  showCommonExtensions?: boolean
  showExtensions?: boolean
  showMutatedRequest?: boolean
  spec?: object | string
  supportedSubmitMethods?: Array<
    "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "trace"
  >
  tryItOutEnabled?: boolean
  url?: string
  withCredentials?: boolean
}

export interface SwaggerProps extends SwaggerUIProps {
  /**
   * Function to return the URL fragment identifier, beginning with a #. This should
   * be SSR-compatible.
   */
  getHash: () => string

  /**
   * If true, the top title section will be hidden.
   */
  hideTitleSection?: boolean

  /**
   * Link render function.
   */
  renderLink: RenderLink

  /**
   * The current QUI theme. This must be provided to apply the correct theme to the
   * syntax highlighters.
   */
  theme: QdsTheme
}

export function Swagger({
  getHash,
  hideTitleSection,
  plugins: pluginsProp,
  renderLink: RenderLink,
  theme,
  ...props
}: SwaggerProps) {
  const plugins = useMemo(() => {
    const functionsPlugin: PluginGenerator = () => ({
      fn: {
        getHash,
      },
    })
    const renderLinkPlugin: PluginGenerator = () => ({
      components: {
        RenderLink,
      },
    })
    const quiPlugins: Plugin[] = [
      functionsPlugin,
      renderLinkPlugin,
      quiSwaggerPlugin,
    ]
    return pluginsProp ? [...quiPlugins, ...pluginsProp] : quiPlugins
  }, [RenderLink, getHash, pluginsProp])

  const context: QuiSwaggerContext = {
    hash: getHash(),
    hideTitleSection,
  }

  return (
    <SwaggerContextProvider value={context}>
      <ThemeContextProvider value={theme}>
        <SwaggerUI
          defaultModelExpandDepth={1000}
          defaultModelRendering="model"
          defaultModelsExpandDepth={1000}
          layout="Layout"
          plugins={plugins}
          {...props}
        />
      </ThemeContextProvider>
    </SwaggerContextProvider>
  )
}
