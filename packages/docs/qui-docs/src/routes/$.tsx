import {
  isRouteErrorResponse,
  LoaderFunctionArgs,
  redirect,
  useRouteError,
} from "react-router"

import {siteData} from "@qualcomm-ui/mdx-vite-plugin"
import {NotFound} from "@qualcomm-ui/react-mdx/not-found"

export function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const pages = siteData.exports?.pages ?? []

  if (url.pathname.endsWith(".md") && pages.length) {
    try {
      const exportId = url.pathname.split("/").join("-").substring(1)
      return redirect(`/exports/md/${exportId}`)
    } catch {
      // file doesn't exist, fall through to 404
    }
  }

  throw new Response("Not Found", {status: 404}) as any
}

export function ErrorBoundary() {
  const error = useRouteError()
  return (
    <h1>
      {isRouteErrorResponse(error) ? (
        <NotFound />
      ) : error instanceof Error ? (
        error.message
      ) : (
        "Unknown Error"
      )}
    </h1>
  )
}

export default () => null
