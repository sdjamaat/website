import React from "react"
import { Divider } from "antd"
import { Row, Col } from "react-bootstrap"
import styled from "styled-components"
import Contact from "../components/home/contact"
import WelcomeAbout from "../components/home/welcome-about"
import ITSMessage from "../components/home/its-message"
import Layout from "../components/other/layout"

const Home = () => (
  <Layout displayBanner={true}>
    <HomeWrapper>
      <WelcomeAbout />

      <Row className="content">
        <Divider />
        <Col>
          <Row>
            <Col>
              <ITSMessage />
            </Col>
          </Row>
          <Row>
            <Col>
              <Contact />
            </Col>
          </Row>
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

export default Home
