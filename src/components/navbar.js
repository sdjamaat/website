import React from "react"
import { Link } from "gatsby"
import { Nav, Navbar } from "react-bootstrap"
import styled from "styled-components"
import logo from "../../static/sdj_logo.png"

const Navigation = () => {
  return (
    <NavbarWrapper>
      <Navbar collapseOnSelect sticky="top" bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="San Digo Jamaat Logo" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ml-auto">
            <Nav.Link className="navlink" eventKey="1" as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link className="navlink" eventKey="2" as={Link} to="/">
              Login
            </Nav.Link>
            <Nav.Link className="navlink" eventKey="3" as={Link} to="/">
              Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </NavbarWrapper>
  )
}

const NavbarWrapper = styled.div`
  img {
    width: 5.8rem;
    height: auto;
  }
  .navlink {
    font-size: 1.3rem;
  }
`

export default Navigation
