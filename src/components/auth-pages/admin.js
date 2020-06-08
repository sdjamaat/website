import React, { useState } from "react"
import { Menu, Divider, Select, message, Form } from "antd"
import { Row, Col } from "react-bootstrap"
import useWindowDimensions from "../../custom-hooks/window-dimentions"
import styled from "styled-components"
import StickyBox from "react-sticky-box"
import CreateMenu from "../admin/fmb/create-menu/create-menu"
import ManageMenus from "../admin/fmb/manage-menus/manage-menus"
import firebase from "gatsby-plugin-firebase"
const momentHijri = require("moment-hijri")
const { SubMenu } = Menu
const { Option, OptGroup } = Select

const UsersPanel = () => {
  return <div>This is the manage users panel.</div>
}

const AdminMenu = ({
  handleChangePageDesktop,
  handleChangePageMobile,
  currMenuItem,
}) => {
  const { width } = useWindowDimensions()

  const [currMenuKey, setCurrMenuKey] = useState([])

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
        <Menu.Item key="users">Manage Users</Menu.Item>
        <SubMenu key="fmb" title="Faiz-ul-Mawaid">
          <Menu.Item key="fmb-create-menu">Create Menu</Menu.Item>
          <Menu.Item key="fmb-manage-menus">Manage Menus</Menu.Item>
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
                  <OptGroup label="Users">
                    <Option value="users">Manage Users</Option>
                  </OptGroup>

                  <OptGroup label="Faiz-ul-Mawaid">
                    <Option value="fmb-create-menu">Create Menu</Option>
                    <Option value="fmb-manage-menus">Manage Menus</Option>
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

const Admin = () => {
  const [page, setPage] = useState("users")
  const [menus, setMenus] = useState([])
  const [
    shouldFetchMenusFromFirebase,
    setShouldFetchMenusFromFirebase,
  ] = useState(true)

  const handleChangePageDesktop = event => {
    setPage(event.key)
  }

  const handleChangePageMobile = value => {
    setPage(value)
  }

  const getMenus = async () => {
    if (shouldFetchMenusFromFirebase) {
      let updatedMenus = []
      const currentHijriYear = momentHijri().iYear()
      try {
        const queryForFmbHijriDoc = await firebase
          .firestore()
          .collection("fmb")
          .doc(currentHijriYear.toString())

        const yearCollection = await queryForFmbHijriDoc.get()
        if (yearCollection.exists) {
          const menusFromFirebase = await queryForFmbHijriDoc
            .collection("menus")
            .get()

          menusFromFirebase.forEach(doc => {
            let formattedDocData = {
              ...doc.data(),
              year:
                doc.id === "moharram" ? currentHijriYear + 1 : currentHijriYear,
              month: doc.id,
            }
            updatedMenus.push(formattedDocData)
          })
        } else {
          message.error("Error fetching menus")
        }
      } catch (error) {
        console.log("Error getting documents", error)
      }
      setMenus(updatedMenus)
      setShouldFetchMenusFromFirebase(false)
      return updatedMenus
    } else {
      return menus
    }
  }

  const getPage = page => {
    switch (page) {
      case "fmb-create-menu":
        return (
          <CreateMenu
            setPage={setPage}
            refetchMenus={setShouldFetchMenusFromFirebase}
          />
        )
      case "fmb-manage-menus":
        return (
          <ManageMenus
            getMenus={getMenus}
            refetchMenus={setShouldFetchMenusFromFirebase}
            setMenusInAdminComp={setMenus}
          />
        )
      case "users":
        return <UsersPanel />
      default:
        return <div>Welcome to the Admin Panel</div>
    }
  }

  return (
    <AdminWrapper>
      <Row>
        <Col style={{ marginBottom: "-1.5rem" }} lg={3}>
          <div className="header" style={{ textAlign: "center" }}>
            <h2>Admin Panel</h2>
          </div>
          <Divider className="divider-header-content" />
          <AdminMenu
            handleChangePageDesktop={handleChangePageDesktop}
            handleChangePageMobile={handleChangePageMobile}
            currMenuItem={page}
          />
        </Col>
        <Col className="page-content" lg={9}>
          {getPage(page)}
        </Col>
      </Row>
    </AdminWrapper>
  )
}

const AdminWrapper = styled.div`
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

export default Admin
