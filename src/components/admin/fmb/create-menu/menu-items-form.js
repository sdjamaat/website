import React, { useState } from "react"
import styled from "styled-components"
import { onFinishFailed } from "../../../../functions/forms"
import {
  Form,
  Button,
  Tag,
  message,
  Input,
  DatePicker,
  Space,
  Divider,
  Checkbox,
} from "antd"

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const MenuItemsForm = ({
  setStep,
  values,
  setValues,
  disabledValues,
  setDisabledValues,
}) => {
  const [menuItemsForm] = Form.useForm()

  // this is an array that tracks which 'name' inputs should be disabled
  const [disabledItems, setDisabledItems] = useState(disabledValues)

  /*
    After form is completed, save values, disabled inputs array, and move on to review screen
    The items array can be potentially empty if no items have been added, thus we check if it's length > 0
  */
  const onFinish = values => {
    if (values.items.length > 0) {
      setValues(values)
      setDisabledValues(disabledItems)
      setStep("reviewmenu")
    } else {
      message.error("Error: No items added to menu")
    }
  }

  /* 
    Save form values when 'back' button is clicked
  */
  const saveForm = () => {
    setValues(menuItemsForm.getFieldsValue())
    setDisabledValues(disabledItems)
    return
  }

  /*
    Handle action when 'No Thaali' checkbox is clicked
    'key' = index of item in items array
  */
  const handleCheckBox = (event, key) => {
    // get and duplicate the current form values
    let newItemsArr = menuItemsForm.getFieldsValue()

    // if the no thali checkbox is checked, then modify item name at index 'key' to "None"
    // also add the 'key' to the disabled items array so that 'name' field is disabled
    if (event.target.checked) {
      newItemsArr.items[key].name = "None"
      setDisabledItems([...disabledItems, key])
    } else {
      // if the checkbox is not checked, then we want to remove that item from the disabled items array
      // also set the name to undefined, like how it was initially
      let newDisabledItems = [...disabledItems]
      newDisabledItems = newDisabledItems.filter(item => {
        return item !== key
      })
      setDisabledItems([...newDisabledItems])
      newItemsArr.items[key].name = undefined
    }
    // set new field values
    menuItemsForm.setFieldsValue(newItemsArr)
  }

  const resetDisabledItemsArrayAfterItemDelete = async () => {
    let fieldValuesAfterRemoval = menuItemsForm.getFieldsValue().items
    // js is weird, had to put this for loop inside an async function
    // don't want to set the items in state before processing
    const getNewDisabledItemsArr = async () => {
      let newDisabledItems = []
      for (let i = 0; i < fieldValuesAfterRemoval.length; i++) {
        if (fieldValuesAfterRemoval[i].name === "None") {
          newDisabledItems.push(i)
        }
      }
      return newDisabledItems
    }
    const newDisabledItemsArr = await getNewDisabledItemsArr()
    setDisabledItems(newDisabledItemsArr)
  }

  return (
    <MenuItemsWrapper>
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
          Enter Items
        </Tag>
      </div>

      <Form
        {...layout}
        initialValues={values}
        form={menuItemsForm}
        onFinishFailed={() => onFinishFailed(menuItemsForm)}
        onFinish={onFinish}
      >
        <Form.List name="items">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <Space key={field.key} direction="vertical">
                    <div>{`Item #${index + 1}`}</div>
                    <Form.Item
                      {...field}
                      name={[field.name, "name"]}
                      fieldKey={[field.fieldKey, "name"]}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please input menu item name",
                        },
                      ]}
                      style={{ marginBottom: ".5rem" }}
                    >
                      <Input
                        disabled={disabledItems.includes(field.name)}
                        placeholder="Enter name"
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "date"]}
                      fieldKey={[field.fieldKey, "date"]}
                      rules={[
                        {
                          required: true,

                          message: "Please input menu item date",
                        },
                      ]}
                      style={{ marginBottom: ".5rem" }}
                    >
                      <DatePicker
                        style={{ width: "100%", paddingBottom: ".4rem" }}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, "nothali"]}
                      fieldKey={[field.fieldKey, "nothali"]}
                      valuePropName="checked"
                      style={{ marginBottom: "0rem" }}
                    >
                      <Checkbox
                        onChange={event => handleCheckBox(event, field.name)}
                      >
                        No Thaali
                      </Checkbox>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: "-.5rem" }}>
                      <Button
                        danger
                        onClick={async () => {
                          // reset disabled items array after removing an item
                          // using the fields value after removal to determine which indexes are still disabled
                          await remove(field.name)

                          //reset the disabled items array
                          await resetDisabledItemsArrayAfterItemDelete()
                        }}
                        style={{ width: "100%" }}
                      >
                        Delete
                      </Button>
                    </Form.Item>

                    <Divider style={{ marginBottom: ".8rem" }} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add()
                    }}
                    style={{ width: "100%" }}
                  >
                    Add Item
                  </Button>
                </Form.Item>
              </div>
            )
          }}
        </Form.List>

        <Form.Item>
          <Button
            onClick={async () => {
              await saveForm()
              setStep("hijrimonth")
            }}
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
    </MenuItemsWrapper>
  )
}

const MenuItemsWrapper = styled.div`
  .next-btn {
    padding-top: 0.2rem;
    padding-bottom: 2.2rem;
    font-size: 1.2rem;
    margin-top: 1rem;
  }

  div > .ant-space {
    width: 100%;
  }
`

export default MenuItemsForm
