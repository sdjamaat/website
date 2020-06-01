import React, { useState } from "react"
import { Menu, Divider, Select } from "antd"
import { Row, Col } from "react-bootstrap"
import useWindowDimensions from "../../custom-hooks/window-dimentions"
import styled from "styled-components"
import StickyBox from "react-sticky-box"
import CreateMenu from "../admin/fmb/create-menu/create-menu"
const { SubMenu } = Menu
const { Option, OptGroup } = Select

const UsersPanel = () => {
  return <div>This is the manage users panel.</div>
}

const AdminMenu = ({
  handleChangePanelDesktop,
  handleChangePanelMobile,
  currMenuItem,
}) => {
  const { width } = useWindowDimensions()

  const [currMenu, setCurrMenu] = useState([])

  const handleMenuOpenClose = value => {
    setCurrMenu(value)
  }

  const FullMenu = () => {
    return (
      <Menu
        onSelect={handleChangePanelDesktop}
        openKeys={currMenu}
        onOpenChange={handleMenuOpenClose}
        selectedKeys={[currMenuItem]}
        mode={width > 991 && "inline"}
      >
        <Menu.Item key="users">Manage Users</Menu.Item>
        <SubMenu key="fmb" title="Faiz-ul-Mawaid">
          <Menu.Item key="fmb-create-menu">Create Menu</Menu.Item>
          <Menu.Item key="fmb-view-menus">View Menus</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }

  const SelectMenu = () => {
    return (
      <>
        <Row style={{ marginBottom: "2rem" }}>
          <Col xs={2}>
            <div style={{ textAlign: "center", fontSize: "1.2rem" }}>Menu:</div>
          </Col>

          <Col xs={10}>
            <Select
              autoFocus={true}
              defaultValue="users"
              style={{ width: "100%" }}
              onChange={handleChangePanelMobile}
              value={currMenuItem}
            >
              <Option value="users">Manage Users</Option>
              <OptGroup label="Faiz-ul-Mawaid">
                <Option value="fmb-create-menu">Create Menu</Option>
                <Option value="fmb-view-menus">View Menu</Option>
              </OptGroup>
            </Select>
          </Col>
        </Row>
      </>
    )
  }

  if (width <= 991) {
    return <SelectMenu />
  } else {
    return (
      <StickyBox offsetTop={30}>
        <FullMenu />
      </StickyBox>
    )
  }
}

const Admin = () => {
  const [panel, setPanel] = useState("users")
  const handleChangePanelDesktop = event => {
    setPanel(event.key)
  }

  const handleChangePanelMobile = value => {
    setPanel(value)
  }

  const getPanel = panel => {
    switch (panel) {
      case "fmb-create-menu":
        return <CreateMenu />
      case "fmb-view-menus":
        return <div>This is view menus panel</div>
      case "users":
        return <UsersPanel />
      default:
        return <div>Welcome to the Admin Panel</div>
    }
  }

  return (
    <AdminWrapper>
      <Divider style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0" }}>Admin Panel</h2>
      </Divider>
      <Row>
        <Col lg={3}>
          <AdminMenu
            handleChangePanelDesktop={handleChangePanelDesktop}
            handleChangePanelMobile={handleChangePanelMobile}
            currMenuItem={panel}
          />
        </Col>
        <Col lg={9}>{getPanel(panel)}</Col>
      </Row>
    </AdminWrapper>
  )
}

const AdminWrapper = styled.div``

export default Admin
