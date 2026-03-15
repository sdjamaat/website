import React, { createContext, useContext } from "react"
import { doc, DocumentReference } from "firebase/firestore"
import { db } from "../lib/firebase"
import { DateContext } from "./date-context"

const defaultState = {
  hijriYearDocRef: (): DocumentReference | any => {},
}

export const DatabaseContext = createContext(defaultState)

export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const { getHijriDate } = useContext(DateContext)
  const hijriYearDocRef = (): DocumentReference => {
    return doc(db, "fmb", getHijriDate().year.toString())
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
