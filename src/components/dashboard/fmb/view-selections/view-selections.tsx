import React, { useContext, useEffect, useState } from "react"
import CardWithHeader from "../../../other/card-with-header"
import firebase from "firebase"
import { firestore } from "firebase"
import { DateContext } from "../../../../provider/date-context"
import {
  FamilySubmissionData,
  HijriYearDocument,
  MenuData,
} from "../../../../types/typings"
import { DatabaseContext } from "../../../../provider/database-context"
import { AuthContext } from "../../../../provider/auth-context"
import ItemListDisplay from "../shared/item-list-display"
import { Divider } from "antd"
import styled from "styled-components"

interface ViewSelectionsProps {}

interface MenuListItem {
  menuData: MenuData
  submissionData: FamilySubmissionData
}

// for the current hijri year give a dropdown of all menus
// by default have the latest one selected

const ViewSelections = (props: ViewSelectionsProps) => {
  const { getHijriDate } = useContext(DateContext)
  const { hijriYearDocRef } = useContext(DatabaseContext)
  const { currUser } = useContext(AuthContext)
  const [menuList, setMenuList] = useState<MenuListItem[]>([])
  const [isLoading, setIsLoading] = useState<Boolean>(false)
  const hijriYear = getHijriDate().year
  const getData = async (): Promise<MenuListItem[]> => {
    // query where we look for all menus that have submissions from the current users families
    // for each of those menus get submissions data
    setIsLoading(true)
    let menuListBuilder: MenuListItem[] = []

    const allMenusWithSubmissionsForUserFamily = (
      await firebase
        .firestore()
        .collection("fmb")
        .doc(hijriYear.toString())
        .collection("menus")
        .where("submissions", "array-contains", currUser.familyid)
        .get()
    ).docs as firestore.QueryDocumentSnapshot<MenuData>[]

    for (let menu of allMenusWithSubmissionsForUserFamily) {
      const menuData = menu.data()

      const familySubmission = (await menu.ref
        .collection("submissions")
        .doc(currUser.familyid)
        .get()) as firestore.DocumentSnapshot<FamilySubmissionData>
      const familySubmissionsDataForMenu = familySubmission.data()
      console.log(familySubmissionsDataForMenu)

      menuListBuilder.push({
        menuData: menuData,
        submissionData: familySubmissionsDataForMenu,
      })
    }
    return Promise.resolve(menuListBuilder)
  }
  useEffect(() => {
    getData().then(menuList => {
      setMenuList(menuList)
      setIsLoading(false)
    })
  }, [])
  return (
    <CardWithHeaderWrapper>
      <CardWithHeader title="View Thaali Selections">
        {isLoading && menuList.length === 0 ? (
          <div>Loading...</div>
        ) : (
          <>
            <Divider style={{ marginTop: "0rem" }} orientation="left">
              Submissions for Hijri Year {hijriYear}
            </Divider>
            {menuList.map(({ menuData, submissionData }) => {
              return (
                <ItemListDisplay
                  key={menuData.displayMonthName}
                  title={`${menuData.displayMonthName}`}
                  submittedBy={`${submissionData.submittedBy.firstname} ${submissionData.submittedBy.lastname}`}
                  items={menuData.items}
                  selections={submissionData.selections}
                />
              )
            })}
          </>
        )}
      </CardWithHeader>
    </CardWithHeaderWrapper>
  )
}

const CardWithHeaderWrapper = styled.div`
  .ant-divider-horizontal.ant-divider-with-text-left::before {
    width: 0%;
  }

  .ant-divider-horizontal.ant-divider-with-text-left::after {
    width: 100%;
  }
  .ant-divider-inner-text {
    padding-left: 0;
  }
`

export default ViewSelections
