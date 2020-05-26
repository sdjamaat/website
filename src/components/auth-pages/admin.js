import React from "react"

import { Menu, Dropdown, Button } from "antd"

import { Row, Col, Container, Jumbotron } from "react-bootstrap"
import ContainerDimensions from "react-container-dimensions"
import useWindowDimensions from "../../custom-hooks/window-dimentions"
import { DownOutlined, UserOutlined } from "@ant-design/icons"
import styled from "styled-components"
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons"

const { SubMenu } = Menu

const AdminMenu = () => {
  const { height, width } = useWindowDimensions()
  console.log(width)
  const handleClick = e => {
    console.log("click ", e)
  }

  const styleForDesktop = {
    height: "100%",
  }

  const FullMenu = () => {
    return (
      <Menu
        onClick={handleClick}
        style={width <= 991 ? {} : styleForDesktop}
        defaultSelectedKeys={["1"]}
        mode={width <= 991 ? "vertical" : "inline "}
      >
        <Menu.Item key="1">Faiz-ul-Mawaid</Menu.Item>
        <Menu.Item key="2">Users</Menu.Item>
        <Menu.Item key="3">Dakheliyah</Menu.Item>
      </Menu>
    )
  }

  const DropdownMenu = () => {
    return (
      <Dropdown
        overlay={FullMenu}
        trigger={["click"]}
        placement="bottomCenter"
        style={{ width: "100%" }}
      >
        <Button style={{ width: "100%", marginBottom: "1rem" }}>Menu</Button>
      </Dropdown>
    )
  }

  if (width <= 991) {
    return <DropdownMenu />
  } else {
    return <FullMenu />
  }
}

const Admin = () => {
  const { height, width } = useWindowDimensions()
  return (
    <AdminWrapper>
      <Jumbotron
        fluid
        style={{
          padding: "1.5rem",
          textAlign: "center",
          borderRadius: 10,
          marginBottom: "1rem",
        }}
      >
        <Container fluid>
          <h2 style={{ marginBottom: 0 }}>Admin Panel</h2>
        </Container>
      </Jumbotron>
      <Row>
        <Col lg={3}>
          <AdminMenu />
        </Col>

        <Col lg={9}>
          <div>
            Lomography is the commercial trademark of Lomographische AG, Austria
            for products and services catering to lo-fi photographers. The name
            is inspired by the former state-run optics manufacturer LOMO PLC of
            Saint Petersburg, Russia. LOMO PLC created and produced the 35mm
            LOMO LC-A Compact Automat camera — which became the centerpiece of
            Lomography’s marketing and sales activities. This camera was loosely
            based upon the Cosina CX-1 and introduced in the early 1980s. In
            1991, the Austrian founders of Lomography discovered the Lomo LC-A.
            They were “charmed by the unique, colorful, and sometimes blurry”
            images that the camera produced. After a series of international art
            exhibitions and marketing, Lomography signed an exclusive
            distribution agreement with LOMO PLC — thereby becoming the sole
            distributor of all Lomo LC-A cameras out. The site also celebrates
            the work of Lomographers with online exhibits and competitions.
            Digital painting is an emerging art form in which traditional
            painting techniques such as watercolor, oils, impasto, etc. are
            applied using digital tools by means of a computer, a digitizing
            tablet and stylus, and software. Traditional painting is painting
            with a physical medium as opposed to a more modern style like
            digital. Digital painting differs from other forms of digital art,
            particularly computer-generated art, in that it does not involve the
            computer rendering from a model. The artist uses painting techniques
            to create the digital painting directly on the computer. All digital
            painting programs try to mimic the use of physical media through
            various brushes and paint effects. Included in many programs are
            brushes that are digitally styled to represent the traditional style
            like oils, acrylics, pastels, charcoal, pen and even media such as
            airbrushing. There are also certain effects unique to each type of
            digital paint which portraying the realistic effects of say
            watercolor on a digital ‘watercolor’ painting. In most digital
            painting programs, the user can create their own brush style using a
            combination of texture and shape. This ability is very important in
            bridging the gap between traditional and digital painting. Digital
            painting thrives mostly in production art. It is most widely used in
            conceptual design for film, television and video games. Digital
            painting software such as Corel Painter, Adobe Photoshop, ArtRage,
            GIMP, Krita and openCanvas give artists a similar environment to a
            physical painter: a canvas, painting tools, mixing palettes, and a
            multitude of color options. There are various types of digital
            painting, including impressionism, realism, and watercolor. There
            are both benefits and drawbacks of digital painting. While digital
            painting allows the artist the ease of working in an organized,
            mess-free environment, some argue there will always be more control
            for an artist holding a physical brush in their hand. Some artists
            believe there is something missing from digital painting, such as
            the character that is unique to every physically made object. Many
            artist post blogs and comment on the various differences between
            digitally created work and traditionally created artwork. The main
            difference between digital and traditional painting is the
            non-linear process. That is, an artist can often arrange their
            painting in layers that can be edited independently. Also, the
            ability to undo and redo strokes frees the artist from a linear
            process. But digital painting is limited in how it employs the
            techniques and study of a traditional painter because of the surface
            differences and lack of physicality. The digital artist has at their
            disposal several tools not available to the traditional painter.
            Some of these include: a virtual palette consisting of millions of
            colors, almost any size canvas or media, and the ability to take
            back mistakes, as well as erasers, pencils, spray cans, brushes,
            combs, and a variety of 2D and 3D effect tools. A graphics tablet
            allows the artist to work with precise hand movements simulating a
            real pen and drawing surface. Even the traditional surface has
            changed for digital painting. Instead of a canvas or sketchbook,
            artists would use a mouse or tablet to display strokes that would
            appear with the touch of a pen to the tablet’s surface, or a click
            of pen. Tablets can be pressure sensitive, allowing the artist to
            vary the intensity of the chosen media on the screen. There are
            tablets with over two thousand different levels of pressure
            sensitivity. The earliest graphical manipulation program was called
            Sketchpad. Created in 1963 by Ivan Sutherland, a grad student at
            MIT, Sketchpad allowed the user to manipulate objects on a CRT
            (cathode ray tube). Sketchpad eventually led to the creation of the
            Rand Tablet for work on the GRAIL project in 1968, and the very
            first tablet was created. Other early tablets, or digitizers, like
            the ID (intelligent digitizer) and the BitPad were commercially
            successful and used in CAD (Computer Aided Design) programs. Modern
            day tablets are the tools of choice by digital painters. WACOM is
            the industry leader in tablets which can range in size from 4” x 6”
            all the way to 12” x 19” and are less than an inch thick. Other
            brands of graphic tablets are Aiptek, Monoprice, Hanvon, Genius,
            Adesso, Trust, Manhattan, Vistablet, DigiPro, etc.
          </div>
        </Col>
      </Row>
    </AdminWrapper>
  )
}

const AdminWrapper = styled.div``

export default Admin
