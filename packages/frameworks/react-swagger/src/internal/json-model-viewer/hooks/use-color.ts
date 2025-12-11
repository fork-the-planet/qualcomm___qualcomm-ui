// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useJsonViewerStore} from "../stores"

export const useTextColor = () => {
  return useJsonViewerStore((store) => store.colorspace.base07)
}
