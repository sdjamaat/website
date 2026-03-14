import React, { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { onSnapshot, doc, getDoc } from "firebase/firestore"
import { signOut as firebaseSignOut } from "firebase/auth"
import { auth, db } from "../lib/firebase"
import moment from "moment"
import SecureLS from "secure-ls"

const localEncryptedStore = new SecureLS({
  encodingType: import.meta.env.VITE_ENCRYPTION_TYPE,
  encryptionSecret: import.meta.env.VITE_ENCRYPTION_SECRET,
})

const defaultState = {
  isLoggedIn: false,
  setIsLoggedIn: (_value: boolean) => {},
  signOut: (path?: string | null, tab?: string | null) => {},
  localEncryptedStore: localEncryptedStore,
  currUser: null as any,
  setCurrUser: (user: any) => {},
  verifyAuthUser: (): any => {},
}

export const AuthContext = createContext(defaultState)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  const checkTimeStampValid = (timestamp: any) => {
    const ts = moment(timestamp).add(14, "d")
    let currDate = moment()
    return currDate.isBefore(ts)
  }

  const verifyAuthUser = () => {
    try {
      const user = localEncryptedStore.get("authUser")
      if (user.length !== 0 && checkTimeStampValid(user.timestamp)) {
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

  const signOut = (path: string | null = null, tab: string | null = null) => {
    firebaseSignOut(auth)
      .then(() => setIsLoggedIn(false))
      .then(() => {
        localStorage.removeItem("authUser")
        localStorage.removeItem("_secure__ls__metadata")
      })
      .then(() => {
        if (path) {
          navigate(`/login?path=${path}&tab=${tab}`)
        } else {
          navigate("/login")
        }
      })
  }

  useEffect(() => {
    if (currUser !== null && isLoggedIn) {
      try {
        // onSnapshot for family information
        onSnapshot(doc(db, "families", currUser.familyid), (docSnap) => {
          localEncryptedStore.set("authUser", {
            ...currUser,
            timestamp: Date.now(),
            family: {
              ...docSnap.data(),
            },
          })
          setCurrUser(localEncryptedStore.get("authUser"))
        })

        // onSnapshot for user information
        onSnapshot(doc(db, "users", currUser.uid), async (docSnap) => {
          if (docSnap.exists()) {
            const userInfo = docSnap.data()
            if (!userInfo.admin) {
              const familyDoc = await getDoc(doc(db, "families", userInfo.familyid))

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
                timestamp: Date.now(),
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
