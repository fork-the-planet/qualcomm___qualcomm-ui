import {redirect} from "react-router"

export const loader = () => {
  return redirect("/guide/page-setup", {status: 302})
}
