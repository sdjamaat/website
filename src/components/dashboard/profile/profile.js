import React, { useContext } from "react"
import { Card, Tabs, Divider, Timeline, Descriptions } from "antd"
import { Row, Col } from "react-bootstrap"
import styled from "styled-components"
import { AuthContext } from "../../../provider/auth-context"
import { HomeOutlined, UserOutlined } from "@ant-design/icons"
const { TabPane } = Tabs

const Profile = () => {
  const { currUser } = useContext(AuthContext)
  return (
    <ProfileWrapper>
      <Card
        title="Profile"
        headStyle={{ fontSize: "1.5rem", textAlign: "center" }}
      >
        <Row>
          <Col md={12} lg={12}>
            <Divider orientation="left" style={{ marginTop: "0" }}>
              Account Details
            </Divider>
            <Descriptions layout="vertical" size="small" bordered>
              <Descriptions.Item label="First name">
                {currUser.firstname}
              </Descriptions.Item>
              <Descriptions.Item label="Last name">
                {currUser.lastname}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {currUser.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {currUser.phone}
              </Descriptions.Item>
              <Descriptions.Item label="ITS #">
                {currUser.its}
              </Descriptions.Item>
              <Descriptions.Item label="Year of Birth">
                {currUser.yob}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          <Col md={12} lg={12} style={{ marginTop: ".5rem" }}>
            <Divider orientation="left">Family Details</Divider>

            <Row>
              <Col sm={12} md={4}>
                <Timeline style={{ marginTop: ".6rem", paddingLeft: ".5rem" }}>
                  <Timeline.Item
                    dot={<HomeOutlined style={{ marginBottom: ".3rem" }} />}
                  >
                    <div>
                      {currUser.family.head.firstname}{" "}
                      {currUser.family.head.lastname} (Head) <br />
                      <span style={{ color: "gray", fontSize: "1rem" }}>
                        ITS #: {currUser.family.head.its}
                      </span>{" "}
                      <br />
                      <span style={{ color: "gray", fontSize: "1rem" }}>
                        Year of Birth: {currUser.family.head.yob}
                      </span>{" "}
                    </div>
                  </Timeline.Item>
                  {currUser.family.members.map((member, index) => {
                    return (
                      <Timeline.Item
                        dot={<UserOutlined style={{ marginBottom: ".3rem" }} />}
                        key={index}
                      >
                        <div>
                          {member.firstname} {member.lastname} <br />
                          <span style={{ color: "gray", fontSize: "1rem" }}>
                            ITS #: {member.its ? member.its : "n/a"}
                          </span>{" "}
                          <br />
                          <span style={{ color: "gray", fontSize: "1rem" }}>
                            Year of Birth: {member.yob}
                          </span>{" "}
                        </div>
                      </Timeline.Item>
                    )
                  })}
                </Timeline>
              </Col>
              <Col sm={12} md={8}>
                <Descriptions layout="vertical" size="small" bordered>
                  <Descriptions.Item label="Address">
                    {currUser.family.address.street}
                  </Descriptions.Item>
                  <Descriptions.Item label="City">
                    {currUser.family.address.city}
                  </Descriptions.Item>
                  <Descriptions.Item label="Zip">
                    {currUser.family.address.zip}
                  </Descriptions.Item>
                  <Descriptions.Item label="Jamaat Registration Status">
                    {currUser.family.registrationStatus}
                  </Descriptions.Item>
                  <Descriptions.Item label="Family Size">
                    {currUser.family.size}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </ProfileWrapper>
  )
}

const ProfileWrapper = styled.div`
  max-width: 1000px;
  margin: auto;

  .ant-divider-horizontal.ant-divider-with-text-left::before {
    width: 0%;
  }

  .ant-divider-horizontal.ant-divider-with-text-left::after {
    width: 100%;
  }

  .ant-divider-inner-text {
    padding-left: 0.2rem;
  }
  .next-btn {
    padding-top: 0.2rem;
    padding-bottom: 2.2rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`

export default Profile
