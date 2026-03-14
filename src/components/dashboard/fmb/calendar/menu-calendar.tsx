import React, { useState, useEffect, useContext, useCallback } from "react"
import styled from "styled-components"
import { Badge, Modal, Alert, Button } from "antd"
import { monthIndexToName } from "../../../../functions/calendar"
import HijriMonth from "../../../hijri-calendar/hijri-month"
import { DateContext } from "../../../../provider/date-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../../../lib/firebase"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"

const FMBCalendar = () => {
  const { getHijriDate } = useContext(DateContext)
  const [displayMonthIndex, setDisplayMonthIndex] = useState(getHijriDate().month)
  const [menuCache, setMenuCache] = useState<Record<number, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [menuModalDetails, setMenuModalDetails] = useState<any>({
    open: false,
    item: [],
    dateObj: null,
  })

  const fetchMenuForMonth = useCallback(async (monthIndex: number) => {
    if (menuCache[monthIndex] !== undefined) return
    try {
      const monthName = monthIndexToName(monthIndex).short
      const menuDoc = await getDoc(
        doc(db, "fmb", getHijriDate().databaseYear.toString(), "menus", monthName)
      )
      setMenuCache((prev) => ({
        ...prev,
        [monthIndex]: menuDoc.exists() ? menuDoc.data() : null,
      }))
    } catch (error) {
      console.log(error)
      setMenuCache((prev) => ({ ...prev, [monthIndex]: null }))
    }
  }, [menuCache, getHijriDate])

  useEffect(() => {
    fetchMenuForMonth(displayMonthIndex).then(() => setIsLoading(false))
  }, [displayMonthIndex])

  const currentMenu = menuCache[displayMonthIndex] || null

  const goToPrevMonth = () => {
    if (displayMonthIndex > 0) {
      setDisplayMonthIndex(displayMonthIndex - 1)
    }
  }

  const goToNextMonth = () => {
    if (displayMonthIndex < 11) {
      setDisplayMonthIndex(displayMonthIndex + 1)
    }
  }

  const getMatchingItemForDate = (dateValue: any) => {
    if (currentMenu && currentMenu !== null) {
      const getMatchingItemArr = currentMenu.items.filter(
        (x: any) => x.date === dateValue.format("MM-DD-YYYY")
      )
      if (getMatchingItemArr.length > 0) {
        return getMatchingItemArr[0]
      }
    }
    return null
  }

  const openMenuDetailsModal = (dateValue: any) => {
    const englishDisplay = dateValue.format("dddd, MMMM Do YYYY")
    const hijriDisplay = dateValue.iDate() + " " + monthIndexToName(displayMonthIndex).long
    const matchingItem = getMatchingItemForDate(dateValue)
    setMenuModalDetails({
      ...menuModalDetails,
      englishDisplay,
      hijriDisplay,
      item: matchingItem ? { ...matchingItem } : null,
      open: true,
    })
  }

  const closeMenuDetailsModal = () => {
    setMenuModalDetails({ ...menuModalDetails, open: false })
  }

  const getDateBoxContent = (dateValue: any) => {
    const matchingItem = getMatchingItemForDate(dateValue)
    if (matchingItem === null) return null
    if (matchingItem.nothaali) {
      return (
        <Badge
          status="warning"
          text={matchingItem.reasonNoThaali ? `No Thaali (${matchingItem.reasonNoThaali})` : "No Thaali"}
        />
      )
    }
    return <Badge color="blue" text={matchingItem.name} />
  }

  return (
    <FMBCalendarWrapper>
      <div style={{ fontSize: "1.5rem", textAlign: "center" }}>
        Faiz-ul-Mawaid il-Burhaniyah Calendar
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="cont">
          <div className="box1">
            <Button
              onClick={goToPrevMonth}
              icon={<LeftOutlined />}
              disabled={displayMonthIndex <= 0}
            />
            <Button
              onClick={goToNextMonth}
              icon={<RightOutlined />}
              disabled={displayMonthIndex >= 11}
            />
          </div>
          <div className="box2">
            <HijriMonth
              monthIndex={displayMonthIndex}
              onClickHandler={openMenuDetailsModal}
              dateBoxContent={getDateBoxContent}
            />
          </div>
        </div>
      )}
      <Modal
        title="Menu Item"
        open={menuModalDetails.open}
        footer={null}
        onCancel={closeMenuDetailsModal}
      >
        <div style={{ color: "gray", paddingBottom: "1rem" }}>
          {menuModalDetails.hijriDisplay || ""}
          <br />
          {menuModalDetails.englishDisplay || ""}
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
          ) : null}
          {menuModalDetails.item !== null && !menuModalDetails.item.nothaali && (
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
    height: 2.8rem;
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
    display: flex;
    justify-content: space-between;
  }
  div.box1 > button {
    height: 2.8rem;
  }
`

export default FMBCalendar
