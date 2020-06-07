import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Card, Spin, message } from "antd"
import firebase from "gatsby-plugin-firebase"
import HijriMonthForm from "./hijri-month-form"
import MenuItemsForm from "./menu-items-form"
import ReviewMenu from "./review-menu"
import { cloneDeep } from "lodash"
const momentHijri = require("moment-hijri")

const CreateMenu = ({ setPage }) => {
  const [step, setstep] = useState("hijrimonth")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNextMoharramFinished, setIsNextMoharaamFinished] = useState(false)
  const [monthsFinished, setMonthsFinished] = useState([])
  const [hijriMonthFormValues, setHijriMonthFormValues] = useState({})
  const [menuItemsFormValues, setMenuItemsFormValues] = useState({})
  const [disabledMenuItems, setDisabledMenuItemNames] = useState([])

  const getMonthsFinished = async () => {
    let finishedArr = []
    try {
      const queryForFmbHijriDoc = await firebase
        .firestore()
        .collection("fmb")
        .doc(momentHijri().iYear().toString())

      const yearCollection = await queryForFmbHijriDoc.get()
      if (yearCollection.exists) {
        finishedArr = yearCollection.data().finished
        if (yearCollection.data().nextMoharramFinished) {
          setIsNextMoharaamFinished(true)
        }
      } else {
        await queryForFmbHijriDoc.set({
          finished: [],
          nextMoharramFinished: false,
        })
        await queryForFmbHijriDoc.collection("menus")
      }
    } catch (error) {
      console.log("Error getting documents", error)
    }
    setMonthsFinished(finishedArr)
  }

  useEffect(() => {
    getMonthsFinished()
  }, [])

  const getProcessedMenuItemsArray = () => {
    let newMenuItemsArr = cloneDeep(menuItemsFormValues.items)

    for (let item of newMenuItemsArr) {
      item.date = item.date.format("MM-DD-YYYY")
      item.nothaali = item.nothaali || false
    }
    return newMenuItemsArr
  }

  const getYear = async () => {
    const currYear = momentHijri().iYear()
    if (hijriMonthFormValues.year === currYear) {
      return { year: currYear, setInitialDocValues: false }
    } else {
      const nextYear = currYear + 1
      return { year: nextYear, setInitialDocValues: true }
    }
  }

  const submitMenu = async () => {
    setIsSubmitting(true)
    const { year, setInitialDocValues } = await getYear()
    try {
      const queryForFmbHijriDoc = await firebase
        .firestore()
        .collection("fmb")
        .doc(year.toString())

      if (setInitialDocValues) {
        const prevYear = year - 1

        await firebase
          .firestore()
          .collection("fmb")
          .doc(prevYear.toString())
          .update({ nextMoharramFinished: true })

        await queryForFmbHijriDoc.set({
          finished: [],
          nextMoharramFinished: false,
        })
        await queryForFmbHijriDoc.collection("menus")
      }

      await queryForFmbHijriDoc.update({
        finished: firebase.firestore.FieldValue.arrayUnion(
          hijriMonthFormValues.hijrimonth
        ),
      })

      await queryForFmbHijriDoc
        .collection("menus")
        .doc(hijriMonthFormValues.hijrimonth)
        .set({
          items: getProcessedMenuItemsArray(),
          active: false,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
      message.success("Successfully created new menu")
      setIsSubmitting(false)
      setPage("fmb-view-menus")
    } catch (error) {
      console.log(error)
      message.error("Error, could not submit menu")
      setIsSubmitting(false)
    }
  }

  const getStep = step => {
    switch (step) {
      case "hijrimonth":
        return (
          <HijriMonthForm
            monthsFinished={monthsFinished}
            setStep={setstep}
            values={hijriMonthFormValues}
            setValues={setHijriMonthFormValues}
            isNextMoharramFinished={isNextMoharramFinished}
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
            submitMenu={submitMenu}
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
        <Spin spinning={isSubmitting}>{getStep(step)}</Spin>
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
