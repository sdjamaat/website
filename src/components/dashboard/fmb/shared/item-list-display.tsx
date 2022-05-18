import React from "react"
import styled from "styled-components"
import { ThaaliItem } from "../../../../types/typings"
import moment from "moment"
import { Collapse } from "antd"

const { Panel } = Collapse

interface ItemListDisplayProps {
  items: ThaaliItem[]
  selections: Map<string, string>
  title: string
  submittedBy: string
}

const ItemListDisplay = (props: ItemListDisplayProps) => {
  return (
    <ItemListDisplayWrapper>
      <Collapse style={{ marginTop: ".5rem" }}>
        <Panel header={props.title} key="1">
          <div
            style={{
              textAlign: "center",
              paddingBottom: "1.3rem",
              paddingTop: ".5rem",
              fontSize: "1.2rem",
            }}
          >
            <strong>Submitted by:</strong> {props.submittedBy}
          </div>
          <div style={{ paddingLeft: ".4rem" }}>
            {props.items.map((item, index) => {
              if (!item.nothaali) {
                return (
                  <div
                    key={index}
                    style={{
                      borderLeft: "1px solid gray",
                      paddingLeft: "1rem",
                    }}
                  >
                    <div style={{ fontSize: "1.2rem", paddingBottom: ".7rem" }}>
                      {item.name}
                    </div>
                    <p
                      style={{
                        marginBottom: ".2rem",
                        marginTop: "-.5rem",
                        color: "gray",
                      }}
                    >
                      {moment(item.date, "MM-DD-YYYY").format(
                        "dddd, MMMM Do YYYY"
                      )}
                    </p>
                    <p style={{ color: "gray", paddingBottom: ".2rem" }}>
                      Size:{" "}
                      {props.selections.hasOwnProperty(item.id)
                        ? props.selections[item.id]
                        : "Not Found"}
                    </p>
                  </div>
                )
              } else {
                return null
              }
            })}
          </div>
        </Panel>
      </Collapse>
    </ItemListDisplayWrapper>
  )
}

const ItemListDisplayWrapper = styled.div`
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
  }
`

export default ItemListDisplay
