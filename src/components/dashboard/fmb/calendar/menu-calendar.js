import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import { Badge, Modal, Alert } from "antd"
import { monthIndexToName } from "../../../../functions/calendar"
import HijriMonth from "../../../hijri-calendar/hijri-month"
import { DateContext } from "../../../../provider/date-context"
import firebase from "gatsby-plugin-firebase"

const FMBCalendar = () => {
  const [menu, setMenu] = useState([])
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

      setMenu(menuDetails.data())
    } catch (error) {
      setMenu([])
      console.log(error)
    }
  }

  useEffect(() => {
    getFirebaseData()
  }, [])

  const getMatchingItemForDate = dateValue => {
    let matchingItem = null
    if (menu && menu !== null && menu.length !== 0) {
      let getMatchingItemArr = menu.items.filter(
        x => x.date === dateValue.format("MM-DD-YYYY")
      )

      if (getMatchingItemArr.length > 0) {
        matchingItem = getMatchingItemArr[0]
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
      <div style={{ fontSize: "1.5rem", textAlign: "center" }}>
        Faiz-ul-Mawaid al-Burhaniyah Calendar
      </div>
      {menu === [] ? (
        <div>Loading...</div>
      ) : (
        <HijriMonth
          monthIndex={getHijriDate().month}
          onClickHandler={openMenuDetailsModal}
          dateBoxContent={getDateBoxContent}
        />
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
`

export default FMBCalendar
