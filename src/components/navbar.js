import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { Nav, Navbar } from "react-bootstrap"
import styled from "styled-components"
import Img from "gatsby-image"

const Navigation = () => {
  const logo = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "logo_small_black.png" }) {
        childImageSharp {
          fixed(width: 92) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  return (
    <NavbarWrapper>
      <Navbar collapseOnSelect sticky="top" bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          <Img
            fixed={logo.file.childImageSharp.fixed}
            alt="Small logo"
            className="logo"
          />
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
  .logo {
    margin-bottom: -0.6rem;
  }
  .navlink {
    font-size: 1.3rem;
  }
`

export default Navigation