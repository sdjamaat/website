import React from "react"
import styled from "styled-components"
const NS = require("numeral-systems")
let typeResultNumerals = "Arabic"

const convertToArabic = num => {
  const id = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹"]
  return num.replace(/[0-9]/g, w => {
    return id[+w]
  })
}

const DateBox = ({ hijriDay, englishDay, children }) => {
  const arabicNumber = convertToArabic(hijriDay + "")
  return (
    <DateBoxWrapper>
      <div className="float-right" style={{ fontSize: "1.5rem" }}>
        {arabicNumber}
      </div>{" "}
      <br />
      <div>{children}</div>
      <div className="english-day">{englishDay}</div>
    </DateBoxWrapper>
  )
}

const DateBoxWrapper = styled.div`
  height: 120px;
  border-top: 1.5px solid #bfbfbf;
  padding: 0.2rem 0.5rem 0rem 0rem;
  position: relative;
  .english-day {
    position: absolute;
    bottom: 0;
    left: 0;
    padding-bottom: 0.3rem;
    padding-left: 0.5rem;
  }
`

export default DateBox
