import React from "react"
import { Button, Tag } from "antd"
import moment from "moment"
import { DistributionDateMetadata, ThaaliItem } from "../../../../../types/typings"

interface ReviewSelectionsProps {
  distDateMap: Map<string, DistributionDateMetadata>
  setPanel: (panelName: "start" | "select-items" | "review") => void
  items: ThaaliItem[]
  submitSelections: any
  selections: Map<string, string>
  hasGroupedSelectionByDistDate: Boolean
}

const ReviewSelections = ({ setPanel, items, selections, distDateMap, submitSelections, hasGroupedSelectionByDistDate }: ReviewSelectionsProps) => {
  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <Tag className="float-center" color="geekblue" style={{ fontSize: "1.1rem", padding: ".3rem", marginBottom: "1.5rem" }}>
          Review Submission
        </Tag>
      </div>
      <div style={{ paddingLeft: ".4rem" }}>
        {items.map((item, index) => {
          const metadata = distDateMap.get(item.id)
          if (!metadata) return null
          const { distDate, isFirstItem } = metadata
          if (!item.nothaali) {
            return (
              <React.Fragment key={item.id}>
                {hasGroupedSelectionByDistDate && isFirstItem && (
                  <p style={{ marginBottom: ".5rem", marginTop: index > 0 ? "2.5rem" : "1rem", color: "#4169e1", fontSize: "1.25rem" }}>
                    Distribution on {moment(distDate, "MM-DD-YYYY").format("dddd, MMMM Do YYYY")}
                  </p>
                )}
                <div style={{ borderLeft: "1px solid gray", paddingLeft: "1rem" }}>
                  <div style={{ fontSize: "1.2rem", paddingBottom: ".7rem" }}>{item.name}</div>
                  {!hasGroupedSelectionByDistDate && (
                    <p style={{ marginBottom: ".2rem", marginTop: "-.5rem", color: "gray" }}>
                      {moment(item.date, "MM-DD-YYYY").format("dddd, MMMM Do YYYY")}
                    </p>
                  )}
                  <p style={{ color: "gray", paddingBottom: ".2rem" }}>
                    Size: {(selections as any).hasOwnProperty(item.id) ? (selections as any)[item.id] : "Not Found"}
                  </p>
                </div>
              </React.Fragment>
            )
          }
          return null
        })}
      </div>
      <div style={{ marginTop: "-.8rem" }}>
        <Button onClick={() => setPanel("select-items")} className="float-left next-btn">Back</Button>
        <Button type="primary" onClick={submitSelections} className="float-right next-btn">Submit</Button>
      </div>
    </div>
  )
}

export default ReviewSelections
