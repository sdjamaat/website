import React, { useContext } from "react"
import { navigate } from "gatsby"
import { AuthContext } from "../provider/auth-context"

const PrivateRoute = ({ component: Component, location, path, ...rest }) => {
  const { isLoggedIn, getAuthUser, signOut, currUser } = useContext(AuthContext)

  if (!isLoggedIn || getAuthUser() === null) {
    signOut()
    navigate("/login")
    return null
  } else if (location.pathname === "/auth/admin") {
    if (!currUser.permissions.admin) {
      navigate("/")
      return null
    }
  }
  return <Component {...rest} />
}
export default PrivateRoute
