// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import Im from "immutable"
import randomBytes from "randombytes"
import shaJs from "sha.js"
import parseUrl from "url-parse"

function b64toB64UrlEncoded(str: any) {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

export function generateCodeVerifier() {
  return b64toB64UrlEncoded(randomBytes(32).toString("base64"))
}

export function createCodeChallenge(codeVerifier: any) {
  return b64toB64UrlEncoded(
    shaJs("sha256").update(codeVerifier).digest("base64"),
  )
}

function sanitizeUrl(url: any): string {
  if (typeof url !== "string" || url.trim() === "") {
    return ""
  }

  const urlTrimmed = url.trim()
  const blankURL = "about:blank"

  try {
    const base = `https://base${String(Math.random()).slice(2)}`
    const urlObject = new URL(urlTrimmed, base)
    const scheme = urlObject.protocol.slice(0, -1)

    // check for invalid schemes
    if (["javascript", "data", "vbscript"].includes(scheme.toLowerCase())) {
      return blankURL
    }

    // return sanitized URI reference
    if (urlObject.origin === base) {
      if (urlTrimmed.startsWith("/")) {
        return `${urlObject.pathname}${urlObject.search}${urlObject.hash}`
      }

      // Handle relative paths (./path, ../path, ./../../path, etc.)
      if (urlTrimmed.startsWith("./") || urlTrimmed.startsWith("../")) {
        const relativePath = urlTrimmed?.match(/^(\.\.?\/)+/)?.[0]
        const remainingPath = urlObject.pathname.substring(1)
        return `${relativePath}${remainingPath}${urlObject.search}${urlObject.hash}`
      }

      return `${urlObject.pathname.substring(1)}${urlObject.search}${urlObject.hash}`
    }

    return String(urlObject)
  } catch {
    return blankURL
  }
}

export function authorizeOauth2({
  auth,
  authActions,
  authConfigs = {},
  configs,
  currentServer,
  errActions,
}: {
  auth: any
  authActions: any
  authConfigs?: any
  configs: any
  currentServer?: any
  errActions: any
}) {
  const {clientId, name, schema, scopes} = auth
  const flow = schema.get("flow")
  const query = []

  switch (flow) {
    case "password":
      authActions.authorizePassword(auth)
      return

    case "application":
      authActions.authorizeApplication(auth)
      return

    case "accessCode":
      query.push("response_type=code")
      break

    case "implicit":
      query.push("response_type=token")
      break

    case "clientCredentials":
    case "client_credentials":
      // OAS3
      authActions.authorizeApplication(auth)
      return

    case "authorizationCode":
    case "authorization_code":
      // OAS3
      query.push("response_type=code")
      break
  }

  if (typeof clientId === "string") {
    query.push(`client_id=${encodeURIComponent(clientId)}`)
  }

  const redirectUrl = configs.oauth2RedirectUrl

  // todo move to parser
  if (typeof redirectUrl === "undefined") {
    errActions.newAuthErr({
      authId: name,
      level: "error",
      message:
        "oauth2RedirectUrl configuration is not passed. Oauth2 authorization cannot be performed.",
      source: "validation",
    })
    return
  }
  query.push(`redirect_uri=${encodeURIComponent(redirectUrl)}`)

  let scopesArray = []
  if (Array.isArray(scopes)) {
    scopesArray = scopes
  } else if (Im.List.isList(scopes)) {
    scopesArray = scopes.toArray()
  }

  if (scopesArray.length > 0) {
    const scopeSeparator = authConfigs.scopeSeparator || " "

    query.push(`scope=${encodeURIComponent(scopesArray.join(scopeSeparator))}`)
  }

  const state = btoa(new Date().toString())

  query.push(`state=${encodeURIComponent(state)}`)

  if (typeof authConfigs.realm !== "undefined") {
    query.push(`realm=${encodeURIComponent(authConfigs.realm)}`)
  }

  if (
    (flow === "authorizationCode" ||
      flow === "authorization_code" ||
      flow === "accessCode") &&
    authConfigs.usePkceWithAuthorizationCodeGrant
  ) {
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = createCodeChallenge(codeVerifier)

    query.push(`code_challenge=${codeChallenge}`)
    query.push("code_challenge_method=S256")

    // storing the Code Verifier so it can be sent to the token endpoint
    // when exchanging the Authorization Code for an Access Token
    auth.codeVerifier = codeVerifier
  }

  const {additionalQueryStringParams} = authConfigs

  for (const key in additionalQueryStringParams) {
    if (typeof additionalQueryStringParams[key] !== "undefined") {
      query.push(
        [key, additionalQueryStringParams[key]]
          .map(encodeURIComponent)
          .join("="),
      )
    }
  }

  const authorizationUrl = schema.get("authorizationUrl")
  let sanitizedAuthorizationUrl
  if (currentServer) {
    // OpenAPI 3
    sanitizedAuthorizationUrl = parseUrl(
      sanitizeUrl(authorizationUrl),
      currentServer,
      true,
    ).toString()
  } else {
    sanitizedAuthorizationUrl = sanitizeUrl(authorizationUrl)
  }
  const url = [sanitizedAuthorizationUrl, query.join("&")].join(
    typeof authorizationUrl === "string" && !authorizationUrl.includes("?")
      ? "?"
      : "&",
  )

  // pass action authorizeOauth2 and authentication data through window
  // to authorize with oauth2

  let callback
  if (flow === "implicit") {
    callback = authActions.preAuthorizeImplicit
  } else if (authConfigs.useBasicAuthenticationWithAccessCodeGrant) {
    callback = authActions.authorizeAccessCodeWithBasicAuthentication
  } else {
    callback = authActions.authorizeAccessCodeWithFormParams
  }

  authActions.authPopup(url, {
    auth,
    callback,
    errCb: errActions.newAuthErr,
    redirectUrl,
    state,
  })
}
