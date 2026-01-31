import {access} from "node:fs/promises"

export async function exists(dirPath: string): Promise<boolean> {
  return access(dirPath)
    .then(() => true)
    .catch(() => false)
}
