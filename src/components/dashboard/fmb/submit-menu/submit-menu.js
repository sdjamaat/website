import React, { useState, useEffect, useContext } from "react"
import { Card, Alert, Spin, Collapse, Divider } from "antd"
import { DateContext } from "../../../../provider/date-context"
import { AuthContext } from "../../../../provider/auth-context"
import CustomMessage from "../../../custom-message"
import firebase from "gatsby-plugin-firebase"
import styled from "styled-components"
import StartPanel from "./collect-item-info/start-panel"
import ReviewSelections from "./collect-item-info/review-selections"
import SelectItems from "./collect-item-info/select-items"
import moment from "moment"

const { Panel } = Collapse

const SubmitFMBMenu = () => {
  const { getHijriDate } = useContext(DateContext)
  const { currUser } = useContext(AuthContext)
  const [activeMenu, setActiveMenu] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selections, setSelections] = useState({
    "select-toggle": "individual",
  })

  const [panel, setPanel] = useState("start")
  const [refreshComponent, setRefreshComponent] = useState(false)
  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false)
  const [alreadySubmittedItemsDoc, setAlreadySubmittedItemsDoc] = useState({})

  const submitSelections = async () => {
    setIsSubmitting(true)
    try {
      const monthMenuQuery = firebase
        .firestore()
        .collection("fmb")
        .doc(getHijriDate().year.toString())
        .collection("menus")
        .doc(activeMenu.shortMonthName)

      // set selections inside submissions collection
      await monthMenuQuery
        .collection("submissions")
        .doc(currUser.familyid)
        .set({
          selections: selections.items,
          submittedBy: {
            firstname: currUser.firstname,
            lastname: currUser.lastname,
            uid: currUser.uid,
          },
          code: currUser.family.fmb.code,
          familyDisplayName: currUser.family.displayname,
        })

      // put family id in submissions array to track already submitted values
      await monthMenuQuery.update({
        submissions: firebase.firestore.FieldValue.arrayUnion(
          currUser.familyid
        ),
      })

      CustomMessage("success", "Successfully submitted thaali preferences!")
      setRefreshComponent(!refreshComponent)
      setIsSubmitting(false)
      setPanel("start")
    } catch (error) {
      setIsSubmitting(false)
      CustomMessage("error", "Could not submit thaali preferences")
      console.log(error)
    }
  }

  const getCurrPage = page => {
    switch (page) {
      case "start":
        return (
          <StartPanel
            setPanel={setPanel}
            hijriMonth={activeMenu.displayMonthName}
            hijriYear={activeMenu.displayYear}
            disabled={hasAlreadySubmitted}
          />
        )
      case "select-items":
        return (
          <SelectItems
            setPanel={setPanel}
            items={activeMenu.items}
            values={selections}
            setValues={setSelections}
          />
        )
      case "review":
        return (
          <ReviewSelections
            setPanel={setPanel}
            items={activeMenu.items}
            selections={selections.items}
            submitSelections={submitSelections}
          />
        )
      default:
        return <div>no panel found</div>
    }
  }

  useEffect(() => {
    const fmbYearQuery = firebase
      .firestore()
      .collection("fmb")
      .doc(getHijriDate().year.toString())

    fmbYearQuery.onSnapshot(doc => {
      if (doc.exists) {
        let activeMenuMonth = doc.data().activeMenu
        let isUsingLastActiveMenu = false
        if (!activeMenuMonth) {
          activeMenuMonth = doc.data().lastActiveMenu
          isUsingLastActiveMenu = true
        }
        if (activeMenuMonth !== null) {
          fmbYearQuery
            .collection("menus")
            .doc(activeMenuMonth)
            .onSnapshot(async doc => {
              const activeMenu = doc.data()
              const completedSubmissions = activeMenu.submissions

              // check if user has already submitted current menu
              if (completedSubmissions.includes(currUser.familyid)) {
                const alreadySubmittedItemsDoc = await fmbYearQuery
                  .collection("menus")
                  .doc(activeMenuMonth)
                  .collection("submissions")
                  .doc(currUser.familyid)
                  .get()
                setAlreadySubmittedItemsDoc(alreadySubmittedItemsDoc.data())
                setHasAlreadySubmitted(true)
              }
              // only set active menu if the user has already submitted something or the we're not using the LAST active menu
              // don't want to let users who have not submitted anything see anything when we're using the last active menu
              // setting an active menu means 1) if no submissions than you can submit 2) if submissions you can see your submissions
              if (hasAlreadySubmitted || !isUsingLastActiveMenu) {
                setActiveMenu({
                  ...activeMenu,
                  shortMonthName: activeMenuMonth,
                })
              }
            })
        } else {
          setActiveMenu(-1)
        }
      } else {
        setActiveMenu(-1)
      }
    })
  }, [])

  return (
    <SubmitFMBMenuWrapper>
      <Card
        title="Submit Thaali Choices"
        headStyle={{ fontSize: "1.5rem", textAlign: "center" }}
      >
        {hasAlreadySubmitted && activeMenu !== null && activeMenu !== -1 && (
          <>
            <Alert
              style={{ marginBottom: "1rem" }}
              type="success"
              message="Your family's thaali preferences have been recorded"
            />
            <Collapse style={{ marginTop: "-.5rem" }}>
              <Panel header="Selections" key="1">
                <div
                  style={{
                    textAlign: "center",
                    paddingBottom: "1.3rem",
                    paddingTop: ".5rem",
                    fontSize: "1.2rem",
                  }}
                >
                  <strong>Submitted by:</strong>{" "}
                  {alreadySubmittedItemsDoc.submittedBy.firstname}{" "}
                  {alreadySubmittedItemsDoc.submittedBy.lastname}{" "}
                </div>
                <div style={{ paddingLeft: ".4rem" }}>
                  {activeMenu.items.map((item, index) => {
                    if (!item.nothaali) {
                      return (
                        <div
                          key={index}
                          style={{
                            borderLeft: "1px solid gray",
                            paddingLeft: "1rem",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "1.2rem",
                              paddingBottom: ".7rem",
                            }}
                          >
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
                          <p
                            style={{
                              color: "gray",
                              paddingBottom: ".2rem",
                            }}
                          >
                            Size:{" "}
                            {alreadySubmittedItemsDoc.selections.hasOwnProperty(
                              item.id
                            )
                              ? alreadySubmittedItemsDoc.selections[item.id]
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
            <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          </>
        )}
        <div>
          {activeMenu === null ? (
            <div>Loading...</div>
          ) : activeMenu === -1 ? (
            <Alert
              type="warning"
              message="There are no menus open for submission"
            />
          ) : (
            <Spin spinning={isSubmitting}>{getCurrPage(panel)}</Spin>
          )}
        </div>
      </Card>
    </SubmitFMBMenuWrapper>
  )
}

const SubmitFMBMenuWrapper = styled.div`
  max-width: 1000px;
  margin: auto;

  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
  }

  .next-btn {
    padding-top: 0.2rem;
    padding-bottom: 2.2rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`

export default SubmitFMBMenu
