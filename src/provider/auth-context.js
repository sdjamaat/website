import React, { createContext, useEffect } from "react"
import firebase from "gatsby-plugin-firebase"
import { navigate } from "gatsby"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    const unlisten = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        localStorage.setItem(
          "authUser",
          JSON.stringify({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
          })
        )
      } else {
        localStorage.removeItem("authUser")
      }
    })
    return () => {
      unlisten()
    }
  }, [])

  const isLoggedIn = () => {
    return localStorage.getItem("authUser") !== null
  }

  const getAuthUser = () => {
    if (isLoggedIn()) {
      return JSON.parse(localStorage.getItem("authUser"))
    } else {
      return null
    }
  }

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("authUser")
      })
      .then(() => navigate("/login"))
  }

  return (
    <AuthContext.Provider value={{ getAuthUser, isLoggedIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
