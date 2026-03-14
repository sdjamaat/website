import React, { useContext } from "react"
import { AuthContext } from "../../provider/auth-context"
import useQueryParam from "../../custom-hooks/use-query-params"
import Layout from "./layout"

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, signOut, verifyAuthUser } = useContext(AuthContext)

  const [tab] = useQueryParam("tab", "")

  let verifUser = verifyAuthUser()
  if (!isLoggedIn || verifUser === null) {
    if (verifUser === null) {
      signOut(window.location.pathname, tab)
    } else {
      signOut()
    }

    return null
  }

  return <Layout>{children}</Layout>
}
export default PrivateRoute
