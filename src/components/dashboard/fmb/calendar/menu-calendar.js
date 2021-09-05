import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import { Badge, Modal, Alert, Button } from "antd"
import {
  monthIndexToName,
  getNextMonthIndex,
} from "../../../../functions/calendar"
import HijriMonth from "../../../hijri-calendar/hijri-month"
import { DateContext } from "../../../../provider/date-context"
import firebase from "gatsby-plugin-firebase"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"

const FMBCalendar = () => {
  const [menu, setMenu] = useState([])
  const [nextMonthMenu, setNextMonthMenu] = useState(null)
  const [shouldShowNextMonth, setShouldShowNextMonth] = useState(false)
  const { getHijriDate } = useContext(DateContext)
  const [menuModalDetails, setMenuModalDetails] = useState({
    open: false,
    item: [],
    dateObj: null,
  })

  const getFirebaseData = async () => {
    try {
      const menuDetails = await firebase
        .firestore()
        .collection("fmb")
        .doc(getHijriDate().databaseYear.toString())
        .collection("menus")
        .doc(monthIndexToName(getHijriDate().month).short)
        .get()

      const menuDetailsNextMonth = await firebase
        .firestore()
        .collection("fmb")
        .doc(getHijriDate().year.toString())
        .collection("menus")
        .doc(monthIndexToName(getNextMonthIndex(getHijriDate().month)).short)
        .get()

      setMenu(menuDetails.data())

      if (menuDetailsNextMonth.data() !== "undefined") {
        setNextMonthMenu(menuDetailsNextMonth.data())
      }
    } catch (error) {
      setMenu([])
      setNextMonthMenu(null)
      console.log(error)
    }
  }

  useEffect(() => {
    getFirebaseData()
  }, [])

  const getMatchingItemForDate = dateValue => {
    let matchingItem = null
    let currMenu = null
    if (shouldShowNextMonth) {
      currMenu = nextMonthMenu
    } else {
      currMenu = menu
    }

    if (currMenu && currMenu !== null && currMenu.length !== 0) {
      let getMatchingItemArr = currMenu.items.filter(
        x => x.date === dateValue.format("MM-DD-YYYY")
      )

      if (getMatchingItemArr.length > 0) {
        matchingItem = getMatchingItemArr[0]
        return matchingItem
      }
    }
    return matchingItem
  }
  const openMenuDetailsModal = dateValue => {
    let englishDisplay = dateValue.format("dddd, MMMM Do YYYY")
    let hijriDisplay =
      dateValue.clone().add(1, "days").iDate() +
      " " +
      monthIndexToName(getHijriDate().month).long

    const matchingItem = getMatchingItemForDate(dateValue)
    setMenuModalDetails({
      ...menuModalDetails,
      englishDisplay: englishDisplay,
      hijriDisplay: hijriDisplay,
      item: matchingItem ? { ...matchingItem } : null,
      open: true,
    })
  }

  const closeMenuDetailsModal = () => {
    setMenuModalDetails({
      ...menuModalDetails,
      open: false,
    })
  }

  const getDateBoxContent = dateValue => {
    const matchingItem = getMatchingItemForDate(dateValue)
    if (matchingItem === null) {
      return null
    } else if (matchingItem.nothaali) {
      return (
        <Badge
          status="warning"
          text={
            matchingItem.reasonNoThaali
              ? `No Thaali (${matchingItem.reasonNoThaali})`
              : "No Thaali"
          }
        />
      )
    } else {
      return <Badge color="blue" text={matchingItem.name} />
    }
  }

  return (
    <FMBCalendarWrapper>
      <div
        style={{
          fontSize: "1.5rem",
          textAlign: "center",
        }}
      >
        Faiz-ul-Mawaid il-Burhaniyah Calendar
      </div>

      {menu === [] ? (
        <div>Loading...</div>
      ) : (
        <div className="cont">
          {nextMonthMenu && (
            <div className="box1">
              <Button
                onClick={() => setShouldShowNextMonth(!shouldShowNextMonth)}
                icon={<LeftOutlined />}
                disabled={!shouldShowNextMonth}
              ></Button>
              <Button
                className="float-right"
                onClick={() => setShouldShowNextMonth(!shouldShowNextMonth)}
                icon={<RightOutlined />}
                disabled={shouldShowNextMonth}
              ></Button>
            </div>
          )}
          <div className="box2">
            <HijriMonth
              monthIndex={
                shouldShowNextMonth
                  ? getNextMonthIndex(getHijriDate().month)
                  : getHijriDate().month
              }
              onClickHandler={openMenuDetailsModal}
              dateBoxContent={getDateBoxContent}
            />
          </div>
        </div>
      )}
      <Modal
        title="Menu Item"
        visible={menuModalDetails.open}
        footer={null}
        onCancel={closeMenuDetailsModal}
      >
        <div style={{ color: "gray", paddingBottom: "1rem" }}>
          {menuModalDetails.hijriDisplay !== null
            ? menuModalDetails.hijriDisplay
            : ""}
          <br />
          {menuModalDetails.englishDisplay !== null
            ? menuModalDetails.englishDisplay
            : ""}
        </div>
        <div style={{ fontSize: "1.3rem" }}>
          {menuModalDetails.item !== null && menuModalDetails.item.nothaali ? (
            <Alert
              type="warning"
              message={
                menuModalDetails.item.reasonNoThaali
                  ? `No Thaali (${menuModalDetails.item.reasonNoThaali})`
                  : "No Thaali"
              }
            />
          ) : (
            ""
          )}

          {menuModalDetails.item !== null &&
            !menuModalDetails.item.nothaali && (
              <Alert type="info" message={menuModalDetails.item.name} />
            )}
        </div>
      </Modal>
    </FMBCalendarWrapper>
  )
}

const FMBCalendarWrapper = styled.div`
  max-width: 1000px;
  margin: auto;

  .next-btn {
    padding-top: 0.2rem;
    padding-bottom: 2.2rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }

  .ant-badge-status {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    padding-left: 0.5rem;
    font-size: 8px;
  }
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-calendar-date {
    margin: 2px;
    padding-left: 2px;
    padding-right: 2px;
    height: 90px;
  }

  .cont {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .box1 {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0.5rem;
    left: 0;
  }

  div.box1 > button {
    padding-bottom: 2.4rem;
    padding-top: -5rem;
  }
`

export default FMBCalendar
