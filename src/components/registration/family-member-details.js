import React from "react"
import styled from "styled-components"
import {
  Form,
  Input,
  Button,
  InputNumber,
  Tag,
  Select,
  Card,
  DatePicker,
} from "antd"

const FamilyMemberInfoForm = ({ index }) => {
  return (
    <>
      <Card
        title={`Family Member ${index + 1}`}
        headStyle={{ textAlign: "center" }}
        style={{ marginBottom: "1rem" }}
      >
        <Form.Item
          label={`First name`}
          name={["members", index, "firstname"]}
          rules={[
            {
              required: true,
              message: "Please input family member first name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={`Last name`}
          name={["members", index, "lastname"]}
          rules={[
            {
              required: true,
              message: "Please input family member last name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={`YOB`}
          name={["members", index, "yob"]}
          rules={[
            {
              required: true,
              message: "Please input family member YOB",
            },
          ]}
        >
          <DatePicker
            picker="year"
            style={{ width: "100%", padding: ".3rem" }}
          />
        </Form.Item>

        <Form.Item label={`ITS #`} name={["members", index, "its"]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Card>
    </>
  )
}

const FamilyMemberDetails = ({
  layout,
  setStep,
  values,
  setValues,
  numFamilyMembers,
}) => {
  const [form] = Form.useForm()

  const onFinish = values => {
    setValues(values)
    setStep("review")
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

  const getMemberForms = () => {
    let members = []
    for (let i = 1; i < numFamilyMembers; i++) {
      members.push(<FamilyMemberInfoForm key={i} index={i} />)
    }
    return members
  }

  return (
    <FamilyMemberDetailsWrapper>
      <div style={{ textAlign: "center" }}>
        <Tag
          className="float-center"
          color="geekblue"
          style={{
            fontSize: "1.1rem",
            padding: ".3rem",
            marginBottom: "1rem",
          }}
        >
          Family Member Details
        </Tag>
      </div>

      <Form
        {...layout}
        form={form}
        initialValues={values}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        scrollToFirstError="true"
      >
        {getMemberForms()}
        <Form.Item>
          <Button
            onClick={() => setStep("family-details")}
            className="float-left next-btn"
          >
            Back
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="float-right next-btn"
          >
            Review
          </Button>
        </Form.Item>
      </Form>
    </FamilyMemberDetailsWrapper>
  )
}

const FamilyMemberDetailsWrapper = styled.div`
  .next-btn {
    padding-top: 0.2rem;
    padding-bottom: 2.2rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`

export default FamilyMemberDetails
