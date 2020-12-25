import React, { useState, useEffect, useContext } from "react"
import { Card, Spin, Collapse, Divider } from "antd"
import { Alert, Row, Col, Button } from "react-bootstrap"
import { LinkOutlined } from "@ant-design/icons"
import styled from "styled-components"

const QHForms = () => {
  const openForm = type => {
    if (type === "main") {
      window.open(
        "https://firebasestorage.googleapis.com/v0/b/sdj-production.appspot.com/o/QardanHasanaApplicationForm.pdf?alt=media&token=680e5b29-0972-4368-9db7-5a4d0a37874f",
        "_blank"
      )
    } else {
      window.open(
        "https://firebasestorage.googleapis.com/v0/b/sdj-production.appspot.com/o/SD_Housing_QH_PromisoryNote.pdf?alt=media&token=05198f45-f957-46a6-b908-70bdfbd3cc6d",
        "_blank"
      )
    }
  }
  return (
    <QHFormsWrapper>
      <Card
        title="Qardan Hasana Forms"
        headStyle={{ fontSize: "1.5rem", textAlign: "center" }}
        bodyStyle={{ paddingBottom: ".5rem" }}
      >
        <Alert key="1" variant="info">
          <Row>
            <Col lg={9} md={9} sm={9} xs={12}>
              Qardan Hasana Application Form
            </Col>
            <Col>
              <Button
                className="qh-form-button"
                variant="outline-info"
                onClick={() => openForm("main")}
              >
                Open
              </Button>
            </Col>
          </Row>
        </Alert>
        <Alert key="2" variant="info">
          <Row>
            <Col lg={9} md={9} sm={9} xs={12}>
              San Diego Housing Qardan Hasana Promissory Note
            </Col>
            <Col>
              <Button
                className="qh-form-button"
                variant="outline-info"
                onClick={() => openForm("housing")}
              >
                Open
              </Button>
            </Col>
          </Row>
        </Alert>
        <Alert variant="light" className="messageAlert">
          Please fill and send your application to:{" "}
          <a
            style={{ color: "#4169e1" }}
            href="mailto: sdqardan@gmail.com"
            target="__blank"
            rel="noopener noreferrer"
          >
            sdqardan@gmail.com
          </a>{" "}
          <br />
          <div style={{ paddingTop: ".3rem" }}>
            For any questions please contact:{" "}
            <a
              style={{ color: "#4169e1" }}
              href="mailto: sdqardan@gmail.com"
              target="__blank"
              rel="noopener noreferrer"
            >
              sdqardan@gmail.com
            </a>
          </div>
        </Alert>
      </Card>
    </QHFormsWrapper>
  )
}

const QHFormsWrapper = styled.div`
  max-width: 1000px;
  margin: auto;

  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
  }

  .qh-form-button {
    padding-bottom: 0.15rem;
    padding-top: 0.15rem;
    width: 100%;

    @media only screen and (max-width: 575px) {
      margin-top: 1rem;
    }
  }

  .messageAlert {
    border-left: 4px solid gray;
  }
`

export default QHForms
