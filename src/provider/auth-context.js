import React, { createContext, useState, useEffect } from "react"
import firebase from "gatsby-plugin-firebase"
import { navigate } from "gatsby"
const hasWindow = typeof window !== "undefined"
const SecureLS = hasWindow ? require("secure-ls") : null
const localEncryptedStore = hasWindow
  ? new SecureLS({
      encodingType: process.env.GATSBY_ENCRYPTION_TYPE,
      encryptionSecret: process.env.GATSBY_ENCRYPTION_SECRET,
    })
  : null

const defaultState = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  signOut: () => {},
  localEncryptedStore: () => {},
  currUser: null,
  setCurrUser: () => {},
  verifyAuthUser: () => {},
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

  useEffect(() => {
    // listen for changes in user or family information
    if (currUser !== null && isLoggedIn) {
      try {
        // onSnapshot for family information
        firebase
          .firestore()
          .collection("families")
          .doc(currUser.familyid)
          .onSnapshot(doc => {
            localEncryptedStore.set("authUser", {
              ...currUser,
              family: {
                ...doc.data(),
              },
            })
            setCurrUser(localEncryptedStore.get("authUser"))
          })

        // onSnapshot for user information
        firebase
          .firestore()
          .collection("users")
          .doc(currUser.uid)
          .onSnapshot(async doc => {
            if (doc.exists) {
              const userInfo = doc.data()
              if (!userInfo.admin) {
                const familyDoc = await firebase
                  .firestore()
                  .collection("families")
                  .doc(userInfo.familyid)
                  .get()

                localEncryptedStore.set("authUser", {
                  uid: userInfo.uid,
                  firstname: userInfo.firstname,
                  lastname: userInfo.lastname,
                  email: userInfo.email,
                  familyid: userInfo.familyid,
                  its: userInfo.its,
                  phone: userInfo.phone,
                  title: userInfo.title,
                  yob: userInfo.yob,
                  family: {
                    ...familyDoc.data(),
                  },
                })
                setCurrUser(localEncryptedStore.get("authUser"))
              } else {
                signOut()
              }
            } else {
              signOut()
            }
          })
      } catch {
        signOut()
      }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        signOut,
        localEncryptedStore,
        currUser,
        setCurrUser,
        verifyAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
