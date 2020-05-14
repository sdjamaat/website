import React from "react"
import { Container, Row, Col } from "react-bootstrap"
import { Card } from "antd"
import styled from "styled-components"
import Img from "gatsby-image"
import { graphql, useStaticQuery } from "gatsby"

const WelcomeAbout = () => {
  const images = useStaticQuery(graphql`
    query {
      logo: file(relativePath: { eq: "logo_full_black.png" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)
  return (
    <WelcomeAboutWrapper>
      <Container fluid className="box">
        <Row className="welcome-and-about-us">
          <Col lg={6} className="logo-and-welcome-col">
            <div className="welcome-card">
              <Row>
                <Col xs={3} className="logo-img-container">
                  <Img
                    fluid={images.logo.childImageSharp.fluid}
                    className="logo-img"
                  />
                </Col>
                <Col xs={9} className="welcome-text-col">
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
            <Card
              title="About"
              bordered={false}
              className="about-us"
              headStyle={{
                fontSize: "1.4rem",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              <h6>
                We are members of the Dawoodi Bohra community and adhere to the
                Shia Fatimi tradition of Islam, headed by the 53rd Dai
                Al-Mutlaq, Syedna Aali Qadr Mufaddal Saifuddin (TUS).
                Anjuman-e-Mohammedi is a non-profit organization administering
                and managing the affairs of the local Dawoodi Bohra community in
                San Diego, CA.
              </h6>
            </Card>
          </Col>
        </Row>
      </Container>
    </WelcomeAboutWrapper>
  )
}

const WelcomeAboutWrapper = styled.div`
  .welcome-and-about-us {
    @media only screen and (min-width: 1020px) {
      max-width: 1400px;
      margin: auto;
    }
  }
  .about-us {
    border-radius: 5px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 8px 0 rgba(0, 0, 0, 0.19);
    h6 {
      line-height: 120%;
    }
  }

  .header-card {
    margin-bottom: 0.5rem;
  }

  .logo-and-welcome-col {
    @media only screen and (max-width: 990px) {
      margin-bottom: 3%;
    }
  }

  .welcome-card {
    height: 100%;
    @media only screen and (min-width: 990px) {
      padding-top: 10%;
    }

    @media only screen and (min-width: 1089px) {
      padding-top: 4%;
    }
  }

  .box {
    margin-top: -4.5%;
  }

  .welcome-text {
    @media only screen and (max-width: 1218px) {
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

    @media only screen and (max-width: 1088px) {
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
    @media only screen and (min-width: 990px) {
      max-width: 123px;
    }
    max-width: 150px;
    min-width: 70px;
    @media only screen and (max-width: 380px) {
      min-width: 60px;
    }
    margin: auto;
    display: block;
  }
`

export default WelcomeAbout
