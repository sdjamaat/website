import React, { useState, useEffect } from "react"
import { cloneDeep } from "lodash"
import Layout from "../components/layout"
import styled from "styled-components"
import { Card, message, Spin } from "antd"
import AccountDetails from "../components/registration/account-details"
import PersonalDetails from "../components/registration/personal-details"
import FamilyDetails from "../components/registration/family-details"
import ReviewDetails from "../components/registration/review-details"
import ChooseFamily from "../components/registration/choose-family"
import FamilyMemberDetails from "../components/registration/family-member-details"
import firebase from "gatsby-plugin-firebase"
import { navigate } from "gatsby"

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

message.config({
  top: 75,
  maxCount: 3,
  duration: 5,
})
const Message = ({ message }) => {
  return (
    <>
      <br />
      <div>{message}</div>
    </>
  )
}

export default () => {
  const [step, setStep] = useState("account-details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [families, setFamilies] = useState([])

  const getFamilies = () => {
    firebase
      .firestore()
      .collection("families")
      .get()
      .then(snapshot => {
        let allfamilies = []
        snapshot.forEach(doc => {
          let family = {
            familyid: doc.id,
            displayname: doc.data().displayname,
            members: doc.data().members,
          }
          allfamilies.push(family)
        })
        return allfamilies
      })
      .then(allfamilies => {
        setFamilies(allfamilies)
      })
      .catch(err => {
        console.log("Error getting documents", err)
      })
  }

  useEffect(() => {
    getFamilies()
  }, [])

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
    movestatus: null,
    address: {
      street: null,
      city: null,
      zip: null,
    },
    fmbstatus: null,
  })

  const [familyMemberDetails, setFamilyMemberDetails] = useState({
    members: [],
  })

  const [familyAffiliation, setFamilyAffiliation] = useState({
    familyid: null,
    displayname: null,
    familyindex: 0,
  })

  const setFamDetails = members => {
    setFamilyMemberDetails(members)
  }

  const getCurrentForm = step => {
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
            families={families}
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
            setValues={setFamDetails}
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

  const writeUserData = (uid, metadata) => {
    return firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .set({
        ...metadata,
      })
  }

  const writeFamilyData = metadata => {
    console.log(metadata)
    return firebase
      .firestore()
      .collection("families")
      .doc(metadata.familyid)
      .set({
        ...metadata,
      })
  }

  const updateFamilyMemberInfo = (familyid, newMembersArray) => {
    console.log("in firebase", newMembersArray)
    return firebase.firestore().collection("families").doc(familyid).set(
      {
        members: newMembersArray,
      },
      { merge: true }
    )
  }

  const mergeUserInfoWithExisitingFamilyArray = (uid, memberindex) => {
    // console.log("modifying", familyAffiliation.members)
    let newFamilyMemberArray = cloneDeep(familyAffiliation.members)

    // console.log(newFamilyMemberArray)
    newFamilyMemberArray[memberindex].firstname = accountDetails.firstname
    newFamilyMemberArray[memberindex].lastname = accountDetails.lastname
    newFamilyMemberArray[memberindex].its = accountDetails.its
    newFamilyMemberArray[memberindex].yob = personalDetails.yob.format("YYYY")
    newFamilyMemberArray[memberindex].uid = uid
    return newFamilyMemberArray
  }

  const getFormattedFamilyDetails = (familyid, uid) => {
    let newFamilyMemberArray = cloneDeep(familyMemberDetails.members)
    newFamilyMemberArray.shift()
    for (let member of newFamilyMemberArray) {
      member.yob = member.yob.format("YYYY")
      member.uid = null
      member.its = member.its || null
    }
    const { fmbstatus, ...restOfFamilyDetails } = familyDetails
    let newFamilyDetails = {
      ...restOfFamilyDetails,
      members: newFamilyMemberArray,
      head: {
        firstname: accountDetails.firstname,
        lastname: accountDetails.lastname,
        its: accountDetails.its,
        uid: uid,
      },
      displayname: `${accountDetails.lastname} Family (${accountDetails.firstname})`,
      fmb: {
        code: `${accountDetails.firstname
          .charAt(0)
          .toUpperCase()}${accountDetails.lastname.charAt(0).toUpperCase()}`,
        enrolled: `${fmbstatus !== "Not enrolled" ? true : false}`,
        defaultsize: `${fmbstatus !== "Not enrolled" ? fmbstatus : "None"}`,
      },
      familyid: familyid,
    }
    return newFamilyDetails
  }

  const getFamilyID = () => {
    if (accountDetails.familyhead) {
      return `${accountDetails.firstname.toLowerCase()}${accountDetails.lastname.toLowerCase()}${
        Math.floor(Math.random() * 10000) + 10000
      }`
    } else {
      return familyAffiliation.familyid
    }
  }

  const submitForm = () => {
    setIsSubmitting(true)
    const familyid = getFamilyID()

    // let mergeddata = null

    // if (!accountDetails.familyhead) {
    //   let mergeddata = mergeUserInfoWithExisitingFamilyArray(
    //     2342343,
    //     familyAffiliation.memberindex
    //   )
    //   console.log("MERGED", mergeddata)
    // }

    const {
      password,
      confirmpassword,
      ...restOfAccountDetails
    } = accountDetails
    const { yob, ...restOfPersonalDetails } = personalDetails

    const metadata = {
      ...restOfAccountDetails,
      ...restOfPersonalDetails,
      yob: yob.format("YYYY"),
      permissions: { admin: false },
      familyid: familyid,
    }

    console.log(metadata)

    firebase
      .auth()
      .createUserWithEmailAndPassword(accountDetails.email, password)
      .then(response => {
        if (response) {
          writeUserData(response.user.uid, {
            ...metadata,
            uid: response.user.uid,
          })
          return response.user.uid
        }
      })
      .then(uid => {
        if (accountDetails.familyhead) {
          writeFamilyData(getFormattedFamilyDetails(familyid, uid))
        } else {
          updateFamilyMemberInfo(
            familyid,
            mergeUserInfoWithExisitingFamilyArray(
              uid,
              familyAffiliation.memberindex
            )
          )
        }
      })
      .then(() => {
        setTimeout(() => {
          navigate("/auth/profile")
        }, 2500)
        message.success({
          content: (
            <Message message="Successfully registered. Redirecting now..." />
          ),
          key: 1,
          duration: 2.5,
        })
      })
      .catch(error => {
        console.log(error)
        message.error({
          content: <Message message={error.message} />,
          key: 2,
        })
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
    max-width: 500px;
    margin: auto;
    padding-top: 5%;
  }
`
