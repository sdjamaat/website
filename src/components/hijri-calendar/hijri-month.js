//renders a single month from a hijri calendar
import React, { useContext } from "react"
import { monthIndexToName } from "../../functions/calendar"
import { DateContext } from "../../provider/date-context"
import styled from "styled-components"
import DateBox from "./date-box"
import { Disable } from "react-disable"
const momentHijri = require("moment-hijri")

const getMonthArrayValues = month => {
  let dateArr = []

  // get hijri month start and end date
  const start = momentHijri().iMonth(month).startOf("iMonth")
  const end = momentHijri().iMonth(month).endOf("iMonth")

  // Get the day of week for start date (0 = Sunday, 1 = Monday, etc.)
  const startDay = start.day()

  // push back start day to beginning of week (sunday)
  const modifiedStart = start.clone().subtract(startDay, "days")

  // add 35 date entries beginning from adjusted start date
  let row = []
  for (let i = 0; i < 35; i++) {
    const addedDay = modifiedStart.clone().add(i, "days")
    let isDisabled = false
    if (addedDay.isAfter(end) || addedDay.isBefore(start)) isDisabled = true
    row.push({ dateObj: addedDay, disabled: isDisabled })
    if ((i + 1) % 7 === 0) {
      dateArr.push(row)
      row = []
    }
  }

  return dateArr || []
}

const HijriMonth = ({ monthIndex, onClickHandler, dateBoxContent }) => {
  const monthArr = getMonthArrayValues(monthIndex)

  const { getHijriDate } = useContext(DateContext)

  // Function to handle date clicks and ensure day consistency
  const handleDateClick = dateObj => {
    // Use the dateObj directly without any adjustments
    onClickHandler(dateObj)
  }

  return (
    <HijriMonthWrapper>
      <div>
        <div
          style={{
            padding: "1.5rem",
            paddingTop: ".5rem",
            textAlign: "center",
            fontSize: "1.2rem",
          }}
        >
          {monthIndexToName(monthIndex).long} {getHijriDate().year}
        </div>
        <div className="week mb-2 text-center">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {monthArr.map((week, index) => {
          return (
            <div key={index} className="week">
              {week.map((day, index) => {
                let isDayToday = false
                if (
                  day.dateObj.clone().format("MM-DD-YYYY") ===
                  momentHijri().format("MM-DD-YYYY")
                ) {
                  isDayToday = true
                }

                return (
                  <Disable
                    disabled={day.disabled}
                    key={index}
                    className={`day ${isDayToday ? "active" : ""}
                    }`}
                    onClick={() => handleDateClick(day.dateObj)}
                  >
                    <div style={{ cursor: `${day.disabled ? "" : "pointer"}` }}>
                      <DateBox
                        hijriDay={day.dateObj.iDate()}
                        englishDay={day.dateObj.clone().date()}
                      >
                        {!day.disabled && dateBoxContent(day.dateObj)}
                      </DateBox>
                    </div>
                  </Disable>
                )
              })}
            </div>
          )
        })}
      </div>
    </HijriMonthWrapper>
  )
}

const HijriMonthWrapper = styled.div`
  .week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    min-height: 0;
    min-width: 0;
  }
  .day {
    overflow: hidden;
    min-width: 0;
    margin-left: 0.15rem;
    margin-right: 0.15rem;
    margin-bottom: 0.2rem;
  }

  .day:hover {
    background-color: #eef4fa;
  }

  .day.active {
    background-color: #eef4fa;
  }
`

export default HijriMonth
