import React, { useContext, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../../provider/auth-context"
import useQueryParam from "../../custom-hooks/use-query-params"
import Layout from "./layout"

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, signOut, verifyAuthUser } = useContext(AuthContext)

  const [tab] = useQueryParam("tab", "")

  const verifUser = verifyAuthUser()
  const isAuthenticated = isLoggedIn && verifUser !== null

  useEffect(() => {
    if (!isAuthenticated && verifUser === null) {
      signOut(window.location.pathname, tab)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    if (verifUser === null) {
      return null // useEffect will handle signOut + redirect
    }
    return <Navigate to="/login" replace />
  }

  return <Layout>{children}</Layout>
}
export default PrivateRoute
