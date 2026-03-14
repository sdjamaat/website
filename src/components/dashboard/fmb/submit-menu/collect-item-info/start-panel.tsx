import React from "react"
import { Button, Card } from "antd"
import { Row, Col } from "react-bootstrap"

const StartPanel = ({ setPanel, hijriMonth, hijriYear, disabled }: any) => {
  return (
    <div>
      <Card bodyStyle={{ padding: "1rem" }}>
        <div style={disabled ? { pointerEvents: "none", opacity: 0.5 } : {}}>
          <Row>
            <Col sm={12} md={9}>
              <div style={{ fontSize: "1.3rem" }}>{hijriMonth}</div>
              <p style={{ marginBottom: ".3rem", color: "gray" }}>{hijriYear}</p>
            </Col>
            <Col sm={12} md={3}>
              <Button
                style={{ marginTop: ".7rem" }}
                onClick={() => setPanel("select-items")}
                className="btn-block next-btn"
                type="primary"
              >
                Start
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  )
}

export default StartPanel
