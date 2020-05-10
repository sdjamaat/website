import React from "react"
import { List, Card } from "antd"
import styled from "styled-components"

const data = [
  {
    title: "The Dawoodi Bohras",
    description:
      "A comprehensive website about history and culture of the Dawoodi Bohra community",
    link: "https://thedawoodibohras.com/",
  },
  {
    title: "Mumineen.org",
    description:
      "Accurate and authentic content pertaining to Dawoodi Bohra Muslims",
    link: "http://www.mumineen.org/",
  },
  {
    title: "Bohra.net",
    description:
      "Chronicle of Syedna Aali Qadr Mufaddal Saifuddin's historic visits to the North America",
    link: "http://www.bohra.net/",
  },
  {
    title: "SBMAA",
    description:
      "The Saifee Burhani Medical Association of Dawoodi Bohra physicians in America and Canada",
    link: "https://sbmedical.org/",
  },
]

const LearnMore = () => {
  return (
    <LearnMoreWrapper>
      <Card
        hoverable={true}
        title="Dawoodi Bohra Websites"
        headStyle={{
          fontSize: "1.4rem",
          textAlign: "center",
        }}
        bodyStyle={{
          padding: "1rem",
        }}
      >
        <List
          size="small"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={
                  <a href={item.link} target="_blank" className="title">
                    {item.title}
                  </a>
                }
                description={
                  <div className="description">{item.description}</div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </LearnMoreWrapper>
  )
}

const LearnMoreWrapper = styled.div`
  padding-bottom: 10px;
  .description {
    font-size: 90%;
  }

  .title {
    color: #4169e1;
  }
`

export default LearnMore
