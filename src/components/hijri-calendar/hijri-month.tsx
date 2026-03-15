import React, { useContext } from "react"
import { monthIndexToName } from "../../functions/calendar"
import { DateContext } from "../../provider/date-context"
import styled from "styled-components"
import DateBox from "./date-box"
import momentHijri from "moment-hijri"

const getMonthArrayValues = (month: number) => {
  let dateArr: any[][] = []
  const start = (momentHijri as any)().iMonth(month).startOf("iMonth")
  const end = (momentHijri as any)().iMonth(month).endOf("iMonth")
  const startDay = start.day()
  const modifiedStart = start.clone().subtract(startDay, "days")

  let row: any[] = []
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

const HijriMonth = ({ monthIndex, onClickHandler, dateBoxContent }: any) => {
  const monthArr = getMonthArrayValues(monthIndex)
  const { getHijriDate } = useContext(DateContext)

  const handleDateClick = (dateObj: any) => {
    onClickHandler(dateObj)
  }

  return (
    <HijriMonthWrapper>
      <div>
        <div style={{ padding: "1.5rem", paddingTop: ".5rem", textAlign: "center", fontSize: "1.2rem" }}>
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

        {monthArr.map((week, index) => (
          <div key={index} className="week">
            {week.map((day, dayIndex) => {
              let isDayToday = day.dateObj.clone().format("MM-DD-YYYY") === (momentHijri as any)().format("MM-DD-YYYY")
              return (
                <div
                  key={dayIndex}
                  className={`day ${isDayToday ? "active" : ""}`}
                  style={day.disabled ? { pointerEvents: "none", opacity: 0.4 } : { cursor: "pointer" }}
                  onClick={() => !day.disabled && handleDateClick(day.dateObj)}
                >
                  <DateBox hijriDay={day.dateObj.iDate()} englishDay={day.dateObj.clone().date()}>
                    {!day.disabled && dateBoxContent(day.dateObj)}
                  </DateBox>
                </div>
              )
            })}
          </div>
        ))}
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
