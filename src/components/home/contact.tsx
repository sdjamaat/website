import React, { useState } from "react"
import { Form, Input, InputNumber, Button, Card, Spin } from "antd"
import { onFinishFailed } from "../../functions/forms"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import styled from "styled-components"
import CustomMessage from "../other/custom-message"

const Contact = () => {
  const [form] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onFinish = (values: any) => {
    setIsSubmitting(true)
    addDoc(collection(db, "contact"), {
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
    })
      .then(() => {
        form.resetFields()
        CustomMessage(
          "success",
          "Successfully submitted information! Check your email for a confirmation message"
        )
      })
      .catch(() => {
        CustomMessage("error", "Could not submit contact form")
      })
      .finally(() => setIsSubmitting(false))
  }

  const layout = {
    labelCol: { span: 16 },
    wrapperCol: { span: 24 },
  }

  return (
    <ContactWrapper>
      <Card
        hoverable={true}
        title={"Contact Us"}
        className="contact-us"
        headStyle={{ fontSize: "1.4rem", textAlign: "center" }}
        bodyStyle={{
          padding: "1.5rem",
          marginBottom: "-1.5rem",
        }}
      >
        <Spin spinning={isSubmitting}>
          <Form
            {...layout}
            form={form}
            onFinish={onFinish}
            onFinishFailed={() => onFinishFailed(form)}
            layout="vertical"
            size="small"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input your name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email" },
                { type: "email", message: "Email is invalid" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone number"
              rules={[{ required: true, message: "Please input your phone number" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: "Please input your message" }]}
            >
              <Input.TextArea rows={10} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="submit-btn">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </ContactWrapper>
  )
}

const ContactWrapper = styled.div`
  height: 100%;
  padding-bottom: 15px;
  .ant-card {
    height: 100%;
  }
  .submit-btn {
    width: 100%;
    height: 2.5rem;
  }
`

export default Contact
