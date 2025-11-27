import {redirect} from "react-router"

export function loader() {
  return redirect("/features/pagination-client-side", 301)
}
