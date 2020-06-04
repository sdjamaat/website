import React, { createContext, useState } from "react"
import firebase from "gatsby-plugin-firebase"
const SecureLS = require("secure-ls")
const ls = new SecureLS({ encodingType: "aes" })

const defaultState = {
  getAuthUser: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  signOut: () => {},
}

export const AuthContext = createContext(defaultState)

export const AuthProvider = ({ children }) => {
  const verifyAuthUser = () => {
    try {
      const user = ls.get("authUser")
      if (user.length !== 0) {
        return user
      } else {
        return null
      }
    } catch (error) {
      ls.removeAll()
      return null
    }
  }

  const [isLoggedIn, setIsLoggedIn] = useState(verifyAuthUser() !== null)

  const getAuthUser = () => {
    if (isLoggedIn) {
      return verifyAuthUser()
    } else {
      return null
    }
  }

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => setIsLoggedIn(false))
      .then(() => {
        ls.removeAll()
      })
  }

  return (
    <AuthContext.Provider
      value={{
        getAuthUser,
        isLoggedIn,
        setIsLoggedIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
