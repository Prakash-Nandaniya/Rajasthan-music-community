import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./formadress.css";

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationMarker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function AddressLocationPage({ formData, handleInputChange }) {
  const [location, setLocation] = useState({
    lat: formData.latitude ? parseFloat(formData.latitude) : null,
    lng: formData.longitude ? parseFloat(formData.longitude) : null,
  });
  const [mapCenter, setMapCenter] = useState([26.5, 72.5]); // Rajasthan center

  // On mount, get user location if not set
  useEffect(() => {
    if (!location.lat || !location.lng) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setLocation({ lat, lng });
            setMapCenter([lat, lng]);
          },
          () => {
            // Use default center
          }
        );
      }
    } else {
      setMapCenter([location.lat, location.lng]);
    }
    // eslint-disable-next-line
  }, []);

  // Reverse geocode and update formData when location changes
  useEffect(() => {
    if (location.lat && location.lng) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.lat}&lon=${location.lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          const addr = data.display_name || "";
          handleInputChange({
            target: { name: "address", value: addr },
          });
          handleInputChange({
            target: { name: "latitude", value: location.lat.toString() },
          });
          handleInputChange({
            target: { name: "longitude", value: location.lng.toString() },
          });
        });
    }
    // eslint-disable-next-line
  }, [location]);

  // Handler for "Choose current location"
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation({ lat, lng });
          setMapCenter([lat, lng]);
        },
        () => {
          alert("Unable to fetch current location.");
        }
      );
    }
  };

  return (
    <div className="address-step-container">
      <h2 className="address-title">Select your community location on map</h2>
      <div className="address-actions">
        <button
          className="choose-location-btn"
          type="button"
          onClick={handleCurrentLocation}
        >
          <span role="img" aria-label="location">
            ⦿
          </span>{" "}
          Choose current location
        </button>
      </div>
      <div className="leaflet-map-wrapper">
        <MapContainer
          center={mapCenter}
          zoom={12}
          scrollWheelZoom={true}
          className="leaflet-map-box"
          style={{ height: "400px", width: "90vw", maxWidth: "900px", background: "#ddd" }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri"
          />
          {location.lat && location.lng && (
            <Marker position={[location.lat, location.lng]} />
          )}
          <LocationMarker setLocation={setLocation} />
        </MapContainer>
      </div>
    </div>
  );
}
