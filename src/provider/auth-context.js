import React, { createContext, useState } from "react"
import firebase from "gatsby-plugin-firebase"
import { navigate } from "gatsby"
const hasWindow = typeof window !== "undefined"
const SecureLS = hasWindow ? require("secure-ls") : null
const localEncryptedStore = hasWindow
  ? new SecureLS({
      encodingType: "aes",
      encryptionSecret: process.env.GATSBY_ENCRYPTION_SECRET,
    })
  : null

const defaultState = {
  getAuthUser: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  signOut: () => {},
  localEncryptedStore: () => {},
  currUser: null,
  setCurrUser: () => {},
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
      localStorage.removeItem("authUser")
      localStorage.removeItem("_secure__ls__metadata")
      return null
    }
  }

  const [isLoggedIn, setIsLoggedIn] = useState(verifyAuthUser() !== null)

  const getAuthUser = () => {
    if (isLoggedIn) {
      const user = verifyAuthUser()
      return user
    } else {
      return null
    }
  }

  const [currUser, setCurrUser] = useState(getAuthUser())

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => setIsLoggedIn(false))
      .then(() => {
        localStorage.removeItem("authUser")
        localStorage.removeItem("_secure__ls__metadata")
      })
      .then(() => {
        navigate("/login")
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
        currUser,
        setCurrUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
