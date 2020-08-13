import React from "react"
import styled from "styled-components"
import MarkazMap from "./markaz-map"
import ContainerDimensions from "react-container-dimensions"
import { Card } from "antd"
import { Row, Col } from "react-bootstrap"

const ITSMessage = () => {
  return (
    <ITSMessageWrapper>
      <Card
        hoverable={true}
        title="More Information"
        headStyle={{ fontSize: "1.4rem", textAlign: "center" }}
        bodyStyle={{
          textAlign: "center",
          fontSize: "1rem",
          paddingBottom: "0",
          paddingTop: ".8rem",
        }}
      >
        <p>
          For more information on the local Dawoodi Bohra community of San
          Diego, California, please visit our website:
          <br />
          <a
            style={{ color: "#4169e1" }}
            href="https://www.usa.thedawoodibohras.com/san-diego/"
            target="__blank"
          >
            www.usa.thedawoodibohras.com/san-diego
          </a>
        </p>
        <p>
          Or email us: <br />
          <a
            style={{ color: "#4169e1" }}

            href="mailto:sandiego.ca@usa.thedawoodibohras.com"
            target="__blank"
          >
            sandiego.ca@usa.thedawoodibohras.com

          </a>
        </p>
      </Card>
    </ITSMessageWrapper>
  )
}

const ITSMessageWrapper = styled.div`
  padding-bottom: 15px;
  .location-card {
    padding: -4rem;
  }

  .divider {
    @media (max-width: 990px) and (min-width: 767px) {
      height: 100%;
    }
  }

  .address {
    color: #4169e1;
  }
`

export default ITSMessage
