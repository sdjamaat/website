import React, { useState, useEffect } from "react"
import ReactMapGL, { Marker } from "react-map-gl"
import styled from "styled-components"
import CityPin from "./pin"

const MarkazMap = ({ width }) => {
  const setWidth = () => {
    if (window.innerWidth > 767 && window.innerWidth < 990) {
      return width
    }
    return width - 29
  }
  const [viewport, setViewport] = useState({
    latitude: 32.89592,
    longitude: -117.132462,
    height: "150px",
    width: setWidth(),
    zoom: 17,
    attributionControl: false,
  })

  useEffect(() => {
    setViewport({
      ...viewport,
      width: setWidth(),
    })
  }, [width])

  return (
    <MapWrapper>
      {viewport && (
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken="pk.eyJ1Ijoic2Rqd2VibWFzdGVyIiwiYSI6ImNrOXpqcHlrNTE3eWMzZm1yN2llZTFnN3QifQ.lHNUxbBArae8Hg-baAprzQ"
          mapStyle="mapbox://styles/sdjwebmaster/ck9znm0kz2o9l1io3buvdh7yc"
          className="map"
        >
          <Marker latitude={32.8961} longitude={-117.13253}>
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
