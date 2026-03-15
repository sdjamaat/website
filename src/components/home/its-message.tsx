import React from "react"
import styled from "styled-components"
import { Card, Divider } from "antd"
import { GlobalOutlined, MailOutlined } from "@ant-design/icons"

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
          padding: "1.5rem 2rem",
        }}
      >
        <div className="info-section">
          <div className="info-block">
            <GlobalOutlined className="info-icon" />
            <p className="info-label">Visit our page</p>
            <p className="info-description">
              For more information on the local Dawoodi Bohra community of San
              Diego, California
            </p>
            <a
              className="info-link"
              href="https://www.usa.thedawoodibohras.com/san-diego/"
              target="__blank"
            >
              www.usa.thedawoodibohras.com/san-diego
            </a>
          </div>

          <Divider className="section-divider" />

          <div className="info-block">
            <MailOutlined className="info-icon" />
            <p className="info-label">Email us</p>
            <a
              className="info-link"
              href="mailto:sandiego.ca@usa.thedawoodibohras.com"
              target="__blank"
            >
              sandiego.ca@usa.thedawoodibohras.com
            </a>
          </div>
        </div>
      </Card>
    </ITSMessageWrapper>
  )
}

const ITSMessageWrapper = styled.div`
  height: 100%;
  padding-bottom: 15px;
  .ant-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .info-section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .info-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }
  .info-icon {
    font-size: 1.8rem;
    color: #4169e1;
    margin-bottom: 0.25rem;
  }
  .info-label {
    font-size: 1.05rem;
    font-weight: 600;
    margin: 0;
    color: #333;
  }
  .info-description {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
    line-height: 1.5;
    max-width: 340px;
  }
  .info-link {
    color: #4169e1;
    font-size: 0.95rem;
    word-break: break-all;
  }
  .section-divider {
    margin: 0.75rem 0;
  }
`

export default ITSMessage
