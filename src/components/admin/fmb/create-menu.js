import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Form, Button, Tag, Select, message, Alert, Input } from "antd"
import { onFinishFailed } from "../../../functions/forms"
import firebase from "gatsby-plugin-firebase"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
const momentHijri = require("moment-hijri")
const { Option } = Select

const longMonthNames = [
  "Moharram al-Haraam",
  "Safar al-Muzaffar",
  "Rabi al-Awwal",
  "Rabi al-Aakhar",
  "Jumada al-Ula",
  "Jumada al-Ukhra",
  "Rajab al-Asab",
  "Shabaan al-Karim",
  "Ramadaan al-Moazzam",
  "Shawwal al-Mukarram",
  "Zilqadah al-Haraam",
  "Zilhaj al-Haraam",
]

const shortMonthNames = [
  "moharram",
  "safar",
  "rabi1",
  "rabi2",
  "jumada1",
  "jumada2",
  "rajab",
  "shabaan",
  "ramadaan",
  "shawwal",
  "zilqadah",
  "zilhaj",
]

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
}

const DynamicFieldSet = () => {
  const onFinish = values => {
    console.log("Received values of form:", values)
  }

  return (
    <Form
      name="dynamic_form_item"
      {...formItemLayoutWithOutLabel}
      onFinish={onFinish}
    >
      <Form.List name="names">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0
                    ? formItemLayout
                    : formItemLayoutWithOutLabel)}
                  label={index === 0 ? "Passengers" : ""}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message:
                          "Please input passenger's name or delete this field.",
                      },
                    ]}
                    noStyle
                  >
                    <Input
                      placeholder="passenger name"
                      style={{ width: "60%" }}
                    />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      style={{ margin: "0 8px" }}
                      onClick={() => {
                        remove(field.name)
                      }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add()
                  }}
                  style={{ width: "60%" }}
                >
                  <PlusOutlined /> Add field
                </Button>
              </Form.Item>
            </div>
          )
        }}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

const HijriMonthForm = ({ monthsFinished }) => {
  const [hijriMonthForm] = Form.useForm()
  const currentMonth = momentHijri().iMonth()

  const onFinish = values => {
    console.log(values)
  }

  const shortMonthToLongMonth = shortMonth => {
    switch (shortMonth) {
      case "moharram":
        return "Moharram al-Haraam"
      case "safar":
        return "Safar al-Muzaffar"
      case "rabi1":
        return "Rabi al-Awwal"
      case "rabi2":
        return "Rabi al-Aakhar"
      case "jumada1":
        return "Jumada al-Ula"
      case "jumada2":
        return "Jumada al-Ukhra"
      case "rajab":
        return "Rajab al-Asab"
      case "shabaan":
        return "Shabaan al-Karim"
      case "ramadaan":
        return "Ramadaan al-Moazzam"
      case "shawwal":
        return "Shawwal al-Mukarram"
      case "zilqadah":
        return "Zilqadah al-Haraam"
      case "zilhaj":
        return "Zilhaj al-Haraam"
      default:
        return ""
    }
  }

  return (
    <Form
      {...layout}
      form={hijriMonthForm}
      onFinish={onFinish}
      onFinishFailed={() => onFinishFailed(hijriMonthForm)}
      layout="vertical"
    >
      <Form.Item
        label="Hijri Month"
        name="hijrimonth"
        rules={[{ required: true, message: "Please input hijri month" }]}
      >
        <Select>
          {shortMonthNames.map((shortMonth, index) => {
            return (
              <Option
                disabled={
                  index < currentMonth || monthsFinished.includes(index)
                }
                value={shortMonth}
                key={index}
              >
                {shortMonthToLongMonth(shortMonth)}
              </Option>
            )
          })}
        </Select>
      </Form.Item>
    </Form>
  )
}

const CreateMenu = () => {
  const [monthsFinished, setMonthsFinished] = useState([])
  const [step, setstep] = useState("hijrimonth")

  const getMonthsFinished = () => {
    firebase
      .firestore()
      .collection("fmb")
      .doc(momentHijri().iYear().toString())
      .get()
      .then(snapshot => {
        setMonthsFinished(snapshot.data().finished)
      })
      .catch(err => {
        console.log("Error getting documents", err)
      })
  }

  useEffect(() => {
    getMonthsFinished()
  })

  const getStep = step => {
    switch (step) {
      case "hijrimonth":
        return <HijriMonthForm monthsFinished={monthsFinished} />
      default:
        return <HijriMonthForm monthsFinished={monthsFinished} />
    }
  }

  return (
    <CreateMenuWrapper>
      <Alert
        message="Create New Menu"
        type="info"
        style={{ textAlign: "center", marginBottom: "1rem" }}
      />
      {getStep(step)}
    </CreateMenuWrapper>
  )
}

const CreateMenuWrapper = styled.div`
  .next-btn {
    padding-top: 0.2rem;
    padding-bottom: 2.2rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`

export default CreateMenu
