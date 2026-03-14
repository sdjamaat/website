import React, { createContext } from "react"
import { monthIndexToName } from "../functions/calendar"
import momentTimezone from "moment-timezone"
import momentHijri from "moment-hijri"

momentTimezone().tz("America/Los_Angeles").format()

interface HijriDateReturn {
  day: any
  month: any
  year: any
  databaseYear: any
  shortMonthName: string
  longMonthName: string
}

const defaultState = {
  momentHijri: null as any,
  getHijriDate: (): HijriDateReturn => {
    return {} as HijriDateReturn
  },
}

export const DateContext = createContext(defaultState)

export const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const getHijriDate = (): HijriDateReturn => {
    const newDate = (momentHijri as any)().add(1, "days")
    let databaseYear = newDate.iYear()
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
