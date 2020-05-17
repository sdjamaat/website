import React from "react"
import styled from "styled-components"
import { Form, Input, Button, InputNumber, Tag, Select, DatePicker } from "antd"
const { Option } = Select
const { TextArea } = Input

const PersonalDetails = ({ layout, nextStep, prevStep, values, setValues }) => {
  const [form] = Form.useForm()
  const onFinish = values => {
    setValues({ ...values })
    nextStep()
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
    <PersonalDetailsWrapper>
      <div style={{ textAlign: "center" }}>
        <Tag
          className="float-center"
          color="geekblue"
          style={{ fontSize: "1.1rem", padding: ".3rem" }}
        >
          Personal Details
        </Tag>
      </div>

      <Form
        {...layout}
        form={form}
        initialValues={values}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item label="Title" name="title" rules={[{ required: false }]}>
          <Select>
            <Option value="None">None</Option>
            <Option value="Mulla">Mulla</Option>
            <Option value="Sheikh">Sheikh</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Other titles"
          name="othertitles"
          rules={[{ required: false }]}
        >
          <Select mode="multiple">
            <Option value="NKD">NKD</Option>
            <Option value="MKD">MKD</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Date of Birth:"
          name="dob"
          rules={[{ required: true, message: "Please input your DOB!" }]}
        >
          <DatePicker style={{ width: "100%", padding: ".2rem" }} />
        </Form.Item>

        <Form.Item
          label="Phone #"
          name="phone"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Address:"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="# Family members (including you)"
          name="familymembers"
          rules={[
            {
              required: true,
              message: "Please input number of family members!",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Move status"
          name="movestatus"
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="Temporary">Temporary</Option>
            <Option value="Permanent">Permanent</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button onClick={prevStep} className="float-left next-btn">
            Back
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="float-right next-btn"
          >
            Next
          </Button>
        </Form.Item>
      </Form>
    </PersonalDetailsWrapper>
  )
}

const PersonalDetailsWrapper = styled.div`
  .next-btn {
    padding-top: 0.2rem;
    padding-bottom: 2.2rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`

export default PersonalDetails
