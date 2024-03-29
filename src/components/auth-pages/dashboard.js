import React, { useState, useContext } from "react"
import { Menu, Divider, Select, Form } from "antd"
import { Row, Col } from "react-bootstrap"
import useWindowDimensions from "../../custom-hooks/window-dimentions"
import styled from "styled-components"
import Calendar from "../dashboard/fmb/calendar/menu-calendar"
import SubmitFMBMenu from "../dashboard/fmb/submit-menu/submit-menu"
import ViewSelections from "../dashboard/fmb/view-selections/view-selections"
import Profile from "../dashboard/profile/profile"
import QHForms from "../dashboard/qardan/forms/qh-forms"
import { AuthContext } from "../../provider/auth-context"
import StickyBox from "react-sticky-box"
import useQueryParam from "../../custom-hooks/use-query-params"

const { SubMenu } = Menu
const { Option, OptGroup } = Select

const DashboardMenu = ({
  handleChangePageDesktop,
  handleChangePageMobile,
  currMenuItem,
}) => {
  const { width } = useWindowDimensions()

  const { currUser } = useContext(AuthContext)

  const [currMenuKey, setCurrMenuKey] = useState(["fmb", "qh"])

  const handleMenuOpenClose = value => {
    setCurrMenuKey(value)
  }

  const FullMenu = () => {
    return (
      <Menu
        onSelect={handleChangePageDesktop}
        openKeys={currMenuKey}
        onOpenChange={handleMenuOpenClose}
        selectedKeys={[currMenuItem]}
        mode={width > 991 && "inline"}
      >
        <Menu.Item key="profile">Profile</Menu.Item>

        <SubMenu key="fmb" title="Faiz-ul-Mawaid il-Burhaniyah">
          <Menu.Item key="fmb-calendar">Menu Calendar</Menu.Item>
          {currUser.family.fmb.enrolled && (
            <Menu.Item key="fmb-submit-choices">
              Submit Thaali Choices
            </Menu.Item>
          )}
          {currUser.family.fmb.enrolled && (
            <Menu.Item key="fmb-view-selections">View Selections</Menu.Item>
          )}
        </SubMenu>
        <SubMenu key="qh" title="Burhani Qardan Hasana">
          <Menu.Item key="qh-forms">Application Forms</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }

  const SelectDropdownMenu = () => {
    return (
      <>
        <Row style={{ marginBottom: "2rem" }}>
          <Col xs={2}>
            <div style={{ textAlign: "center", fontSize: "1.2rem" }}>Page:</div>
          </Col>

          <Col xs={10}>
            <Form initialValues={{ mobilemenuitem: currMenuItem }}>
              <Form.Item name="mobilemenuitem">
                <Select
                  style={{ width: "100%" }}
                  onChange={e => handleChangePageMobile(e)}
                >
                  <OptGroup label="User">
                    <Option value="profile">Profile</Option>
                  </OptGroup>

                  <OptGroup label="Faiz-ul-Mawaid il-Burhaniyah">
                    <Option value="fmb-calendar">Menu Calendar</Option>
                    {currUser.family.fmb.enrolled && (
                      <>
                        <Option value="fmb-submit-choices">
                          Submit Thaali Choices
                        </Option>
                        <Option value="fmb-view-selections">
                          View Selections
                        </Option>
                      </>
                    )}
                  </OptGroup>

                  <OptGroup label="Burhani Qardan Hasana">
                    <Option value="qh-forms">Application Forms</Option>
                  </OptGroup>
                </Select>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </>
    )
  }

  if (width <= 991) {
    return <SelectDropdownMenu />
  } else {
    return (
      <StickyBox offsetTop={30}>
        <FullMenu />
      </StickyBox>
    )
  }
}

const Dashboard = () => {
  const [urlQueryTab, setUrlQueryTab] = useQueryParam("tab", "profile")

  const [page, setPage] = useState(urlQueryTab || "profile")

  const handleChangePageDesktop = event => {
    setPage(event.key)
    setUrlQueryTab(event.key)
  }

  const handleChangePageMobile = value => {
    setPage(value)
    setUrlQueryTab(value)
  }

  const getPage = page => {
    switch (page) {
      case "fmb-calendar":
        return <Calendar />
      case "fmb-submit-choices":
        return <SubmitFMBMenu />
      case "fmb-view-selections":
        return <ViewSelections />
      case "profile":
        return <Profile />
      case "qh-forms":
        return <QHForms />
      default:
        return <div>Welcome to the Admin Panel</div>
    }
  }

  return (
    <DashboardWrapper>
      <Row>
        <Col style={{ marginBottom: "-1.5rem" }} lg={3}>
          <div className="header" style={{ textAlign: "center" }}>
            <h2>Dashboard</h2>
          </div>
          <Divider className="divider-header-content" />
          <DashboardMenu
            handleChangePageDesktop={handleChangePageDesktop}
            handleChangePageMobile={handleChangePageMobile}
            currMenuItem={page}
          />
        </Col>
        <Col className="page-content" lg={9}>
          {getPage(page)}
        </Col>
      </Row>
    </DashboardWrapper>
  )
}

const DashboardWrapper = styled.div`
  ul.ant-menu {
    background-color: white;
  }
  .divider-header-content {
    margin-top: 1rem;
    margin-bottom: 2rem;
    @media only screen and (min-width: 991px) {
      display: none;
    }
  }
  .header {
    margin: 1rem;
    margin-bottom: 1rem;
    @media only screen and (min-width: 991px) {
      margin: 1.7rem 0rem 1.7rem 0rem;
      h2 {
        font-size: 1.8rem;
      }
    }
  }

  .page-content {
    @media only screen and (min-width: 991px) {
      margin-top: 1.7rem;
    }
  }
`

export default Dashboard
