import React, { useState, useEffect, useContext } from "react"
import { Card, Alert } from "antd"
import { DateContext } from "../../../../provider/date-context"
import { AuthContext } from "../../../../provider/auth-context"
import CustomMessage from "../../../custom-message"
import firebase from "gatsby-plugin-firebase"
import styled from "styled-components"
import StartPanel from "./collect-item-info/start-panel"
import ReviewSelections from "./collect-item-info/review-selections"
import SelectItems from "./collect-item-info/select-items"

const SubmitFMBMenu = () => {
  const { getHijriDate } = useContext(DateContext)
  const { currUser } = useContext(AuthContext)
  const [activeMenu, setActiveMenu] = useState(null)
  const [selections, setSelections] = useState({
    "select-toggle": "individual",
  })

  const [panel, setPanel] = useState("start")
  const [refreshComponent, setRefreshComponent] = useState(false)
  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false)

  const submitSelections = async () => {
    try {
      const monthMenuQuery = firebase
        .firestore()
        .collection("fmb")
        .doc(getHijriDate().databaseYear.toString())
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
      setPanel("start")
    } catch (error) {
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
      const activeMenuMonth = doc.data().activeMenu
      if (activeMenuMonth !== null) {
        fmbYearQuery
          .collection("menus")
          .doc(activeMenuMonth)
          .onSnapshot(doc => {
            const activeMenu = doc.data()
            const completedSubmissions = activeMenu.submissions

            // check if user has already submitted current menu
            if (completedSubmissions.includes(currUser.familyid)) {
              setHasAlreadySubmitted(true)
            }
            setActiveMenu({ ...activeMenu, shortMonthName: activeMenuMonth })
          })
      } else {
        setActiveMenu([])
      }
    })
  }, [])

  return (
    <SubmitFMBMenuWrapper>
      <Card
        title="Submit Thaali Choices"
        headStyle={{ fontSize: "1.5rem", textAlign: "center" }}
      >
        {hasAlreadySubmitted && (
          <Alert
            style={{ marginBottom: "1rem" }}
            type="success"
            message="Your family's thaali preferences for the next month have been recorded"
          />
        )}
        <div>
          {activeMenu === null ? (
            <div>Loading...</div>
          ) : activeMenu.length === 0 ? (
            <Alert
              type="warning"
              message="There are no menus open for submission"
            />
          ) : (
            getCurrPage(panel)
          )}
        </div>
      </Card>
    </SubmitFMBMenuWrapper>
  )
}

const SubmitFMBMenuWrapper = styled.div`
  max-width: 1000px;
  margin: auto;
  .next-btn {
    padding-top: 0.2rem;
    padding-bottom: 2.2rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`

export default SubmitFMBMenu
