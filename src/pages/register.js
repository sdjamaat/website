import React, { useState } from "react"
import Layout from "../components/layout"
import styled from "styled-components"
import { Card, message, Spin } from "antd"
import AccountDetails from "../components/registration/account-details"
import PersonalDetails from "../components/registration/personal-details"
import ReviewDetails from "../components/registration/review-details"
import firebase from "gatsby-plugin-firebase"
import { navigate } from "gatsby"

const layout = {
  labelCol: { span: 16 },
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
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accountDetails, setAccountDetails] = useState({
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
    dob: null,
    phone: null,
    address: null,
    familymembers: null,
    movestatus: null,
  })

  const nextStep = () => {
    if (step === 3) {
      setStep(1)
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const getCurrentForm = step => {
    switch (step) {
      case 1:
        return (
          <AccountDetails
            layout={layout}
            nextStep={nextStep}
            values={accountDetails}
            setValues={setAccountDetails}
          />
        )
      case 2:
        return (
          <PersonalDetails
            layout={layout}
            nextStep={nextStep}
            prevStep={prevStep}
            values={personalDetails}
            setValues={setPersonalDetails}
          />
        )
      case 3:
        return (
          <ReviewDetails
            prevStep={prevStep}
            accountDetails={accountDetails}
            personalDetails={personalDetails}
            submitForm={submitForm}
          />
        )
      default:
        return (
          <AccountDetails
            layout={layout}
            nextStep={nextStep}
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

  const submitForm = () => {
    setIsSubmitting(true)
    const {
      password,
      confirmpassword,
      ...restOfAccountDetails
    } = accountDetails
    const { dob, ...restOfPersonalDetails } = personalDetails

    const metadata = {
      ...restOfAccountDetails,
      ...restOfPersonalDetails,
      dob: dob.format("YYYY-MM-DD"),
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(accountDetails.email, password)
      .then(response => {
        if (response) {
          return writeUserData(response.user.uid, {
            ...metadata,
            uid: response.user.uid,
            permissions: { admin: false },
          })
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
