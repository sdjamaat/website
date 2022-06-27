import React, { createContext, useContext } from "react"
import firebase, { firestore } from "firebase"
import { DateContext } from "./date-context"

const defaultState = {
  hijriYearDocRef: (): firestore.DocumentReference => {
    return
  },
}

export const DatabaseContext = createContext(defaultState)

export const DatabaseProvider = ({ children }) => {
  const { getHijriDate } = useContext(DateContext)
  const hijriYearDocRef = (): firestore.DocumentReference => {
    const fmbYearQuery = firebase
      .firestore()
      .collection("fmb")
      .doc(getHijriDate().year.toString())
    return fmbYearQuery
  }
  return (
    <DatabaseContext.Provider
      value={{
        hijriYearDocRef,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  )
}
