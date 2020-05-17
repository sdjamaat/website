import React, { useState } from "react"
import Layout from "../components/layout"
import styled from "styled-components"
import { Form, Input, Button, Card, message, Spin } from "antd"
import { navigate } from "gatsby"
import firebase from "gatsby-plugin-firebase"

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

const LoginForm = () => {
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const onFinish = values => {
    setIsSubmitting(true)
    firebase
      .auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then(response => {
        if (response.user.uid) {
          console.log(response)
          navigate(`/auth/profile`)
        } else {
          message.error({
            content: (
              <Message
                message={`Error: Something went wrong while loggin in`}
              />
            ),
            key: 1,
          })
        }
      })
      .catch(error => {
        message.error({
          content: <Message message={`Error: ${error.message}`} />,
          key: 1,
        })
      })
      .finally(() => setIsSubmitting(false))
  }

  const onFinishFailed = () => {
    setTimeout(() => {
      let badFields = form.getFieldsError()

      let badFieldNames = []
      for (let field of badFields) {
        if (field.errors.length !== 0) badFieldNames.push(field.name[0])
      }
      form.resetFields(badFieldNames)
    }, 4000)
  }

  return (
    <Card title="Login" headStyle={{ fontSize: "1.7rem", textAlign: "center" }}>
      <Spin spinning={isSubmitting}>
        <Form
          {...layout}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
              htmlType="submit"
              className=" submit mod-btn"
            >
              Submit
            </Button>
          </Form.Item>

          <Form.Item>
            <Button onClick={() => navigate("/register")} className="mod-btn">
              Register
            </Button>
          </Form.Item>
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
