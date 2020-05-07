import React from "react"
import { Form, Input, InputNumber, Button } from "antd"
import firebase from "gatsby-plugin-firebase"

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not valid!",
    number: "${label} is not valid!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
}

const Contact = () => {
  const [form] = Form.useForm()

  const onFinish = values => {
    firebase
      .firestore()
      .collection("contact")
      .add({
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
      })
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id)
        form.resetFields()
      })
      .catch(error => {
        console.error("Error adding document: ", error)
      })
  }

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  }

  return (
    <Form
      {...layout}
      form={form}
      onFinish={onFinish}
      validateMessages={validateMessages}
      layout="vertical"
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            required: true,
            type: "email",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            required: true,
            type: "number",
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="message"
        label="Message"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Contact
