import React, { useState, useContext } from "react"
import Layout from "../components/other/layout"
import styled from "styled-components"
import { Form, Input, Button, Card, Spin } from "antd"
import { onFinishFailed } from "../functions/forms"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../lib/firebase"
import { AuthContext } from "../provider/auth-context"
import CustomMessage from "../components/other/custom-message"
import useComponentWillMount from "../custom-hooks/component-will-mount"
import useQueryParam from "../custom-hooks/use-query-params"

const layout = {
  labelCol: { span: 16 },
  wrapperCol: { span: 24 },
}

const getAndSetUserInformation = async (uid: string, localEncryptedStore: any) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid))
    if (docSnap.exists()) {
      const userInfo = docSnap.data()
      if (!userInfo.admin) {
        const familyInfo = await getDoc(doc(db, "families", userInfo.familyid))
        localEncryptedStore.set("authUser", {
          uid: uid,
          firstname: userInfo.firstname,
          lastname: userInfo.lastname,
          email: userInfo.email,
          familyid: userInfo.familyid,
          its: userInfo.its,
          phone: userInfo.phone,
          title: userInfo.title,
          yob: userInfo.yob,
          family: {
            ...familyInfo.data(),
          },
          timestamp: Date.now(),
        })
      } else {
        return false
      }
    } else {
      return false
    }
  } catch (err) {
    console.log(err)
    return false
  }

  return true
}

const LoginForm = () => {
  const navigate = useNavigate()
  const {
    isLoggedIn,
    setIsLoggedIn,
    localEncryptedStore,
    setCurrUser,
  } = useContext(AuthContext)

  useComponentWillMount(() => {
    if (isLoggedIn) {
      navigate("/auth/dashboard?tab=profile")
    }
  })
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [path] = useQueryParam("path", "")
  const [tab] = useQueryParam("tab", "")

  const onSubmit = async (values: any) => {
    if (isSubmitting) {
      try {
        const response = await signInWithEmailAndPassword(auth, values.email, values.password)
        if (response.user.uid) {
          const isUser = await getAndSetUserInformation(
            response.user.uid,
            localEncryptedStore
          )
          if (isUser) {
            setIsLoggedIn(true)
            setCurrUser(localEncryptedStore.get("authUser"))
            if (path) {
              if (tab) {
                navigate(`${path}?tab=${tab}`)
              } else {
                navigate(`${path}`)
              }
            } else {
              navigate("/auth/dashboard?tab=profile")
            }
          } else {
            throw { message: "Unauthorized" }
          }
        } else {
          CustomMessage("error", "Something went wrong while logging in")
        }
      } catch (error: any) {
        CustomMessage("error", error.message)
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
          onFinishFailed={() => {
            onFinishFailed(form)
            setIsSubmitting(false)
          }}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email", message: "Email is not valid" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password" }]}
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

const Login = () => {
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
    max-width: 550px;
    margin: auto;
    padding-top: 3.5%;
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

export default Login
