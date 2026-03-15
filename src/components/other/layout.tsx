import React, { useState } from "react"
import Navigation from "./navbar"
import Footer from "./footer"
import styled from "styled-components"
import moulaImg from "../../images/moula.png"

const Layout = ({ children, displayBanner }: { children: React.ReactNode; displayBanner?: boolean }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <LayoutWrapper>
      <Navigation />

      <main>
        {displayBanner && (
          <div className="banner-container">
            {!imageLoaded && <div className="banner-skeleton" />}
            <img
              src={moulaImg}
              alt="Moula Image"
              className={`moula-img ${imageLoaded ? "loaded" : "loading"}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
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

  .banner-container {
    max-width: 1600px;
    margin: auto;
    position: relative;
    aspect-ratio: 3361 / 1421;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    overflow: hidden;
  }

  .banner-skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite ease-in-out;
    border-radius: inherit;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .moula-img {
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    width: 100%;
    display: block;
    transition: opacity 0.3s ease-in;
  }

  .moula-img.loading {
    opacity: 0;
  }

  .moula-img.loaded {
    opacity: 1;
  }

  main {
    padding: 1rem;
  }
`
export default Layout
