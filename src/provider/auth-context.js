import React, { createContext, useState } from "react"
import firebase from "gatsby-plugin-firebase"
const hasWindow = typeof window !== "undefined"
const SecureLS = hasWindow ? require("secure-ls") : null
const localEncryptedStore = hasWindow
  ? new SecureLS({ encodingType: "aes" })
  : null

const defaultState = {
  getAuthUser: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  signOut: () => {},
  localEncryptedStore: () => {},
}

export const AuthContext = createContext(defaultState)

export const AuthProvider = ({ children }) => {
  const verifyAuthUser = () => {
    try {
      const user = localEncryptedStore.get("authUser")
      if (user.length !== 0) {
        return user
      } else {
        return null
      }
    } catch (error) {
      localEncryptedStore.removeAll()
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
        localEncryptedStore.removeAll()
      })
  }

  return (
    <AuthContext.Provider
      value={{
        getAuthUser,
        isLoggedIn,
        setIsLoggedIn,
        signOut,
        localEncryptedStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
