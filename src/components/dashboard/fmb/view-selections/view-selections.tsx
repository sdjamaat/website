import React, { useContext, useEffect, useState } from "react"
import CardWithHeader from "../../../other/card-with-header"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "../../../../lib/firebase"
import { DateContext } from "../../../../provider/date-context"
import { FamilySubmissionData, MenuData } from "../../../../types/typings"
import { AuthContext } from "../../../../provider/auth-context"
import ItemListDisplay from "../shared/item-list-display"
import { Alert, Divider } from "antd"
import styled from "styled-components"

interface MenuListItem {
  menuData: MenuData
  submissionData: FamilySubmissionData
}

const ViewSelections = () => {
  const { getHijriDate } = useContext(DateContext)
  const { currUser } = useContext(AuthContext)
  const [menuList, setMenuList] = useState<MenuListItem[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const hijriYear = getHijriDate().databaseYear

  const getData = async () => {
    setIsLoading(true)
    let menuListBuilder: MenuListItem[] = []

    const menusRef = collection(db, "fmb", hijriYear.toString(), "menus")
    const q = query(menusRef, where("submissions", "array-contains", currUser.familyid))
    const querySnapshot = await getDocs(q)

    for (let menuDoc of querySnapshot.docs) {
      const menuData = menuDoc.data() as MenuData
      const submissionDoc = await getDoc(
        doc(collection(menuDoc.ref, "submissions"), currUser.familyid)
      )
      const familySubmissionsDataForMenu = submissionDoc.data() as FamilySubmissionData

      menuListBuilder.push({
        menuData,
        submissionData: familySubmissionsDataForMenu,
      })
    }
    setMenuList(menuListBuilder)
    setIsLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <CardWithHeaderWrapper>
      <CardWithHeader title="View Thaali Selections">
        {isLoading || menuList === null ? (
          <div>Loading...</div>
        ) : (
          <>
            <Divider style={{ marginTop: "0rem" }} orientation="left">
              Submissions for Hijri Year {hijriYear}
            </Divider>
            {menuList.length > 0 &&
              menuList.map(({ menuData, submissionData }) => (
                <ItemListDisplay
                  key={menuData.displayMonthName}
                  title={menuData.displayMonthName}
                  submittedBy={`${submissionData.submittedBy.firstname} ${submissionData.submittedBy.lastname}`}
                  items={menuData.items}
                  selections={submissionData.selections}
                />
              ))}
            {menuList.length === 0 && (
              <Alert type="warning" message="No submissions found for the current hijri year" />
            )}
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
