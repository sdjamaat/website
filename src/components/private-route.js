import React, { useContext } from "react"
import { navigate } from "gatsby"
import { AuthContext } from "../provider/auth-context"

const PrivateRoute = ({ component: Component, location, path, ...rest }) => {
  const { isLoggedIn } = useContext(AuthContext)

  if (!isLoggedIn()) {
    navigate("/login")
    return null
  }
  return <Component {...rest} />
}
export default PrivateRoute
