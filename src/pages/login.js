import React, { useState, useContext } from "react"
import Layout from "../components/layout"
import styled from "styled-components"
import { Form, Input, Button, Card, message, Spin } from "antd"
import { onFinishFailed } from "../functions/forms"
import { navigate } from "gatsby"
import firebase from "gatsby-plugin-firebase"
import { AuthContext } from "../provider/auth-context"

const layout = {
  labelCol: { span: 16 },
  wrapperCol: { span: 24 },
}

message.config({
  top: 100,
  duration: 4,
  maxCount: 3,
})

const Message = ({ message }) => {
  return (
    <>
      <br />
      <div>{message}</div>
    </>
  )
}

const getAndSetUserInformation = async (uid, localEncryptedStore) => {
  try {
    const doc = await firebase.firestore().collection("users").doc(uid).get()
    if (doc.exists) {
      const userInfo = doc.data()
      localEncryptedStore.set("authUser", {
        uid: uid,
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        email: userInfo.email,
        familyid: userInfo.familyid,
        its: userInfo.its,
        permissions: userInfo.permissions,
        phone: userInfo.phone,
        title: userInfo.title,
      })
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!")
    }
  } catch (err) {
    console.log(err)
  }
}

const LoginForm = () => {
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setIsLoggedIn, localEncryptedStore, setCurrUser } = useContext(
    AuthContext
  )

  const onSubmit = async values => {
    if (isSubmitting) {
      try {
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(values.email, values.password)
        if (response.user.uid) {
          await getAndSetUserInformation(response.user.uid, localEncryptedStore)
          setIsLoggedIn(true)
          setCurrUser(localEncryptedStore.get("authUser"))
          navigate(`/auth/profile`)
        } else {
          message.error({
            content: (
              <Message
                message={`Error: Something went wrong while logging in`}
              />
            ),
            key: 1,
          })
        }
      } catch (error) {
        message.error({
          content: <Message message={`Error: ${error.message}`} />,
          key: 1,
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setIsSubmitting(false)
    }
  }

  return (
    <Card title="Login" headStyle={{ fontSize: "1.7rem", textAlign: "center" }}>
      <Spin spinning={isSubmitting}>
        <Form
          {...layout}
          form={form}
          onFinish={onSubmit}
          initialValues={{ email: null, password: null }}
          onFinishFailed={() => onFinishFailed(form)}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Email is not valid" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="submit mod-btn"
              htmlType="submit"
              onClick={() => setIsSubmitting(true)}
            >
              Submit
            </Button>
          </Form.Item>

          <Form.Item>
            <Button onClick={() => navigate("/register")} className="mod-btn">
              Register
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Button
              style={{ color: "gray" }}
              type="link"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password?
            </Button>
          </div>
        </Form>
      </Spin>
    </Card>
  )
}

export default () => {
  return (
    <Layout>
      <LoginWrapper>
        <div className="content">
          <LoginForm />
        </div>
      </LoginWrapper>
    </Layout>
  )
}

const LoginWrapper = styled.div`
  .content {
    max-width: 500px;
    margin: auto;
    padding-top: 5%;
  }

  .mod-btn {
    width: 100%;
    padding-top: 0.3rem;
    padding-bottom: 2.3rem;
    font-size: 1.3rem;
  }

  .submit {
    margin-top: 1rem;
  }
`
