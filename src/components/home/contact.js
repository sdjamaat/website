import React from "react"
import { Form, Input, InputNumber, Button, Card, message } from "antd"
import firebase from "gatsby-plugin-firebase"
import styled from "styled-components"

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

const SuccessSubmit = () => {
  return <h5>Successfully submitted information!"</h5>
}

const Contact = () => {
  const [form] = Form.useForm()

  const onFinishFailed = () => {
    setTimeout(() => {
      let badFields = form.getFieldsError()
      console.log(badFields)
      let badFieldNames = []
      for (let field of badFields) {
        if (field.errors.length !== 0) badFieldNames.push(field.name[0])
      }
      form.resetFields(badFieldNames)
    }, 4000)
  }

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
        message.success("Successfully submitted information!")
      })
      .catch(error => {
        message.error("Error submitting contact form")
      })
  }

  const layout = {
    labelCol: {
      span: 16,
    },
    wrapperCol: {
      span: 24,
    },
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
        <Form
          {...layout}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          validateMessages={validateMessages}
          layout="vertical"
          size="small"
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
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="submit-btn"
              onClick={() => message.success(SuccessSubmit)}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </ContactWrapper>
  )
}

const ContactWrapper = styled.div`
  .submit-btn {
    width: 100%;
    padding-top: 0.5rem;
    padding-bottom: 1.8rem;
  }
`

export default Contact
