// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect, useRef} from "react"

export function useJumpToHash(
  getHash: (() => string) | undefined,
  elementId: string | undefined,
  /**
   * Callback fired only after the first time the function is fired.
   */
  initialMountCallback?: () => void,
) {
  const hash = getHash?.()

  const mountedRef = useRef(false)

  useEffect(() => {
    if (!mountedRef.current && hash && elementId && hash === `#${elementId}`) {
      const element = document.getElementById(elementId)
      if (element) {
        element.scrollIntoView()
        // on first mount when navigating to an operation, expand the panel
        if (!mountedRef.current) {
          initialMountCallback?.()
        }
      }
    }
    mountedRef.current = true
  }, [elementId, hash, initialMountCallback])
}
