import React, { useEffect } from "react";
import "./formadress.css";

export default function AddressLocationPage({ formData, handleInputChange }) {
  useEffect(() => {
    // Only run this if the address isn't already filled (or you can add a refresh button)
    if (!formData.latitude && !formData.longitude) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            handleInputChange({
              target: {
                name: "latitude",
                value: position.coords.latitude.toString(),
              },
            });
            handleInputChange({
              target: {
                name: "longitude",
                value: position.coords.longitude.toString(),
              },
            });
          },
          (error) => {
            console.error("Error accessing location:", error);
            alert("Please enable location access to use this feature.");
          }
        );
      } else {
        console.error("Geolocation is not supported by your browser.");
      }
    }
  }, [handleInputChange]);

  return (
    <div className="card-container">
      <h2 className="title">Address and Location</h2>
      <div className="form-grid">
        <textarea
          name="address"
          placeholder="Address (Required)"
          required
          className="textarea"
          value={formData.address}
          onChange={handleInputChange}
        />
        <div className="input-group">
          <input
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            className="input-text"
            onChange={handleInputChange}
          />
          <input
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            className="input-text"
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
}
