import React, { useContext } from "react"
import { AuthContext } from "../provider/auth-context"
import useQueryParam from "../custom-hooks/use-query-params"

const PrivateRoute = ({ component: Component, location, path, ...rest }) => {
  const { isLoggedIn, signOut, verifyAuthUser } = useContext(AuthContext)

  const [tab, setTab] = useQueryParam("tab", "")

  let verifUser = verifyAuthUser()
  if (!isLoggedIn || verifUser === null) {
    if (verifUser === null) {
      signOut(window.location.pathname, tab)
    } else {
      signOut()
    }

    return null
  }

  return <Component {...rest} />
}
export default PrivateRoute
