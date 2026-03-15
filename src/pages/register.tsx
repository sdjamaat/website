import React, { useState } from "react"
import { cloneDeep } from "lodash"
import Layout from "../components/other/layout"
import styled from "styled-components"
import { Card, Spin } from "antd"
import AccountDetails from "../components/registration/account-details"
import PersonalDetails from "../components/registration/personal-details"
import FamilyDetails from "../components/registration/family-details"
import ReviewDetails from "../components/registration/review-details"
import ChooseFamily from "../components/registration/choose-family"
import FamilyMemberDetails from "../components/registration/family-member-details"
import SuccessSplash from "../components/registration/success"
import CustomMessage from "../components/other/custom-message"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, getDocs, collection } from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import { auth, db, functions } from "../lib/firebase"

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const Register = () => {
  const [step, setStep] = useState("account-details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shouldGetFamiliesFromFirebase, setShouldGetFamiliesFromFirebase] = useState(true)
  const [families, setFamilies] = useState<any[]>([])

  const getFamilies = async () => {
    if (shouldGetFamiliesFromFirebase) {
      try {
        let allfamilies: any[] = []
        const querySnapshot = await getDocs(collection(db, "families"))

        querySnapshot.forEach((docSnap) => {
          let family = {
            familyid: docSnap.id,
            displayname: docSnap.data().displayname,
            members: docSnap.data().members,
          }
          allfamilies.push(family)
        })

        setFamilies(allfamilies)
        setShouldGetFamiliesFromFirebase(false)
        return allfamilies
      } catch (error) {
        console.log("Error getting documents", error)
        CustomMessage("error", "Cannot connect to database")
      }
    } else {
      return families
    }
  }

  const [accountDetails, setAccountDetails] = useState({
    familyhead: null,
    its: null,
    email: null,
    firstname: null,
    lastname: null,
    password: null,
    confirmpassword: null,
  })

  const [personalDetails, setPersonalDetails] = useState({
    title: "None",
    othertitles: [],
    yob: null,
    phone: null,
  })

  const [familyDetails, setFamilyDetails] = useState({
    size: null,
    registrationStatus: null,
    address: {
      street: null,
      city: null,
      zip: null,
    },
  })

  const [familyMemberDetails, setFamilyMemberDetails] = useState({
    members: [],
  })

  const [familyAffiliation, setFamilyAffiliation] = useState<any>({
    familyid: null,
    displayname: null,
    familyindex: null,
  })

  const getCurrentForm = (step: string) => {
    switch (step) {
      case "account-details":
        return (
          <AccountDetails
            layout={layout}
            setStep={setStep}
            values={accountDetails}
            setValues={setAccountDetails}
          />
        )
      case "personal-details":
        return (
          <PersonalDetails
            layout={layout}
            setStep={setStep}
            skipFamilyDetails={!accountDetails.familyhead}
            values={personalDetails}
            setValues={setPersonalDetails}
          />
        )
      case "choose-family":
        return (
          <ChooseFamily
            layout={layout}
            getFamilies={getFamilies}
            setStep={setStep}
            values={familyAffiliation}
            setValues={setFamilyAffiliation}
          />
        )
      case "family-details":
        return (
          <FamilyDetails
            layout={layout}
            setStep={setStep}
            values={familyDetails}
            setValues={setFamilyDetails}
          />
        )
      case "family-member-details":
        return (
          <FamilyMemberDetails
            layout={layout}
            setStep={setStep}
            values={familyMemberDetails}
            setValues={setFamilyMemberDetails}
            numFamilyMembers={familyDetails.size}
          />
        )
      case "review":
        return (
          <ReviewDetails
            setStep={setStep}
            accountDetails={accountDetails}
            personalDetails={personalDetails}
            familyDetails={familyDetails}
            familyAffiliation={familyAffiliation}
            familyMemberDetails={familyMemberDetails}
            showFamilyDetails={accountDetails.familyhead}
            submitForm={submitForm}
          />
        )
      case "success":
        return <SuccessSplash />
      default:
        return (
          <AccountDetails
            layout={layout}
            setStep={setStep}
            values={accountDetails}
            setValues={setAccountDetails}
          />
        )
    }
  }

  const writeUserData = (uid: string, metadata: any) => {
    return setDoc(doc(db, "users", uid), { ...metadata })
  }

  const writeFamilyData = (metadata: any) => {
    return setDoc(doc(db, "families", metadata.familyid), { ...metadata })
  }

  const updateFamilyMemberInfo = (familyid: string, newMembersArray: any[]) => {
    return setDoc(doc(db, "families", familyid), { members: newMembersArray }, { merge: true })
  }

  const mergeUserInfoWithExisitingFamilyArray = (uid: string, memberindex: number) => {
    let newFamilyMemberArray = cloneDeep(familyAffiliation.members)
    newFamilyMemberArray[memberindex].firstname = accountDetails.firstname
    newFamilyMemberArray[memberindex].lastname = accountDetails.lastname
    newFamilyMemberArray[memberindex].its = accountDetails.its
    newFamilyMemberArray[memberindex].yob = (personalDetails as any).yob.format("YYYY")
    newFamilyMemberArray[memberindex].uid = uid
    return newFamilyMemberArray
  }

  const getFormattedFamilyDetails = (familyid: string, uid: string, headOfFamilyYOB: string) => {
    let newFamilyMemberArray = cloneDeep((familyMemberDetails as any).members)
    newFamilyMemberArray.shift()
    for (let member of newFamilyMemberArray) {
      member.yob = member.yob.format("YYYY")
      member.uid = null
      member.its = member.its || null
    }

    let newFamilyDetails = {
      ...familyDetails,
      members: newFamilyMemberArray,
      head: {
        firstname: accountDetails.firstname,
        lastname: accountDetails.lastname,
        its: accountDetails.its,
        yob: headOfFamilyYOB,
        email: accountDetails.email,
        uid: uid,
      },
      displayname: `${accountDetails.lastname} Family (${accountDetails.firstname})`,
      fmb: {
        code: null,
        enrolled: false,
        thaaliSize: null,
      },
      familyid: familyid,
    }

    return newFamilyDetails
  }

  const getFamilyID = () => {
    if (accountDetails.familyhead) {
      return `${(accountDetails.firstname as any).toLowerCase()}${(accountDetails.lastname as any).toLowerCase()}${
        Math.floor(Math.random() * 100000) + 100000
      }`
    } else {
      return familyAffiliation.familyid
    }
  }

  const submitForm = () => {
    setIsSubmitting(true)
    const familyid = getFamilyID()

    const { password, confirmpassword, ...restOfAccountDetails } = accountDetails as any
    const { yob, ...restOfPersonalDetails } = personalDetails as any

    const metadata = {
      ...restOfAccountDetails,
      ...restOfPersonalDetails,
      yob: yob.format("YYYY"),
      familyid: familyid,
    }

    createUserWithEmailAndPassword(auth, accountDetails.email!, password)
      .then((response) => {
        if (response) {
          writeUserData(response.user.uid, {
            ...metadata,
            uid: response.user.uid,
          })
          return response.user.uid
        }
      })
      .then((uid) => {
        if (accountDetails.familyhead) {
          writeFamilyData(
            getFormattedFamilyDetails(familyid, uid!, metadata.yob)
          )
        } else {
          updateFamilyMemberInfo(
            familyid,
            mergeUserInfoWithExisitingFamilyArray(
              uid!,
              familyAffiliation.memberindex
            )
          )
        }
        return uid
      })
      .then(async (uid) => {
        if (import.meta.env.VITE_ARE_NEW_USERS_DISABLED === "true") {
          const disableNewRegistration = httpsCallable(functions, "disableNewRegistration")
          await disableNewRegistration({
            caller: { uid: uid },
          })
        }
        setStep("success")
      })
      .catch((error) => {
        console.log(error)
        CustomMessage("error", error.message)
      })
      .finally(() => setIsSubmitting(false))
  }

  return (
    <Layout>
      <RegisterWrapper>
        <div className="content">
          <Card
            title="Register"
            headStyle={{ fontSize: "1.7rem", textAlign: "center" }}
            bodyStyle={{ paddingBottom: "0" }}
          >
            <Spin spinning={isSubmitting}>{getCurrentForm(step)}</Spin>
          </Card>
        </div>
      </RegisterWrapper>
    </Layout>
  )
}

const RegisterWrapper = styled.div`
  .content {
    max-width: 550px;
    margin: auto;
    padding-top: 3.5%;
  }
`

export default Register
