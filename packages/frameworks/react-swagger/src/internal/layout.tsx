// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"

import type {GetComponent} from "./types"
import {useSwaggerContext} from "./use-swagger-context"

Layout.displayName = "Layout"

export interface LayoutProps {
  errActions: any
  errSelectors: any
  getComponent: GetComponent
  oas3Actions: any
  oas3Selectors: any
  specSelectors: any
}

export function Layout({
  errSelectors,
  getComponent,
  specSelectors,
}: LayoutProps): ReactNode {
  const SvgAssets = getComponent("SvgAssets")
  const InfoContainer = getComponent("InfoContainer", true)
  const VersionPragmaFilter = getComponent("VersionPragmaFilter")
  const Operations = getComponent("operations", true)
  const Models = getComponent("Models", true)
  const Webhooks = getComponent("Webhooks", true)
  const Row = getComponent("Row")
  const Col = getComponent("Col")
  const Errors = getComponent("errors", true)

  const ServersContainer = getComponent("ServersContainer", true)
  const SchemesContainer = getComponent("SchemesContainer", true)
  const AuthorizeBtnContainer = getComponent("AuthorizeBtnContainer", true)
  const FilterContainer = getComponent("FilterContainer", true)
  const isSwagger2 = specSelectors.isSwagger2()
  const isOAS3 = specSelectors.isOAS3()
  const isOAS31 = specSelectors.isOAS31()

  const isSpecEmpty = !specSelectors.specStr()

  const loadingStatus = specSelectors.loadingStatus()

  const {hideTitleSection} = useSwaggerContext()

  let loadingMessage = null

  if (loadingStatus === "loading") {
    loadingMessage = (
      <div className="info">
        <div className="loading-container">
          <div className="loading"></div>
        </div>
      </div>
    )
  }

  if (loadingStatus === "failed") {
    loadingMessage = (
      <div className="info">
        <div className="loading-container">
          <h4 className="title">Failed to load API definition.</h4>
          <Errors />
        </div>
      </div>
    )
  }

  if (loadingStatus === "failedConfig") {
    const lastErr = errSelectors.lastError()
    const lastErrMsg = lastErr ? lastErr.get("message") : ""
    loadingMessage = (
      <div className="info failed-config">
        <div className="loading-container">
          <h4 className="title">Failed to load remote configuration.</h4>
          <p>{lastErrMsg}</p>
        </div>
      </div>
    )
  }

  if (!loadingMessage && isSpecEmpty) {
    loadingMessage = <h4>No API definition provided.</h4>
  }

  if (loadingMessage) {
    return (
      <div className="swagger-ui">
        <div className="loading-container">{loadingMessage}</div>
      </div>
    )
  }

  const servers = specSelectors.servers()
  const schemes = specSelectors.schemes()

  const hasServers = servers && servers.size
  const hasSchemes = schemes && schemes.size
  const hasSecurityDefinitions = !!specSelectors.securityDefinitions()

  return (
    <div className="swagger-ui">
      <SvgAssets />
      <VersionPragmaFilter
        alsoShow={<Errors />}
        isOAS3={isOAS3}
        isSwagger2={isSwagger2}
      >
        <Errors />

        {hideTitleSection ? null : (
          <Row className="information-container">
            <Col mobile={12}>
              <InfoContainer />
            </Col>
          </Row>
        )}

        {hasServers || hasSchemes || hasSecurityDefinitions ? (
          <div
            className={clsx(
              "scheme-container",
              hideTitleSection ? "title-hidden" : "",
            )}
          >
            <div className="schemes-wrapper">
              {hasServers || hasSchemes ? (
                <div className="schemes-server-container">
                  {hasServers ? <ServersContainer /> : null}
                  {hasSchemes ? <SchemesContainer /> : null}
                </div>
              ) : null}
              {hasSecurityDefinitions ? <AuthorizeBtnContainer /> : null}
            </div>
          </div>
        ) : null}

        <FilterContainer />

        <Row>
          <Col desktop={12} mobile={12}>
            <Operations />
          </Col>
        </Row>

        {isOAS31 && (
          <Row className="webhooks-container">
            <Col desktop={12} mobile={12}>
              <Webhooks />
            </Col>
          </Row>
        )}

        <Row>
          <Col desktop={12} mobile={12}>
            <Models />
          </Col>
        </Row>
      </VersionPragmaFilter>
    </div>
  )
}
