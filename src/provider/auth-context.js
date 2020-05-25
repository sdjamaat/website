import React, { createContext, useEffect, useState } from "react"
import firebase from "gatsby-plugin-firebase"
import { navigate } from "gatsby"

const defaultState = {
  getAuthUser: () => {},
  isLoggedIn: () => false,
  signOut: () => {},
}

export const AuthContext = createContext(defaultState)

export const AuthProvider = ({ children }) => {
  const isLoggedIn = () => {
    return localStorage.getItem("authUser") !== null
  }

  useEffect(() => {
    const unlisten = firebase.auth().onAuthStateChanged(user => {
      if (user === null) {
        localStorage.removeItem("authUser")
      }
    })
    return () => {
      unlisten()
    }
  }, [])

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
