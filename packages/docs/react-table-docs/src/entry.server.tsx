import {createReadableStreamFromReadable} from "@react-router/node"
import {isbot} from "isbot"
import {readFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {PassThrough} from "node:stream"
import {fileURLToPath} from "node:url"
import {
  renderToPipeableStream,
  type RenderToPipeableStreamOptions,
} from "react-dom/server"
import {
  type AppLoadContext,
  type EntryContext,
  ServerRouter,
} from "react-router"

import {siteData} from "@qualcomm-ui/mdx-vite-plugin"
import {exists} from "@qualcomm-ui/node-utils/fs"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const streamTimeout = 5_000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  // https://httpwg.org/specs/rfc9110.html#HEAD
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      headers: responseHeaders,
      status: responseStatusCode,
    })
  }

  // raw knowledge `.md` routes
  const url = new URL(request.url)
  const pages = siteData.exports?.pages ?? []

  if (url.pathname.endsWith(".md") && pages.length) {
    const exportsPath = import.meta.env.DEV
      ? resolve(__dirname, "../public/exports/md")
      : resolve(__dirname, "../client/exports/md")
    try {
      const exportId = url.pathname.split("/").join("-").substring(1)

      const filePath = resolve(exportsPath, exportId)
      if (await exists(filePath)) {
        const contents = await readFile(filePath, "utf-8")
        responseHeaders.set("Content-Type", "text/plain")
        return new Response(contents, {
          headers: responseHeaders,
          status: 200,
        })
      }
    } catch {
      // file doesn't exist, continue as normal
    }
  }

  return new Promise((resolve, reject) => {
    let shellRendered = false
    const userAgent = request.headers.get("user-agent")

    // Ensure requests from bots and SPA Mode renders wait for all content to load
    // before responding https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode
        ? "onAllReady"
        : "onShellReady"

    // Abort the rendering stream after the `streamTimeout` so it has time to
    // flush down the rejected boundaries
    let timeoutId: ReturnType<typeof setTimeout> | undefined = setTimeout(
      () => abort(),
      streamTimeout + 1000,
    )

    const {abort, pipe} = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onError(error: unknown) {
          responseStatusCode = 500
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error)
          }
        },
        onShellError(error: unknown) {
          reject(error)
        },
        [readyOption]() {
          shellRendered = true
          const body = new PassThrough({
            final(callback: any) {
              // Clear the timeout to prevent retaining the closure and memory leak
              clearTimeout(timeoutId)
              timeoutId = undefined
              callback()
            },
          })
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set("Content-Type", "text/html")

          pipe(body)

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )
        },
      },
    )
  })
}
