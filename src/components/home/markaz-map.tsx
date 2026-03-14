import React from "react"
import { Map, Marker } from "react-map-gl"
import styled from "styled-components"
import CityPin from "./pin"

const MarkazMap = () => {
  return (
    <MapWrapper>
      <Map
        initialViewState={{
          latitude: 32.8962,
          longitude: -117.132462,
          zoom: 16.6,
        }}
        style={{ width: "100%", height: 200, borderRadius: 5 }}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/sdjwebmaster/cka5xlv3z00u21imo5i9x1miw"
      >
        <Marker latitude={32.89605} longitude={-117.13275}>
          <CityPin size={20} />
        </Marker>
      </Map>
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
