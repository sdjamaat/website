import React from "react"
import Layout from "../components/layout"
import Contact from "../components/home/contact"
import WelcomeAbout from "../components/home/welcome-about"
import LearnMore from "../components/home/learn-more"
import Location from "../components/home/location"
import SalaatTimes from "../components/home/salaat-times"
import styled from "styled-components"
import { Divider } from "antd"
import { Row, Col } from "react-bootstrap"

export default () => (
  <Layout displayBanner={true}>
    <HomeWrapper>
      <WelcomeAbout />
      <Divider />
      <Row className="below-welcome-comp">
        <Col lg={4}>
          <Row>
            <Col className="location-comp">
              <Location />
            </Col>
          </Row>
          <Row>
            <Col>
              <SalaatTimes />
            </Col>
          </Row>
        </Col>

        <Col lg={4} className="location-comp">
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
  .below-welcome-comp {
    max-width: 1290px;
    margin: auto;
  }
`
