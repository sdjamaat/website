import React from "react"
import { Form, Button, Tag } from "antd"
import { onFinishFailed } from "../../../../../functions/calendar"
const moment = require("moment")

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const ReviewSelections = ({
  setPanel,
  items,
  selections,
  submitSelections,
}) => {
  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <Tag
          className="float-center"
          color="geekblue"
          style={{
            fontSize: "1.1rem",
            padding: ".3rem",
            marginBottom: "1.5rem",
          }}
        >
          Review Submission
        </Tag>
      </div>
      <div style={{ paddingLeft: ".4rem" }}>
        {items.map((item, index) => {
          if (!item.nothaali) {
            return (
              <div
                key={index}
                style={{ borderLeft: "1px solid gray", paddingLeft: "1rem" }}
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
                  {moment(item.date, "MM-DD-YYYY").format("dddd, MMMM Do YYYY")}
                </p>
                <p style={{ color: "gray", paddingBottom: ".2rem" }}>
                  Size:{" "}
                  {selections.hasOwnProperty(item.id)
                    ? selections[item.id]
                    : "Not Found"}
                </p>
              </div>
            )
          } else {
            return null
          }
        })}
      </div>

      <div style={{ marginTop: "-.8rem" }}>
        <Button
          onClick={() => setPanel("select-items")}
          className="float-left next-btn"
        >
          Back
        </Button>
        <Button
          type="primary"
          onClick={submitSelections}
          className="float-right next-btn"
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default ReviewSelections
