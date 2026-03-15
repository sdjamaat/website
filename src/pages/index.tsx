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
        <Divider style={{ marginTop: "1.5rem" }} />
        <Col lg={6}>
          <ITSMessage />
        </Col>
        <Col lg={6}>
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

export default Home
