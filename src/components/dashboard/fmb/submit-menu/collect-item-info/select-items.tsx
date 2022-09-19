import React, { useContext, useEffect, useState } from "react"
import { Form, Button, Tag, Select, Radio, Divider } from "antd"
import { onFinishFailed } from "../../../../../functions/forms"
import styled from "styled-components"
import { AuthContext } from "../../../../../provider/auth-context"
import {
  DistributionDateMetadata,
  FormValues,
  GroupToggle,
  SelectToggleType,
  ThaaliItem,
  ValuesFromSelectItems,
} from "../../../../../types/typings"
import moment, { MomentCreationData } from "moment"
const { Option } = Select

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

interface SelectItemsProps {
  setPanel: (panelName: "start" | "select-items" | "review") => void
  items: ThaaliItem[]
  values: FormValues
  setValues: (values: ValuesFromSelectItems) => void
}

const SelectItems = ({
  setPanel,
  items,
  values,
  setValues,
}: SelectItemsProps) => {
  const [distDateMap, setDistDateMap] = useState<
    Map<string, DistributionDateMetadata>
  >(new Map())

  const [selectItemsForm] = Form.useForm()

  const [groupToggle, setGroupToggle] = useState(
    values["group-toggle"] || "calendar-date"
  )
  const [isLoading, setIsLoading] = useState(true)

  const { currUser } = useContext(AuthContext)

  const userFamilyThaaliSize = currUser.family.fmb.thaaliSize

  const canSelectGivenThaaliSize = (thaaliSize: SelectToggleType) => {
    if (
      userFamilyThaaliSize === "Full" &&
      (thaaliSize === "Full" ||
        thaaliSize === "Half" ||
        thaaliSize === "Quarter")
    ) {
      return true
    } else if (
      userFamilyThaaliSize === "Half" &&
      (thaaliSize === "Half" || thaaliSize === "Quarter")
    ) {
      return true
    } else if (userFamilyThaaliSize === "Quarter" && thaaliSize === "Quarter") {
      return true
    }

    return false
  }

  const onFinish = (values: FormValues) => {
    setValues({
      ...values,
      distDateMap: distDateMap,
    })
    setPanel("review")
  }

  const onGroupToggleChange = event => {
    const groupToggleValue = event.target.value as GroupToggle
    setGroupToggle(groupToggleValue)
  }

  const onSelectToggleChange = event => {
    const toggleValue = event.target.value as SelectToggleType

    if (toggleValue !== "individual") {
      let newItemPreferences: FormValues = selectItemsForm.getFieldsValue()
      for (let key in newItemPreferences.items) {
        newItemPreferences.items[key] = toggleValue
      }
      selectItemsForm.setFieldsValue(newItemPreferences)
    }
  }

  // in case the user changes an item value but the 'select-toggle' value is not on individual select
  const onValuesChange = (changed: FormValues) => {
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

  const getDistDate = (date: string): string => {
    let thaaliDate = moment(date, "MM-DD-YYYY")
    // distribution days are on Monday and Thursday (1 and 4 according to momentjs)
    // if it's Friday or Tuesday, subtract one day to get the distribution day
    if (thaaliDate.day() === 2 || thaaliDate.day() === 5) {
      thaaliDate = thaaliDate.subtract(1, "days")
      // if it's Wednesday or Saturday, subtract two days to get the distribution day
    } else if (thaaliDate.day() === 3 || thaaliDate.day() === 6) {
      thaaliDate = thaaliDate.subtract(2, "days")
    } else if (thaaliDate.day() === 0) {
      // if it's Sunday, subtract 3 days to get the distribution day
      thaaliDate = thaaliDate.subtract(3, "days")
    }

    const formattedNewDate = thaaliDate.format("MM-DD-YYYY")

    return formattedNewDate
  }

  const setUpDistDateMap = () => {
    setIsLoading(true)
    let distDateMap = new Map<string, DistributionDateMetadata>()
    let setOfDistributionDates = new Set()
    for (let item of items) {
      const distDate = getDistDate(item.date)
      console.log("dist date", distDate)
      const isFirstEntryForDistDate =
        setOfDistributionDates.has(distDate) === false
      setOfDistributionDates.add(distDate)
      distDateMap.set(item.id, {
        distDate: distDate,
        isFirstItem: isFirstEntryForDistDate,
      })
    }
    setDistDateMap(distDateMap)
    console.log("dist date map", distDateMap)
    setIsLoading(false)
  }

  useEffect(() => {
    setUpDistDateMap()
  }, [])

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
        <Form.Item name="group-toggle" label="View selections by:">
          <Radio.Group onChange={event => onGroupToggleChange(event)}>
            <Radio value="calendar-date">Calendar Date</Radio>
            <Radio value="distribution-date">Distribution Date</Radio>
          </Radio.Group>
        </Form.Item>
        <Divider />
        <Form.Item name="select-toggle" label="Toggle size (for all items)">
          <Radio.Group onChange={event => onSelectToggleChange(event)}>
            <Radio value="individual">Individual selection</Radio>
            {canSelectGivenThaaliSize("Full") && (
              <Radio value="Full">Full</Radio>
            )}
            {canSelectGivenThaaliSize("Half") && (
              <Radio value="Half">Half</Radio>
            )}
            {canSelectGivenThaaliSize("Quarter") && (
              <Radio value="Quarter">Quarter</Radio>
            )}

            <Radio value="No Thaali">No Thaali</Radio>
          </Radio.Group>
        </Form.Item>
        <Divider />

        {!isLoading &&
          items.map((item, index) => {
            const { distDate, isFirstItem } = distDateMap.get(item.id)
            if (!item.nothaali) {
              return (
                <div key={index}>
                  {groupToggle === "distribution-date" && isFirstItem && (
                    <p
                      style={{
                        marginBottom: ".5rem",
                        marginTop: `${index > 0 ? "2.7rem" : "1rem"}`,
                        color: "#4169e1",
                        fontSize: "1.3rem",
                      }}
                    >
                      Distribution on{" "}
                      {moment(distDate, "MM-DD-YYYY").format(
                        "dddd, MMMM Do YYYY"
                      )}
                    </p>
                  )}
                  <div style={{ fontSize: "1.2rem", paddingBottom: ".5rem" }}>
                    {item.name}
                  </div>

                  {groupToggle === "calendar-date" && (
                    <p
                      style={{
                        marginBottom: ".5rem",
                        marginTop: "-.5rem",
                        color: "gray",
                      }}
                    >
                      {moment(item.date, "MM-DD-YYYY").format(
                        "dddd, MMMM Do YYYY"
                      )}
                    </p>
                  )}

                  <Form.Item
                    key={index}
                    name={["items", item.id]}
                    rules={[
                      { required: true, message: "Please input thaali size" },
                    ]}
                  >
                    <Select style={{ width: "100%" }}>
                      {canSelectGivenThaaliSize("Full") && (
                        <Option value="Full">Full</Option>
                      )}
                      {canSelectGivenThaaliSize("Half") && (
                        <Option value="Half">Half</Option>
                      )}
                      {canSelectGivenThaaliSize("Quarter") && (
                        <Option value="Quarter">Quarter</Option>
                      )}
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
              "group-toggle": groupToggle,
              distDateMap: distDateMap,
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
