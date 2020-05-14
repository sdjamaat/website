import React, { useState, useEffect } from "react"
import { Table, Card, Divider } from "antd"
import Layout from "../components/layout"
import styled from "styled-components"
import { committes } from "../../static/committee-info"

const CommitteeTable = ({ name, data }) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)
    const resizeListener = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize", resizeListener)

    return () => {
      window.removeEventListener("resize", resizeListener)
    }
  }, [])

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: text => <strong>{text}</strong>,
      colSpan: 1,
    },
    {
      title: "Role",
      dataIndex: "role",
      colSpan: 1,
    },
  ]

  return (
    <div style={{ marginBottom: "-1.0rem" }}>
      <Card
        bordered={false}
        bodyStyle={{
          paddingRight: ".5rem",
          paddingLeft: ".5rem",
        }}
      >
        <CommitteeTitle text={name} header={false} />
        <Table
          tableLayout={width >= 990 ? "fixed" : "auto"}
          size="small"
          columns={columns}
          dataSource={data}
          bordered
          pagination={false}
        />
      </Card>
    </div>
  )
}

const CommitteeTitle = ({ text }) => {
  return (
    <TitleWrapper>
      <Card
        bodyStyle={{ padding: ".5rem", textAlign: "center" }}
        className="site-page-header"
      >
        <h4 style={{ margin: ".1rem" }}>{text}</h4>
      </Card>
    </TitleWrapper>
  )
}

const TitleWrapper = styled.div`
  .site-page-header {
    margin-bottom: 1rem;
    border-color: gray;
  }
`

const Committees = () => {
  const formatMembers = members => {
    let newArray = []
    for (let i = 0; i < members.length; i++) {
      let memberObj = {
        key: i,
        ...members[i],
      }
      newArray.push(memberObj)
    }
    return newArray
  }
  return (
    <CommitteesWrapper>
      <Layout displayBanner={true}>
        <div className="content">
          <Card className="title" bodyStyle={{ padding: "0" }} bordered={false}>
            <Divider>
              <h2>Committees</h2>
            </Divider>
          </Card>

          {committes.map((committee, index) => {
            return (
              <CommitteeTable
                key={index}
                name={committee.name}
                data={formatMembers(committee.members)}
              />
            )
          })}
        </div>
      </Layout>
    </CommitteesWrapper>
  )
}

const CommitteesWrapper = styled.div`
  .content {
    max-width: 1290px;
    margin: auto;
  }
  .moula-img {
    border-radius: 8px;
    margin-bottom: -4%;
  }

  .title {
    margin-bottom: -2rem;
    margin-top: 0rem;
  }
`

export default Committees
