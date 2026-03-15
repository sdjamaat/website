import React from "react"
import styled from "styled-components"
import { Card } from "antd"
import { GlobalOutlined, MailOutlined } from "@ant-design/icons"
import communityImg from "../../images/community.avif"

const ITSMessage = () => {
  return (
    <ITSMessageWrapper>
      <Card
        hoverable={true}
        title="More Information"
        headStyle={{ fontSize: "1.4rem", textAlign: "center" }}
        bodyStyle={{ padding: "0" }}
      >
        <a
          className="info-block"
          href="https://www.usa.thedawoodibohras.com/san-diego/"
          target="__blank"
        >
          <div className="icon-circle">
            <GlobalOutlined />
          </div>
          <div className="info-text">
            <h5>Visit our page</h5>
            <p>
              Learn more about the local Dawoodi Bohra community of San Diego,
              California
            </p>
          </div>
        </a>

        <a
          className="info-block"
          href="mailto:sandiego.ca@usa.thedawoodibohras.com"
          target="__blank"
        >
          <div className="icon-circle">
            <MailOutlined />
          </div>
          <div className="info-text">
            <h5>Email us</h5>
            <p>sandiego.ca@usa.thedawoodibohras.com</p>
          </div>
        </a>

        <div className="community-img-container">
          <img src={communityImg} alt="San Diego Dawoodi Bohra Community" />
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
    overflow: hidden;
  }

  .info-block {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.25rem 1.5rem;
    text-decoration: none;
    color: inherit;
    transition: background-color 0.2s;
    border-bottom: 1px solid #f0f0f0;

    &:hover {
      background-color: #f8f9ff;
    }
  }

  .icon-circle {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #eef1ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: #4169e1;
  }

  .info-text {
    h5 {
      margin: 0 0 0.2rem 0;
      font-size: 1.05rem;
      font-weight: 600;
      color: #222;
    }

    p {
      margin: 0;
      font-size: 0.95rem;
      color: #555;
      line-height: 1.45;
    }
  }

  .community-img-container {
    flex: 1;
    min-height: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
`

export default ITSMessage
