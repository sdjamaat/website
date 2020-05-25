import React, { useContext } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { Nav, Navbar, NavDropdown } from "react-bootstrap"
import styled from "styled-components"
import Img from "gatsby-image"
import { AuthContext } from "../provider/auth-context"

const Navigation = ({ logo }) => {
  const { isLoggedIn, signOut, getAuthUser } = useContext(AuthContext)
  // const logo = useStaticQuery(graphql`
  //   query {
  //     file(relativePath: { eq: "logo_small_black.png" }) {
  //       childImageSharp {
  //         fixed(width: 92) {
  //           ...GatsbyImageSharpFixed
  //         }
  //       }
  //     }
  //   }
  // `)

  return (
    <NavbarWrapper>
      <Navbar collapseOnSelect sticky="top" bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          <Img fixed={logo} alt="Small logo" className="logo" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ml-auto">
            <Nav.Link className="navlink" eventKey="1" as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link
              className="navlink"
              eventKey="2"
              as={Link}
              to="/committees"
            >
              Committees
            </Nav.Link>
            {!isLoggedIn() && (
              <Nav.Link className="navlink" eventKey="3" as={Link} to="/login">
                Login
              </Nav.Link>
            )}
            {!isLoggedIn() && (
              <Nav.Link
                className="navlink"
                eventKey="4"
                as={Link}
                to="/register"
              >
                Register
              </Nav.Link>
            )}
            {isLoggedIn() && (
              <NavDropdown
                title={getAuthUser().firstname}
                alignRight
                id="basic-nav-dropdown"
                className="navlink"
              >
                <NavDropdown.Item
                  className="dropdown navlink"
                  style={{ color: "gray" }}
                  as={Link}
                  to="/auth/profile"
                >
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                  className="dropdown navlink"
                  style={{ color: "gray" }}
                  as={Link}
                  to="/auth/faiz"
                >
                  Faiz-ul-Mawaid
                </NavDropdown.Item>
                {getAuthUser().permissions.admin && (
                  <NavDropdown.Item
                    className="dropdown navlink"
                    style={{ color: "gray" }}
                    as={Link}
                    to="/auth/admin"
                  >
                    Admin Panel
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item
                  className="dropdown navlink"
                  style={{ color: "gray" }}
                  onClick={signOut}
                >
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </NavbarWrapper>
  )
}

const NavbarWrapper = styled.div`
  .dropdown:active {
    background-color: transparent;
  }
  .logo {
    margin-bottom: -0.6rem;
  }
  .navlink {
    font-size: 1.3rem;
  }
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 20px 0 rgba(0, 0, 0, 0.19);
`

export default Navigation
