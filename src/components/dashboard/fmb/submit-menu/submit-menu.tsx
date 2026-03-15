import React, { useState, useEffect, useRef, useContext } from "react"
import { Card, Alert, Spin, Collapse, Divider } from "antd"
import { DateContext } from "../../../../provider/date-context"
import { AuthContext } from "../../../../provider/auth-context"
import CustomMessage from "../../../other/custom-message"
import { doc, onSnapshot, getDoc, setDoc, updateDoc, arrayUnion, collection } from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import { db, functions } from "../../../../lib/firebase"
import styled from "styled-components"
import StartPanel from "./collect-item-info/start-panel"
import ReviewSelections from "./collect-item-info/review-selections"
import SelectItems from "./collect-item-info/select-items"
import moment from "moment"
import ItemListDisplay from "../shared/item-list-display"

const SubmitFMBMenu = () => {
  const { getHijriDate } = useContext(DateContext)
  const { currUser } = useContext(AuthContext)
  const [activeMenu, setActiveMenu] = useState<any>(null)
  const [activeMenuYear, setActiveMenuYear] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selections, setSelections] = useState<any>({
    "select-toggle": "individual",
    "group-toggle": "calendar-date",
  })
  const [panel, setPanel] = useState("start")
  const [refreshComponent, setRefreshComponent] = useState(false)
  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false)
  const hasAlreadySubmittedRef = useRef(false)
  const [alreadySubmittedItemsDoc, setAlreadySubmittedItemsDoc] = useState<any>({})

  const thaaliSubmitEmailTest = (userSelectionsMap: any, menuItems: any[]) => {
    let itemsArray: any[] = []
    for (let item of menuItems) {
      if (!item.nothaali) {
        itemsArray.push({
          itemName: item.name,
          itemDate: moment(item.date, "MM-DD-YYYY").format("dddd, MMMM Do YYYY"),
          thaaliChoice: userSelectionsMap[item.id],
        })
      }
    }
    return itemsArray
  }

  const getEmailsToSendItTo = () => {
    let listOfEmails = [currUser.email]
    if (currUser.email !== currUser.family.head.email) {
      listOfEmails.push(currUser.family.head.email)
    }
    return listOfEmails
  }

  const submitSelections = async () => {
    setIsSubmitting(true)
    try {
      const monthMenuRef = doc(db, "fmb", activeMenuYear.toString(), "menus", activeMenu.shortMonthName)

      await setDoc(doc(collection(monthMenuRef, "submissions"), currUser.familyid), {
        selections: selections.items,
        submittedBy: {
          firstname: currUser.firstname,
          lastname: currUser.lastname,
          uid: currUser.uid,
        },
        code: currUser.family.fmb.code,
        familyDisplayName: currUser.family.displayname,
      })

      await updateDoc(monthMenuRef, {
        submissions: arrayUnion(currUser.familyid),
      })

      const emailItemSelectionData = thaaliSubmitEmailTest(selections.items, activeMenu.items)
      const sendEmailAfterThaaliSubmission = httpsCallable(functions, "sendEmailAfterThaaliSubmission")

      try {
        await sendEmailAfterThaaliSubmission({
          itemSelections: [...emailItemSelectionData],
          hijriMonthName: activeMenu.displayMonthName,
          hijriYear: activeMenu.displayYear,
          userEmails: getEmailsToSendItTo(),
          familyDisplayName: currUser.family.displayname,
        })
      } catch (err) {
        console.log(err)
      }

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

  const getCurrPage = (page: string) => {
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
            distDateMap={selections.distDateMap}
            hasGroupedSelectionByDistDate={selections["group-toggle"] === "distribution-date"}
            submitSelections={submitSelections}
          />
        )
      default:
        return <div>no panel found</div>
    }
  }

  useEffect(() => {
    const currentHijriDate = getHijriDate()
    const unsubscribes: (() => void)[] = []

    const checkSubmissionAndSetMenu = async (
      menuRef: any,
      menuData: any,
      activeMenuMonth: string,
      year: number,
      isUsingLastActiveMenu: boolean
    ) => {
      try {
        const completedSubmissions = menuData.submissions || []

        hasAlreadySubmittedRef.current = false
        setHasAlreadySubmitted(false)
        setAlreadySubmittedItemsDoc({})

        if (completedSubmissions.includes(currUser.familyid)) {
          const submissionDoc = await getDoc(
            doc(collection(menuRef, "submissions"), currUser.familyid)
          )
          setAlreadySubmittedItemsDoc(submissionDoc.data())
          setHasAlreadySubmitted(true)
          hasAlreadySubmittedRef.current = true
        }

        if (hasAlreadySubmittedRef.current || !isUsingLastActiveMenu) {
          setActiveMenu({ ...menuData, shortMonthName: activeMenuMonth })
          setActiveMenuYear(year)
        } else {
          setActiveMenu(-1)
        }
      } catch (error) {
        console.error("Error checking submission:", error)
        setActiveMenu(-1)
      }
    }

    const setupMenuListener = (yearDocRef: any, year: number) => {
      const unsubYear = onSnapshot(yearDocRef, async (docSnap: any) => {
        if (docSnap.exists()) {
          let activeMenuMonth = docSnap.data().activeMenu
          let isUsingLastActiveMenu = false
          if (!activeMenuMonth) {
            activeMenuMonth = docSnap.data().lastActiveMenu
            isUsingLastActiveMenu = true
          }
          if (activeMenuMonth !== null) {
            const menuRef = doc(collection(yearDocRef, "menus"), activeMenuMonth)
            const unsubMenu = onSnapshot(menuRef, async (menuSnap: any) => {
              const menuData = menuSnap.data()
              if (!menuData) {
                setActiveMenu(-1)
                return
              }
              await checkSubmissionAndSetMenu(menuRef, menuData, activeMenuMonth, year, isUsingLastActiveMenu)
            }, (error) => {
              console.error("Menu listener error:", error)
              setActiveMenu(-1)
            })
            unsubscribes.push(unsubMenu)
          } else {
            setActiveMenu(-1)
          }
        } else {
          setActiveMenu(-1)
        }
      }, (error) => {
        console.error("Year listener error:", error)
        setActiveMenu(-1)
      })
      unsubscribes.push(unsubYear)
    }

    if (currentHijriDate.month === 0) {
      const actualYearRef = doc(db, "fmb", currentHijriDate.year.toString())
      const unsubActualYear = onSnapshot(actualYearRef, (docSnap) => {
        if (docSnap.exists()) {
          let activeMenuMonth = docSnap.data().activeMenu
          if (activeMenuMonth !== null) {
            const menuRef = doc(collection(actualYearRef, "menus"), activeMenuMonth)
            const unsubMenu = onSnapshot(menuRef, async (menuSnap) => {
              const menuData = menuSnap.data()
              if (!menuData) {
                setActiveMenu(-1)
                return
              }
              await checkSubmissionAndSetMenu(menuRef, menuData, activeMenuMonth, currentHijriDate.year, false)
            }, (error) => {
              console.error("Menu listener error:", error)
              setActiveMenu(-1)
            })
            unsubscribes.push(unsubMenu)
            return
          }
        }
        setupMenuListener(doc(db, "fmb", currentHijriDate.databaseYear.toString()), currentHijriDate.databaseYear)
      }, (error) => {
        console.error("Year listener error:", error)
        setActiveMenu(-1)
      })
      unsubscribes.push(unsubActualYear)
    } else {
      setupMenuListener(doc(db, "fmb", currentHijriDate.databaseYear.toString()), currentHijriDate.databaseYear)
    }

    return () => {
      unsubscribes.forEach((unsub) => unsub())
    }
  }, [])

  return (
    <SubmitFMBMenuWrapper>
      <Card
        title="Submit Thaali Choices"
        headStyle={{ fontSize: "1.5rem", textAlign: "center" }}
      >
        {hasAlreadySubmitted && activeMenu !== null && activeMenu !== -1 && !isSubmitting && (
          <>
            <Alert
              style={{ marginBottom: "1rem" }}
              type="success"
              message="Your family's thaali preferences have been recorded. Check your inbox for a confirmation email."
            />
            <ItemListDisplay
              title="Selections"
              items={activeMenu.items}
              selections={alreadySubmittedItemsDoc.selections}
              submittedBy={`${alreadySubmittedItemsDoc.submittedBy.firstname} ${alreadySubmittedItemsDoc.submittedBy.lastname}`}
            />
            <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          </>
        )}
        <div>
          {activeMenu === null ? (
            <div>Loading...</div>
          ) : activeMenu === -1 ? (
            <Alert type="warning" message="There are no menus open for submission" />
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
    height: 2.8rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`

export default SubmitFMBMenu
