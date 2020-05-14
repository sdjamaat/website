import React from "react"
import { Table, Card, Divider } from "antd"
import styled from "styled-components"
import { committes } from "../../static/committee-info"
import Layout from "../components/layout"

const CommitteeTable = ({ name, data }) => {
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
          tableLayout="fixed"
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
    <Card
      bodyStyle={{ padding: ".5rem", textAlign: "center" }}
      style={{ marginBottom: "1rem", borderColor: "gray" }}
    >
      <h4 style={{ margin: ".1rem" }}>{text}</h4>
    </Card>
  )
}

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
          <Card
            className="title"
            bodyStyle={{ margin: "0", padding: "0" }}
            bordered={false}
          >
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

  .title {
    margin-bottom: -1rem;
    margin-top: -5%;
  }
`

export default Committees
