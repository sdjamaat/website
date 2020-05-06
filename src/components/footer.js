import React from "react"
import styled from "styled-components"
import { Navbar } from "react-bootstrap"

const Footer = () => {
  return (
    <FooterWrapper>
      <Navbar sticky="bottom" bg="light">
        &copy; {new Date().getFullYear()} Anjuman-e-Mohammedi San Diego
      </Navbar>
    </FooterWrapper>
  )
}

const FooterWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  line-height: 3rem;

  .navbar {
    justify-content: center;
  }
`

export default Footer
