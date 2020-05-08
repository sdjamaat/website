import React from "react"
import Layout from "../components/layout"
import Contact from "../components/home/contact"
import Img from "gatsby-image"
import styled from "styled-components"
import { graphql } from "gatsby"
import { Card, Divider } from "antd"
import { Container, Row, Col } from "react-bootstrap"

export default ({ data }) => (
  <Layout>
    <HomeWrapper>
      <Img
        fluid={data.banner.childImageSharp.fluid}
        alt="Moula Image"
        className="moula-img"
      />
      <Container fluid className="box">
        <Row>
          <Col lg={6} className="logo-and-welcome-col">
            <div className="welcome-card">
              <Row>
                <Col xs={3} className="logo-img-container">
                  <Img
                    fluid={data.logo.childImageSharp.fluid}
                    className="logo-img"
                  />
                </Col>
                <Col xs={9}>
                  <div className="welcome-text">
                    <h4 className="welcome-to-text">Welcome to</h4>
                    <h1>
                      Anjuman-e-Mohammedi <br /> San Diego
                    </h1>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col lg={6}>
            <Card title="About Us" bordered={false} className="about-us">
              <h6>
                We are the members of Dawoodi Bohra Community - Fatimid Shia
                followers of His Holiness Syedna Aali Qadr Muffaddal Saifuddin
                (TUS) residing in Southern California. We are a non-profit
                organization administering and managing the affairs of the
                Dawoodi Bohra community in San Diego, CA.
              </h6>
            </Card>
          </Col>
        </Row>
      </Container>
      <Divider />

      <Card title="Contact Us" className="contact-us">
        <Contact />
      </Card>
    </HomeWrapper>
  </Layout>
)

const HomeWrapper = styled.div`
  .about-us {
    border-radius: 5px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 8px 0 rgba(0, 0, 0, 0.19);
  }

  .contact-us {
    margin-top: 0.5rem;
  }

  .moula-img {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .header-card {
    margin-bottom: 0.5rem;
  }

  .welcome-card {
    height: 100%;
    padding-top: 4%;
    padding-left: 4%;
  }

  .box {
    margin-top: -4.5%;
  }

  .welcome-text {
    @media only screen and (max-width: 1187px) {
      h1 {
        font-size: 2.2rem;
      }
      h4 {
        font-size: 1.5rem;
      }
    }

    @media only screen and (max-width: 1144px) {
      h1 {
        font-size: 2.2rem;
      }
      h4 {
        font-size: 1.6rem;
      }
    }

    @media only screen and (max-width: 1063px) {
      h1 {
        font-size: 2rem;
      }
      h4 {
        font-size: 1.3rem;
      }
    }

    @media only screen and (max-width: 1020px) {
      h1 {
        font-size: 1.8rem;
      }
      h4 {
        font-size: 1.2rem;
      }
    }
    @media only screen and (max-width: 991px) {
      h1 {
        font-size: 3rem;
      }
      h4 {
        font-size: 2rem;
      }
    }

    @media only screen and (max-width: 720px) {
      h1 {
        font-size: 2.5rem;
      }
      h4 {
        font-size: 1.8rem;
      }
    }

    @media only screen and (max-width: 610px) {
      h1 {
        font-size: 2rem;
      }
      h4 {
        font-size: 1.5rem;
      }
    }

    @media only screen and (max-width: 510px) {
      h1 {
        font-size: 1.7rem;
      }
      h4 {
        font-size: 1.2rem;
      }
    }

    @media only screen and (max-width: 460px) {
      h1 {
        font-size: 1.5rem;
      }
      h4 {
        font-size: 1.1rem;
      }
    }

    @media only screen and (max-width: 400px) {
      h1 {
        font-size: 1.3rem;
      }
      h4 {
        font-size: 1rem;
      }
    }

    @media only screen and (max-width: 340px) {
      h1 {
        font-size: 1.1rem;
      }
      h4 {
        font-size: 0.8rem;
      }
    }
  }

  .welcome-to-text {
    color: gray;
  }

  .logo-img {
    max-width: 150px;
    min-width: 70px;
    @media only screen and (max-width: 380px) {
      min-width: 60px;
    }
    margin: auto;
    display: block;
  }

  .logo-and-welcome-col {
    @media only screen and (max-width: 990px) {
      margin-bottom: 3%;
    }
  }
`

export const query = graphql`
  query Images {
    banner: file(relativePath: { eq: "moula_6.png" }) {
      childImageSharp {
        fluid(maxWidth: 1000) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    logo: file(relativePath: { eq: "logo_black.png" }) {
      childImageSharp {
        fluid(maxWidth: 300) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    quote: file(relativePath: { eq: "quote.png" }) {
      childImageSharp {
        fluid(maxWidth: 300) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
