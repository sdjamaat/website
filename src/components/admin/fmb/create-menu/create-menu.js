import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Card } from "antd"
import firebase from "gatsby-plugin-firebase"
import HijriMonthForm from "./hijri-month-form"
import MenuItemsForm from "./menu-items-form"
import ReviewMenu from "./review-menu"
const momentHijri = require("moment-hijri")

const CreateMenu = () => {
  const [monthsFinished, setMonthsFinished] = useState([])
  const [step, setstep] = useState("hijrimonth")
  const [hijriMonthFormValues, setHijriMonthFormValues] = useState({})
  const [menuItemsFormValues, setMenuItemsFormValues] = useState({})
  const [disabledMenuItems, setDisabledMenuItemNames] = useState([])

  const getMonthsFinished = async () => {
    let finishedArr = []
    try {
      const resp = await firebase
        .firestore()
        .collection("fmb")
        .doc(momentHijri().iYear().toString())
        .get()

      finishedArr = resp.data().finished
    } catch (error) {
      console.log("Error getting documents", error)
    }
    setMonthsFinished(finishedArr)
  }

  useEffect(() => {
    getMonthsFinished()
  }, [])

  const getStep = step => {
    switch (step) {
      case "hijrimonth":
        return (
          <HijriMonthForm
            monthsFinished={monthsFinished}
            setStep={setstep}
            values={hijriMonthFormValues}
            setValues={setHijriMonthFormValues}
          />
        )
      case "menuitems":
        return (
          <MenuItemsForm
            setStep={setstep}
            values={menuItemsFormValues}
            setValues={setMenuItemsFormValues}
            disabledValues={disabledMenuItems}
            setDisabledValues={setDisabledMenuItemNames}
          />
        )
      case "reviewmenu":
        return (
          <ReviewMenu
            setStep={setstep}
            hijrimonthForm={hijriMonthFormValues}
            menuitemsForm={menuItemsFormValues}
          />
        )
      default:
        return (
          <HijriMonthForm
            monthsFinished={monthsFinished}
            setStep={setstep}
            values={hijriMonthFormValues}
            setValues={setHijriMonthFormValues}
          />
        )
    }
  }

  return (
    <CreateMenuWrapper>
      <Card
        title="Create New Menu"
        headStyle={{ fontSize: "1.5rem", textAlign: "center" }}
        bodyStyle={{ paddingBottom: "0" }}
      >
        {getStep(step)}
      </Card>
    </CreateMenuWrapper>
  )
}

const CreateMenuWrapper = styled.div`
  max-width: 1000px;
  margin: auto;
  .next-btn {
    padding-top: 0.2rem;
    padding-bottom: 2.2rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`

export default CreateMenu
