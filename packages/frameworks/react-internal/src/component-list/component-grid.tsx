// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Link} from "react-router"

import {componentList} from "./component-list"

/**
 * To consume this grid, the site must have images at `/public/images/components/*`
 *
 * Refer to the @qualcomm-ui/react-docs package for these.
 */
export function ComponentGrid(): ReactElement {
  return (
    <div className="qui-component-grid__root">
      {componentList.map((component) => (
        <Link
          key={component.name}
          className="qui-component-grid__item"
          to={component.url}
        >
          <img
            alt={component.name}
            height={150}
            src={`/images/components/${component.fileName}`}
            width={200}
          />
          <div className="qui-component-grid__item-description">
            <h3 className="font-heading-xxs">{component.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
