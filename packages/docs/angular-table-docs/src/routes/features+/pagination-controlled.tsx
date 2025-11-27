import {redirect} from "react-router"

export function loader() {
  return redirect("/features/pagination-server-side", 301)
}
