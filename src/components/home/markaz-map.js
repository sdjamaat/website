import React, { useState, useEffect } from "react"
import ReactMapGL, { Marker } from "react-map-gl"
import styled from "styled-components"
import CityPin from "./pin"

const MarkazMap = ({ width, height }) => {
  const setWidth = () => {
    if (window.innerWidth > 767 && window.innerWidth < 990) {
      return width
    }
    return width - 29
  }

  const setHeight = () => {
    if (window.innerWidth <= 991) {
      return 140
      // } else if (window.innerWidth <= 1023) {
      //   return 140 + width * 0.538
      // } else if (window.innerWidth <= 1077) {
      //   return 140 + width * 0.42
      // } else if (window.innerWidth <= 1195) {
      //   return 140 + width * 0.23
      // } else if (window.innerWidth <= 1262) {
      //   return 140 + width * 0.15
    } else if (window.innerWidth <= 1328) {
      return 140 + width * 0.07
    } else {
      return 178
    }
  }
  const [viewport, setViewport] = useState({
    latitude: 32.8962,
    longitude: -117.132462,
    height: setWidth(),
    width: setHeight(),
    zoom: 16.6,
    attributionControl: false,
  })

  useEffect(() => {
    setViewport({
      ...viewport,
      width: setWidth(),
      height: setHeight(),
    })
  }, [width, height])

  return (
    <MapWrapper>
      {viewport && (
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken="pk.eyJ1Ijoic2Rqd2VibWFzdGVyIiwiYSI6ImNrOXpqcHlrNTE3eWMzZm1yN2llZTFnN3QifQ.lHNUxbBArae8Hg-baAprzQ"
          mapStyle="mapbox://styles/sdjwebmaster/cka5xlv3z00u21imo5i9x1miw"
          className="map"
        >
          <Marker latitude={32.89605} longitude={-117.13275}>
            <CityPin size={20} />
          </Marker>
        </ReactMapGL>
      )}
    </MapWrapper>
  )
}

const MapWrapper = styled.div`
  .map {
    border-radius: 5px;
    width: 100%;
  }
`

export default MarkazMap
