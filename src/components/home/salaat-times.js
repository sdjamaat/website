import React, { useState, useEffect } from "react"
import { Card, Table } from "antd"
import styled from "styled-components"

const TimesTable = ({ times }) => {
  const columns = [
    {
      title: "Salaat",
      dataIndex: "name",
    },
    {
      title: "Time",
      dataIndex: "time",
    },
  ]

  const convertTime = time => {
    let timeArr = time.split(":")
    let hours = Number(timeArr[0])
    let mins = Number(timeArr[1].split(" ")[0])
    let hoursNew = ((hours + 11) % 12) + 1
    let amOrpm = "am"
    if (hours >= 12) amOrpm = "pm"
    return `${hoursNew}:${mins} ${amOrpm}`
  }

  const data = [
    {
      key: "1",
      name: "Fajar",
      time: convertTime(times.Fajr),
    },
    {
      key: "2",
      name: "Zawaal",
      time: convertTime(times.Dhuhr),
    },
    {
      key: "3",
      name: "Magrib",
      time: convertTime(times.Maghrib),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      bordered
      pagination={false}
      showHeader={false}
    />
  )
}

const SalaatTimes = () => {
  const [times, setTimes] = useState(null)

  const getTimes = async () => {
    const url = `https://api.aladhan.com/v1/calendar?latitude=32.895920&longitude=-117.132462&method=2`
    const currentDay = new Date().getDate()
    const req = await fetch(url)
    const { data } = await req.json()
    setTimes({ ...data[currentDay - 1].timings })
  }
  useEffect(() => {
    getTimes()
    console.log(times)
  }, [])
  return (
    <SalaatWrapper>
      <Card
        hoverable={true}
        title="Local Salaat Times"
        headStyle={{ fontSize: "1.4rem", textAlign: "center" }}
      >
        {times && <TimesTable times={times} />}
      </Card>
    </SalaatWrapper>
  )
}

const SalaatWrapper = styled.div`
  padding-bottom: 10px;
`

export default SalaatTimes
