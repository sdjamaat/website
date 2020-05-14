import React from "react"
import Navigation from "./navbar"
import Footer from "./footer"
import styled from "styled-components"
import Img from "gatsby-image"
import { graphql, useStaticQuery } from "gatsby"

const Layout = ({ children, displayBanner }) => {
  const images = useStaticQuery(graphql`
    query {
      banner: file(relativePath: { eq: "moula_6.png" }) {
        childImageSharp {
          fluid(maxWidth: 1000) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)
  return (
    <div>
      <LayoutWrapper>
        <Navigation />
        <main>
          {displayBanner && (
            <Img
              fluid={images.banner.childImageSharp.fluid}
              alt="Moula Image"
              className="moula-img"
            />
          )}
          {children}
        </main>
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
    padding: 1rem;
  }
`
export default Layout
