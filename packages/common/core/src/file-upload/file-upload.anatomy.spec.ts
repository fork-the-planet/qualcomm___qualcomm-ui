// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {fileUploadAnatomy, fileUploadParts} from "./index"

describe("fileUploadAnatomy", () => {
  test("exports all file upload parts with namespaced attributes", () => {
    expect(fileUploadParts).toEqual([
      "root",
      "label",
      "hiddenInput",
      "trigger",
      "clearTrigger",
      "dropzone",
      "errorText",
      "itemGroup",
      "item",
      "itemName",
      "itemPreview",
      "itemPreviewImage",
      "itemSizeText",
      "itemDeleteTrigger",
    ])

    expect(fileUploadAnatomy.parts.clearTrigger).toEqual({
      "data-file-upload-part": "clear-trigger",
    })
    expect(fileUploadAnatomy.parts.hiddenInput).toEqual({
      "data-file-upload-part": "hidden-input",
    })
  })
})
