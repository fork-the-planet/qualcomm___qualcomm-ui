// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {access} from "node:fs/promises"

/**
 * Check if a file or directory exists at the given path.
 * A promise-friendly, non-blocking alternative to `fs.existsSync`.
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}
