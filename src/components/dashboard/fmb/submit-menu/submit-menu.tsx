import React, { useState, useEffect, useRef, useContext } from "react"
import { Card, Alert, Spin, Collapse, Divider, Button, Form, Input } from "antd"
import { MailOutlined } from "@ant-design/icons"
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
  const [isResendingDefault, setIsResendingDefault] = useState(false)
  const [isResendingOther, setIsResendingOther] = useState(false)
  const [otherEmailForm] = Form.useForm()

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

  const sendConfirmationEmail = async (
    emails: string[],
    selectionsMap: any,
    menuItems: any[],
    hijriMonthName: string,
    hijriYear: string | number,
    familyDisplayName: string
  ) => {
    const itemSelections = thaaliSubmitEmailTest(selectionsMap, menuItems)
    const sendEmailAfterThaaliSubmission = httpsCallable(
      functions,
      "sendEmailAfterThaaliSubmission"
    )
    await sendEmailAfterThaaliSubmission({
      itemSelections,
      hijriMonthName,
      hijriYear,
      userEmails: emails,
      familyDisplayName,
    })
  }

  const handleResendDefault = async () => {
    if (!activeMenu || !alreadySubmittedItemsDoc?.selections) return
    setIsResendingDefault(true)
    try {
      await sendConfirmationEmail(
        [currUser.email],
        alreadySubmittedItemsDoc.selections,
        activeMenu.items,
        activeMenu.displayMonthName,
        activeMenu.displayYear,
        alreadySubmittedItemsDoc.familyDisplayName || currUser.family.displayname
      )
      CustomMessage(
        "success",
        `Confirmation email resent to ${currUser.email}`
      )
    } catch (err) {
      console.log(err)
      CustomMessage("error", "Could not resend confirmation email")
    } finally {
      setIsResendingDefault(false)
    }
  }

  const handleResendToOther = async ({ email }: { email: string }) => {
    if (!activeMenu || !alreadySubmittedItemsDoc?.selections) return
    setIsResendingOther(true)
    try {
      await sendConfirmationEmail(
        [email],
        alreadySubmittedItemsDoc.selections,
        activeMenu.items,
        activeMenu.displayMonthName,
        activeMenu.displayYear,
        alreadySubmittedItemsDoc.familyDisplayName || currUser.family.displayname
      )
      CustomMessage("success", `Confirmation email sent to ${email}`)
      otherEmailForm.resetFields()
    } catch (err) {
      console.log(err)
      CustomMessage("error", "Could not send confirmation email")
    } finally {
      setIsResendingOther(false)
    }
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

      try {
        await sendConfirmationEmail(
          getEmailsToSendItTo(),
          selections.items,
          activeMenu.items,
          activeMenu.displayMonthName,
          activeMenu.displayYear,
          currUser.family.displayname
        )
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

    // If activeMenu is still null after 10s, stop waiting
    const timeout = setTimeout(() => {
      setActiveMenu((prev: any) => (prev === null ? -1 : prev))
    }, 10000)

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
      clearTimeout(timeout)
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
            <SuccessGroup>
              <SuccessAlert
                type="success"
                message="Your family's thaali preferences have been recorded. Check your inbox for a confirmation email."
              />
              <ResendPanel>
                <ResendCollapse
                  ghost
                  items={[
                    {
                      key: "resend",
                      label: (
                        <ResendCollapseLabel>
                          <MailOutlined />
                          <span>Didn't receive the email?</span>
                        </ResendCollapseLabel>
                      ),
                      children: (
                        <ResendContents>
                          <ResendLabel>
                            Resend to <ResendEmail>{currUser.email}</ResendEmail>
                          </ResendLabel>
                          <Button
                            block
                            onClick={handleResendDefault}
                            loading={isResendingDefault}
                            disabled={isResendingOther}
                          >
                            Resend confirmation
                          </Button>
                          <ResendDivider plain>
                            or send to a different email
                          </ResendDivider>
                          <Form
                            form={otherEmailForm}
                            onFinish={handleResendToOther}
                            layout="vertical"
                          >
                            <Form.Item
                              name="email"
                              rules={[
                                { required: true, message: "Enter an email address" },
                                { type: "email", message: "Enter a valid email address" },
                              ]}
                              style={{ marginBottom: "0.5rem" }}
                            >
                              <Input placeholder="name@example.com" type="email" />
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}>
                              <Button
                                block
                                type="primary"
                                htmlType="submit"
                                loading={isResendingOther}
                                disabled={isResendingDefault}
                              >
                                Send
                              </Button>
                            </Form.Item>
                          </Form>
                        </ResendContents>
                      ),
                    },
                  ]}
                />
              </ResendPanel>
            </SuccessGroup>
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

const SuccessGroup = styled.div`
  margin-bottom: 1rem;
`

const SuccessAlert = styled(Alert)`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: none;
`

const ResendPanel = styled.div`
  background: #ffffff;
  border: 1px solid #b7eb8f;
  border-top: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 0 0.85rem;
`

const ResendCollapse = styled(Collapse)`
  background: transparent;
  &.ant-collapse-ghost > .ant-collapse-item {
    border-bottom: none;
  }
  &.ant-collapse-ghost > .ant-collapse-item > .ant-collapse-header {
    padding: 0.6rem 0;
    color: rgba(0, 0, 0, 0.72);
    align-items: center;
  }
  &.ant-collapse-ghost
    > .ant-collapse-item
    > .ant-collapse-content
    > .ant-collapse-content-box {
    padding: 0.25rem 0 0.85rem;
  }
`

const ResendCollapseLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
`

const ResendContents = styled.div``

const ResendLabel = styled.div`
  color: rgba(0, 0, 0, 0.55);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  word-break: break-all;
`

const ResendEmail = styled.span`
  color: rgba(0, 0, 0, 0.78);
  font-weight: 500;
`

const ResendDivider = styled(Divider)`
  margin: 1rem 0 0.75rem !important;
  color: rgba(0, 0, 0, 0.45) !important;
  font-size: 0.8rem !important;
  font-weight: normal !important;
  &::before,
  &::after {
    border-block-start-color: #e8e8e8 !important;
  }
`

export default SubmitFMBMenu
