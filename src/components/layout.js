import React from "react"
import Navigation from "./navbar"
import Footer from "./footer"
import styled from "styled-components"

const Layout = ({ children }) => {
  return (
    <div>
      <LayoutWrapper>
        <Navigation />
        {children}
        <Footer />
      </LayoutWrapper>
    </div>
  )
}

const LayoutWrapper = styled.div``
export default Layout
