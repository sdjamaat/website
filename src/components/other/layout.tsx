import React from "react"
import Navigation from "./navbar"
import Footer from "./footer"
import styled from "styled-components"
import moulaImg from "../../images/moula.png"

const Layout = ({ children, displayBanner }: { children: React.ReactNode; displayBanner?: boolean }) => {
  return (
    <LayoutWrapper>
      <Navigation />

      <main>
        {displayBanner && (
          <img
            src={moulaImg}
            alt="Moula Image"
            className="moula-img"
          />
        )}

        {children}
      </main>
      <Footer />
    </LayoutWrapper>
  )
}

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .moula-img {
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    max-width: 1600px;
    margin: auto;
    width: 100%;
    display: block;
  }

  main {
    padding: 1rem;
  }
`
export default Layout
