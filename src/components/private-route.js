import React, { useContext } from "react"
import { AuthContext } from "../provider/auth-context"

const PrivateRoute = ({ component: Component, location, path, ...rest }) => {
  const { isLoggedIn, signOut, verifyAuthUser } = useContext(AuthContext)

  if (!isLoggedIn || verifyAuthUser() === null) {
    signOut()
    return null
  }

  return <Component {...rest} />
}
export default PrivateRoute
