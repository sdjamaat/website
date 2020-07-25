import React, { useContext } from "react"
import { Link } from "gatsby"
import { Table, Card, Divider, Alert } from "antd"
import styled from "styled-components"
import { committees } from "../../static/committee-info"
import Layout from "../components/layout"
import { AuthContext } from "../provider/auth-context"

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

export default () => {
  const { isLoggedIn } = useContext(AuthContext)
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
    <Layout displayBanner={true}>
      <CommitteesWrapper>
        <div className="content">
          <Card
            className="title"
            bodyStyle={{ margin: "0", padding: "0" }}
            bordered={false}
          >
            <Divider style={{ paddingBottom: ".5rem" }}>
              <h2 style={{ marginBottom: "0" }}>Committees</h2>
            </Divider>
          </Card>
          <CommitteeTable
            name={committees[0].name}
            data={formatMembers(committees[0].members)}
          />

          {isLoggedIn ? (
            committees.map((committee, index) => {
              if (index !== 0) {
                return (
                  <CommitteeTable
                    key={index}
                    name={committee.name}
                    data={formatMembers(committee.members)}
                  />
                )
              } else {
                return null
              }
            })
          ) : (
            <Alert
              style={{ margin: ".5rem" }}
              message={
                <div style={{ textAlign: "center" }}>
                  Please{" "}
                  <Link style={{ color: "#4169e1" }} to="/login">
                    login
                  </Link>{" "}
                  to view more information
                </div>
              }
              type="info"
            />
          )}
        </div>
      </CommitteesWrapper>
    </Layout>
  )
}

const CommitteesWrapper = styled.div`
  .title {
    margin-bottom: -1rem;
    margin-top: -5%;
  }

  .content {
    max-width: 1290px;
    margin: auto;
  }
`
