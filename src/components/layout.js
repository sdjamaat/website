import React from "react"
import Navigation from "./navbar"
import Footer from "./footer"
import styled from "styled-components"

const Layout = ({ children }) => {
  return (
    <div>
      <LayoutWrapper>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </LayoutWrapper>
    </div>
  )
}

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  main {
    margin: auto;
    max-width: 1300px;
    padding: 1rem;
  }
`
export default Layout
