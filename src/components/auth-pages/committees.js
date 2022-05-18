import React, { useContext } from "react"
import { Link, navigate } from "gatsby"
import { Table, Card, Divider, Alert } from "antd"
import styled from "styled-components"
import { committees } from "../../../static/committee-info"
import { graphql, useStaticQuery } from "gatsby"
import { AuthContext } from "../../provider/auth-context"
import useComponentWillMount from "../../custom-hooks/component-will-mount"
import Img from "gatsby-image"

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
  const { isLoggedIn } = useContext(AuthContext)
  useComponentWillMount(() => {
    if (!isLoggedIn) {
      navigate("/login")
    }
  })
  const formatMembers = members => {
    let newArray = []
    for (let i = 0; i < members.length; i++) {
      if (members[i].visible !== false) {
        let memberObj = {
          key: i,
          name: members[i].name,
          role: members[i].role,
        }

        newArray.push(memberObj)
      }
    }
    return newArray
  }
  const images = useStaticQuery(graphql`
    query {
      banner: file(relativePath: { eq: "moula.png" }) {
        childImageSharp {
          fluid(maxWidth: 1000) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)
  return (
    <CommitteesWrapper>
      <Img
        fluid={images.banner.childImageSharp.fluid}
        alt="Moula picture"
        className="moula-img"
      />
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

        {isLoggedIn ? (
          committees.map((committee, index) => {
            return (
              <CommitteeTable
                key={index}
                name={committee.name}
                data={formatMembers(committee.members)}
              />
            )
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
  .moula-img {
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    max-width: 1600px;
    margin: auto;
  }
`

export default Committees
