import React, { useContext } from "react"
import { Form, Button, Tag, Card } from "antd"
import { Row, Col } from "react-bootstrap"
import { Disable } from "react-disable"

const StartPanel = ({ setPanel, hijriMonth, hijriYear, disabled }) => {
  return (
    <div>
      <Card bodyStyle={{ padding: "1rem" }}>
        <Disable disabled={disabled}>
          <Row>
            <Col sm={12} md={9}>
              <div style={{ fontSize: "1.3rem" }}>{hijriMonth}</div>
              <p style={{ marginBottom: ".3rem", color: "gray" }}>
                {hijriYear}
              </p>
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
        </Disable>
      </Card>
    </div>
  )
}

export default StartPanel
