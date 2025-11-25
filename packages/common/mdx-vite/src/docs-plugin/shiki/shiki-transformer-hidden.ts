import type {ShikiTransformer} from "shiki"

/**
 * Use `[!code hide]` notation in code to mark lines as hidden.
 */
export function transformerNotationHidden(): ShikiTransformer {
  return {
    enforce: "post",
    name: "shiki-transformer-notation-hidden",
    preprocess(code) {
      const lines = code.split("\n")
      const resultLines: string[] = []
      let hideNextCount = 0

      for (const rawLine of lines) {
        const line = rawLine
        const match = line.match(/\[!code\s+hide(?::(\d+))?\]/)

        if (match) {
          const before = line.slice(0, match.index ?? 0)
          const after = line.slice((match.index ?? 0) + match[0].length)

          const count = match[1] ? Number(match[1]) : 1
          const validCount = Number.isFinite(count) && count > 0 ? count : 0

          const beforeIsOnlyCommentOrWhitespace =
            before.trim() === "" || /^[\s/]*$/.test(before)
          const afterIsEmpty = after.trim() === ""

          const markerIsStandalone =
            beforeIsOnlyCommentOrWhitespace && afterIsEmpty

          if (markerIsStandalone) {
            hideNextCount += validCount
            continue
          }

          // inline marker → hide this line only
          continue
        }

        if (hideNextCount > 0) {
          hideNextCount -= 1
          continue
        }

        resultLines.push(line)
      }

      return resultLines.join("\n").trim()
    },
  }
}
