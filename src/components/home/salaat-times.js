import React, { useState, useEffect } from "react"
import { Card, Table } from "antd"
import moment from "moment"
import styled from "styled-components"

const TimesTable = ({ times }) => {
  const columns = [
    {
      title: "Salaat",
      dataIndex: "name",
      render: text => <strong>{text}</strong>,
    },
    {
      title: "Time",
      dataIndex: "time",
    },
  ]

  const convertTime = time => {
    return moment(time, "HH:mm")
      .format("LT")
      .replace("AM", "am")
      .replace("PM", "pm")
  }

  const data = [
    {
      key: "1",
      name: "Fajr End | Sunrise",
      time: convertTime(times.Sunrise),
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
      size="small"
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
  }, [])
  return (
    <SalaatWrapper>
      <Card
        hoverable={true}
        title="San Diego Salaat Times"
        headStyle={{ fontSize: "1.4rem", textAlign: "center" }}
      >
        {times && <TimesTable times={times} />}
      </Card>
    </SalaatWrapper>
  )
}

const SalaatWrapper = styled.div`
  padding-bottom: 15px;
`

export default SalaatTimes
