import React from "react"
import { Divider } from "antd"
import { Row, Col } from "react-bootstrap"
import styled from "styled-components"
import Contact from "../components/home/contact"
import WelcomeAbout from "../components/home/welcome-about"
import LearnMore from "../components/home/learn-more"
import Location from "../components/home/location"
import SalaatTimes from "../components/home/salaat-times"
import ITSMessage from "../components/home/its-message"
import Layout from "../components/layout"

export default () => (
  <Layout displayBanner={true}>
    <HomeWrapper>
      <WelcomeAbout />

      <Row className="content">
        <Divider />
        <Col lg={4}>
          <Row>
            <Col>
              <ITSMessage />
            </Col>
          </Row>
          <Row>
            <Col>
              <Location />
            </Col>
          </Row>
        </Col>

        <Col lg={4}>
          <LearnMore />
        </Col>

        <Col lg={4}>
          <Contact />
        </Col>
      </Row>
    </HomeWrapper>
  </Layout>
)

const HomeWrapper = styled.div`
  .content {
    max-width: 1290px;
    margin: auto;
  }
`
