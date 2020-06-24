import React, { useState } from "react"
import { Form, Button, Tag, Select, Radio, Divider } from "antd"
import { Row, Col } from "react-bootstrap"
import { onFinishFailed } from "../../../../../functions/forms"
import styled from "styled-components"
const moment = require("moment")
const { Option } = Select

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const SelectItems = ({ setPanel, items, values, setValues }) => {
  const [selectItemsForm] = Form.useForm()

  const onFinish = values => {
    setValues(values)
    setPanel("review")
  }

  const onSelectToggleChange = event => {
    const toggleValue = event.target.value

    if (toggleValue !== "individual") {
      let newItemPreferences = selectItemsForm.getFieldsValue()
      for (let key in newItemPreferences.items) {
        newItemPreferences.items[key] = toggleValue
      }
      selectItemsForm.setFieldsValue(newItemPreferences)
    }
  }

  // in case the user changes an item value but the 'select-toggle' value is not on individual select
  const onValuesChange = changed => {
    if (
      changed.items &&
      selectItemsForm.getFieldValue("select-toggle") !== "individual"
    ) {
      selectItemsForm.setFieldsValue({
        ...changed.items,
        "select-toggle": "individual",
      })
    }
  }
  return (
    <SelectItemsWrapper>
      <div style={{ textAlign: "center" }}>
        <Tag
          className="float-center"
          color="geekblue"
          style={{
            fontSize: "1.1rem",
            padding: ".3rem",
            marginBottom: "1.5rem",
          }}
        >
          Select Item Sizes
        </Tag>
      </div>

      <Form
        {...layout}
        initialValues={values}
        form={selectItemsForm}
        onFinish={onFinish}
        onFinishFailed={() => onFinishFailed(selectItemsForm)}
        layout="vertical"
        hideRequiredMark={true}
        onValuesChange={changed => onValuesChange(changed)}
      >
        <Form.Item name="select-toggle" label="Toggle size (for all items)">
          <Radio.Group onChange={event => onSelectToggleChange(event)}>
            <Radio value="individual">Individual selection</Radio>
            <Radio value="Full">Full</Radio>
            <Radio value="Half">Half</Radio>
            <Radio value="Barakati">Barakati</Radio>
            <Radio value="No Thaali">No Thaali</Radio>
          </Radio.Group>
        </Form.Item>
        <Divider />

        {items.map((item, index) => {
          if (!item.nothaali) {
            return (
              <div key={index}>
                <div style={{ fontSize: "1.2rem", paddingBottom: ".5rem" }}>
                  {item.name}
                </div>
                <p
                  style={{
                    marginBottom: ".5rem",
                    marginTop: "-.5rem",
                    color: "gray",
                  }}
                >
                  {moment(item.date, "MM-DD-YYYY").format("dddd, MMMM Do YYYY")}
                </p>
                <Form.Item
                  key={index}
                  name={["items", item.id]}
                  rules={[
                    { required: true, message: "Please input thaali size" },
                  ]}
                >
                  <Select style={{ width: "100%" }}>
                    <Option value="Full">Full</Option>
                    <Option value="Half">Half</Option>
                    <Option value="Barakati">Barakati</Option>
                    <Option value="No Thaali">No Thaali</Option>
                  </Select>
                </Form.Item>
              </div>
            )
          } else {
            return null
          }
        })}
        <Button
          onClick={() => {
            setValues({
              "select-toggle": "individual",
            })
            setPanel("start")
          }}
          className="float-left next-btn"
        >
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          className="float-right next-btn"
        >
          Review
        </Button>
      </Form>
    </SelectItemsWrapper>
  )
}

const SelectItemsWrapper = styled.div`
  #select-toggle > label.ant-radio-wrapper > span.ant-radio {
    margin-bottom: 0.13rem;
  }
`

export default SelectItems
