import React from "react"
import { Card } from "antd"
import styled from "styled-components"
import MarkazMap from "./markaz-map"
import ContainerDimensions from "react-container-dimensions"
import { Row, Col } from "react-bootstrap"

const Location = () => {
  return (
    <LocationWrapper>
      <Card
        hoverable={true}
        title="Markaz Location"
        headStyle={{ fontSize: "1.4rem", textAlign: "center" }}
        bodyStyle={{ textAlign: "center" }}
      >
        <Row>
          <Col sm={12} md={8} lg={12}>
            <ContainerDimensions>
              {({ width, height }) => (
                <MarkazMap width={width} height={height} />
              )}
            </ContainerDimensions>
          </Col>

          <Col sm={12} md={4} lg={12}>
            <Card
              bordered={false}
              bodyStyle={{ fontSize: "1.2rem", marginBottom: "-23px" }}
            >
              8977 Activity Rd #101 <br /> San Diego, CA 92121
            </Card>
          </Col>
        </Row>
      </Card>
    </LocationWrapper>
  )
}

const LocationWrapper = styled.div`
  padding-bottom: 10px;
  .location-card {
    padding: -4rem;
  }

  .divider {
    @media (max-width: 990px) and (min-width: 767px) {
      height: 100%;
    }
  }
`

export default Location
