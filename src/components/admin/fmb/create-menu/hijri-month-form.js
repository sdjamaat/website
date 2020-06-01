import React from "react"
import styled from "styled-components"
import { Form, Button, Tag, Select } from "antd"
import { onFinishFailed } from "../../../../functions/forms"
import {
  shortMonthToLongMonth,
  shortMonthNames,
} from "../../../../functions/calendar"
const momentHijri = require("moment-hijri")
const { Option } = Select

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const HijriMonthForm = ({ monthsFinished, setStep, values, setValues }) => {
  const [hijriMonthForm] = Form.useForm()
  const currentMonth = momentHijri().iMonth()

  const onFinish = values => {
    setValues(values)
    setStep("menuitems")
  }

  return (
    <HijriMonthWrapper>
      <div style={{ textAlign: "center" }}>
        <Tag
          className="float-center"
          color="geekblue"
          style={{ fontSize: "1.1rem", padding: ".3rem", marginBottom: "1rem" }}
        >
          Choose Month
        </Tag>
      </div>

      <Form
        {...layout}
        initialValues={values}
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="float-right next-btn"
          >
            Next
          </Button>
        </Form.Item>
      </Form>
    </HijriMonthWrapper>
  )
}

const HijriMonthWrapper = styled.div`
  .next-btn {
    padding-top: 0.2rem;
    padding-bottom: 2.2rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`

export default HijriMonthForm
