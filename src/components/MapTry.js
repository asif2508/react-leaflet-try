import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "./Constant";
const MapTry = () => {
  function LocationMarker() {
    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState(null);
    
    const [bbox, setBbox] = useState([]);
    const map = useMap();
    const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
        }
      },
    }),
    [],
  )
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d)
  }, [])
    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        const radius = e.accuracy;
        const circle = L.circle(e.latlng, radius);
        circle.addTo(map);
        setBbox(e.bounds.toBBoxString().split(","));
      });
    }, [map]);

    return position === null ? null : (
      <Marker 
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef} 
      icon={icon}>
        <Popup>
          <span onClick={toggleDraggable}>
          {draggable
            ? <>
            <p>Marker is draggable Now</p>
            </>
            : 
            <>
            <p>Click here to make marker draggable</p>
            </>
            
            }
        </span>
        </Popup>
      </Marker>
    );
  }
  return (
    <div style={{ height: "500px", margin:"50px" }}>

      <MapContainer
      center={[49.1951, 16.6068]}
      zoom={13}
      scrollWheelZoom
      style={{ height: "100vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
    </div>
  );
};

export default MapTry;