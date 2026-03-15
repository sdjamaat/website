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
import { getEffectiveMaxSize, canSelectSize } from "../../../../../utils/thaali-sizes"
import moment from "moment"
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

const SelectItems = ({ setPanel, items, values, setValues }: SelectItemsProps) => {
  const [distDateMap, setDistDateMap] = useState<Map<string, DistributionDateMetadata>>(new Map())
  const [selectItemsForm] = Form.useForm()
  const [groupToggle, setGroupToggle] = useState(values["group-toggle"] || "calendar-date")
  const [isLoading, setIsLoading] = useState(true)
  const { currUser } = useContext(AuthContext)
  const userFamilyThaaliSize = currUser.family.fmb.thaaliSize

  const canSelectGivenThaaliSize = (thaaliSize: SelectToggleType, itemMaxSize?: string | null) => {
    if (thaaliSize === "No Thaali" || thaaliSize === "individual") return true
    const effectiveMax = getEffectiveMaxSize(userFamilyThaaliSize, itemMaxSize)
    return canSelectSize(thaaliSize, effectiveMax)
  }


  const onFinish = (formValues: FormValues) => {
    setValues({ ...formValues, distDateMap })
    setPanel("review")
  }

  const onGroupToggleChange = (event: any) => {
    setGroupToggle(event.target.value as GroupToggle)
  }

  const onSelectToggleChange = (event: any) => {
    const toggleValue = event.target.value as SelectToggleType
    if (toggleValue !== "individual") {
      let newItemPreferences: FormValues = selectItemsForm.getFieldsValue()
      for (const item of items) {
        if (!item.nothaali && newItemPreferences.items) {
          if (toggleValue === "No Thaali") {
            (newItemPreferences.items as any)[item.id] = toggleValue
          } else {
            // Auto-clamp to item's effective max if the selected size exceeds it
            const itemMax = item.sizeRestrictionEnabled ? item.maxSize : undefined
            const effectiveMax = getEffectiveMaxSize(userFamilyThaaliSize, itemMax)
            const allowed = canSelectSize(toggleValue, effectiveMax)
            ;(newItemPreferences.items as any)[item.id] = allowed ? toggleValue : effectiveMax
          }
        }
      }
      selectItemsForm.setFieldsValue(newItemPreferences)
    }
  }

  const onValuesChange = (changed: FormValues) => {
    if (changed.items && selectItemsForm.getFieldValue("select-toggle") !== "individual") {
      selectItemsForm.setFieldsValue({ ...changed.items, "select-toggle": "individual" })
    }
  }

  const getDistDate = (date: string): string => {
    let thaaliDate = moment(date, "MM-DD-YYYY")
    if (thaaliDate.day() === 4 || thaaliDate.day() === 0) {
      thaaliDate = thaaliDate.subtract(1, "days")
    } else if (thaaliDate.day() === 5 || thaaliDate.day() === 1) {
      thaaliDate = thaaliDate.subtract(2, "days")
    } else if (thaaliDate.day() === 2) {
      thaaliDate = thaaliDate.subtract(3, "days")
    }
    return thaaliDate.format("MM-DD-YYYY")
  }

  const setUpDistDateMap = () => {
    setIsLoading(true)
    let newDistDateMap = new Map<string, DistributionDateMetadata>()
    let setOfDistributionDates = new Set()
    for (let item of items) {
      const distDate = getDistDate(item.date)
      const isFirstEntryForDistDate = !setOfDistributionDates.has(distDate)
      setOfDistributionDates.add(distDate)
      newDistDateMap.set(item.id, { distDate, isFirstItem: isFirstEntryForDistDate })
    }
    setDistDateMap(newDistDateMap)
    setIsLoading(false)
  }

  useEffect(() => {
    setUpDistDateMap()
  }, [])

  return (
    <SelectItemsWrapper>
      <div style={{ textAlign: "center" }}>
        <Tag className="float-center" color="geekblue" style={{ fontSize: "1.1rem", padding: ".3rem", marginBottom: "1.5rem" }}>
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
        onValuesChange={(changed) => onValuesChange(changed)}
      >
        <Form.Item name="group-toggle" label="View selections by:">
          <Radio.Group onChange={onGroupToggleChange}>
            <Radio value="calendar-date">Calendar Date</Radio>
            <Radio value="distribution-date">Distribution Date</Radio>
          </Radio.Group>
        </Form.Item>
        <Divider />
        <Form.Item name="select-toggle" label="Toggle size (for all items)">
          <Radio.Group onChange={onSelectToggleChange}>
            <Radio value="individual">Individual selection</Radio>
            {canSelectGivenThaaliSize("Grand") && <Radio value="Grand">Grand</Radio>}
            {canSelectGivenThaaliSize("Full") && <Radio value="Full">Full</Radio>}
            {canSelectGivenThaaliSize("Half") && <Radio value="Half">Half</Radio>}
            {canSelectGivenThaaliSize("Quarter") && <Radio value="Quarter">Quarter</Radio>}
            <Radio value="No Thaali">No Thaali</Radio>
          </Radio.Group>
        </Form.Item>
        <Divider />

        {!isLoading && items.map((item, index) => {
          const metadata = distDateMap.get(item.id)
          if (!metadata) return null
          const { distDate, isFirstItem } = metadata
          const shouldShowDistDate = isFirstItem && groupToggle === "distribution-date"
          if (!item.nothaali) {
            return (
              <div key={item.id}>
                {shouldShowDistDate && (
                  <p style={{ marginBottom: ".5rem", marginTop: index > 0 ? "2.7rem" : "1rem", color: "#4169e1", fontSize: "1.3rem" }}>
                    Distribution on {moment(distDate, "MM-DD-YYYY").format("dddd, MMMM Do YYYY")}
                  </p>
                )}
                <div style={{ fontSize: "1.2rem", paddingBottom: ".5rem" }}>
                  {item.name}
                  {item.sizeRestrictionEnabled && item.maxSize && (
                    <span style={{ fontSize: "0.8rem", color: "#faad14", marginLeft: "0.5rem" }}>(max: {item.maxSize})</span>
                  )}
                </div>
                {groupToggle === "calendar-date" && (
                  <p style={{ marginBottom: ".5rem", marginTop: "-.5rem", color: "gray" }}>
                    {moment(item.date, "MM-DD-YYYY").format("dddd, MMMM Do YYYY")}
                  </p>
                )}
                <Form.Item key={index} name={["items", item.id]} rules={[{ required: true, message: "Please input thaali size" }]}>
                  <Select style={{ width: "100%" }}>
                    {canSelectGivenThaaliSize("Grand", item.sizeRestrictionEnabled ? item.maxSize : undefined) && <Option value="Grand">Grand</Option>}
                    {canSelectGivenThaaliSize("Full", item.sizeRestrictionEnabled ? item.maxSize : undefined) && <Option value="Full">Full</Option>}
                    {canSelectGivenThaaliSize("Half", item.sizeRestrictionEnabled ? item.maxSize : undefined) && <Option value="Half">Half</Option>}
                    {canSelectGivenThaaliSize("Quarter", item.sizeRestrictionEnabled ? item.maxSize : undefined) && <Option value="Quarter">Quarter</Option>}
                    <Option value="No Thaali">No Thaali</Option>
                  </Select>
                </Form.Item>
              </div>
            )
          }
          return null
        })}
        <Button onClick={() => { setValues({ "select-toggle": "individual", "group-toggle": groupToggle, distDateMap } as any); setPanel("start") }} className="float-left next-btn">
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" className="float-right next-btn">
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
