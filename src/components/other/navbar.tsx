import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { Nav, Navbar, NavDropdown, Collapse } from "react-bootstrap"
import styled from "styled-components"
import { AuthContext } from "../../provider/auth-context"
import logoImg from "../../images/logo_small_black.png"

const Navigation = () => {
  const { isLoggedIn, signOut, currUser } = useContext(AuthContext)

  const [navExpanded, setNavExpanded] = useState(false)
  const [navDropDownExpanded, setNavDropDownExpanded] = useState(false)
  return (
    <NavbarWrapper>
      <Navbar
        onToggle={(value) => setNavExpanded(value)}
        expanded={navExpanded}
        sticky="top"
        bg="light"
        expand="lg"
      >
        <Navbar.Brand as={Link} to="/">
          <img src={logoImg} alt="Small logo" className="logo" width={92} />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link className="navlink" eventKey="1" as={Link} to="/">
              Home
            </Nav.Link>
            {isLoggedIn && (
              <Nav.Link
                className="navlink"
                eventKey="2"
                as={Link}
                to="/auth/committees"
              >
                Committees
              </Nav.Link>
            )}
            {!isLoggedIn && (
              <Nav.Link className="navlink" eventKey="3" as={Link} to="/login">
                Login
              </Nav.Link>
            )}
            {!isLoggedIn && (
              <Nav.Link
                className="navlink"
                eventKey="4"
                as={Link}
                to="/register"
              >
                Register
              </Nav.Link>
            )}
            {isLoggedIn && currUser !== null && (
              <NavDropdown
                title={`${
                  currUser.title !== "None" ? currUser.title + " " : ""
                }${currUser.firstname}`}
                align="end"
                id="basic-nav-dropdown"
                className="navlink"
                onClick={() => setNavDropDownExpanded(true)}
                aria-controls="collapse-dropdown-menu"
                aria-expanded={navDropDownExpanded}
              >
                <Collapse in={navDropDownExpanded}>
                  <div id="collapse-dropdown-menu">
                    <NavDropdown.Item
                      className="dropdown navlink"
                      style={{ color: "gray" }}
                      as={Link}
                      to="/auth/dashboard?tab=profile"
                      onClick={() => setNavExpanded(false)}
                    >
                      User Dashboard
                    </NavDropdown.Item>

                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      className="dropdown navlink"
                      style={{ color: "gray" }}
                      onClick={() => {
                        setNavExpanded(false)
                        signOut(null)
                      }}
                    >
                      Sign Out
                    </NavDropdown.Item>
                  </div>
                </Collapse>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </NavbarWrapper>
  )
}

const NavbarWrapper = styled.div`
  .navbar {
    padding: 0.5rem 1rem;
  }
  .dropdown:active {
    background-color: transparent;
  }
  .logo {
    vertical-align: middle;
  }
  .navlink {
    font-size: 1.3rem;
  }
  .dropdown-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 20px 0 rgba(0, 0, 0, 0.19);
`

export default Navigation
