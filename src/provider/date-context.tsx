import React, { createContext } from "react"
import { monthIndexToName } from "../functions/calendar"
const moment = require("moment-timezone")
moment().tz("America/Los_Angeles").format()
const momentHijri = require("moment-hijri")

const defaultState = {
  momentHijri: null,
  getHijriDate: (): HijriDateReturn => {
    return
  },
}

export const DateContext = createContext(defaultState)

interface HijriDateReturn {
  day: any
  month: any
  year: any
  databaseYear: any
  shortMonthName: string
  longMonthName: string
}

export const DateProvider = ({ children }) => {
  const getHijriDate = (): HijriDateReturn => {
    const newDate = momentHijri().add(1, "days")
    let databaseYear = newDate.iYear()
    // for moharram, the "year" in terms of the database is last year
    // Ex: the menu for Moharram 1443 is created in Zil Haj 1442, the year prior
    // In the database, the collection we first query is the hijri year, then it's the month
    if (newDate.iMonth() === 0) {
      databaseYear = newDate.iYear() - 1
    }
    const longMonthName = monthIndexToName(newDate.iMonth()).long
    const shortMonthName = monthIndexToName(newDate.iMonth()).short

    return {
      day: newDate.iDate(),
      month: newDate.iMonth(),
      year: newDate.iYear(),
      databaseYear: databaseYear,
      shortMonthName: shortMonthName,
      longMonthName: longMonthName,
    }
  }

  return (
    <DateContext.Provider
      value={{
        momentHijri,
        getHijriDate,
      }}
    >
      {children}
    </DateContext.Provider>
  )
}
