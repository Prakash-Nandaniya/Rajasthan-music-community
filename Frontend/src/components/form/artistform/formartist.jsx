import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { Plus, X, Maximize } from "lucide-react";
import MediaUploadPage from "../addmedia/formmedia";
import "./formartist.css";

export default function ArtistForm({ ArtistData, setFormData, index }) {
  const loaded = useRef(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ArtistMedia, setArtistMedia] = useState({
    media: {
      images: [],
      videos: [],
    },
  });

  useEffect(() => {
    if (loaded.current) {
      setFormData((prev) => ({
        ...prev,
        artists: prev.artists.map((artist) =>
          artist.index === index
            ? {
                ...artist,
                media: {
                  images: ArtistMedia.media.images,
                  videos: ArtistMedia.media.videos,
                },
              }
            : artist
        ),
      }));
    }
  }, [ArtistMedia]);

  useEffect(() => {
    setArtistMedia({
      media: {
        images: ArtistData.media.images,
        videos: ArtistData.media.videos,
      },
    });

    loaded.current = true;
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      artists: prev.artists.map((artist) =>
        artist.index === index ? { ...artist, [name]: value } : artist
      ),
    }));
  };

  const addprofilepicture = (e) => {
    setFormData((prev) => ({
      ...prev,
      artists: prev.artists.map((artist) =>
        artist.index === index
          ? { ...artist, profilePicture: e.target.files[0] }
          : artist
      ),
    }));
  };

  const removeprofilepicture = () => {
    setFormData((prev) => ({
      ...prev,
      artists: prev.artists.map((artist) =>
        artist.index === index ? { ...artist, profilePicture: null } : artist
      ),
    }));
  };

  const handleremoveArtist = () => {
    setFormData((prev) => ({
      ...prev,
      artists: prev.artists.filter((artist) => artist.index !== index),
    }));
  };

  const isArtistsValid = ArtistData.name && ArtistData.instrument && ArtistData.profilePicture;

  const saveform = () => {
    if (!isArtistsValid) {
        alert("Please fill all required fields for each artist.");
        return;
      }
    setFormData((prev) => ({
      ...prev,
      artists: prev.artists.map((artist) =>
        artist.index === index ? { ...artist, isActive: false } : artist
      ),
    }));
  };

  const toggleshutter = () => {
    setFormData((prev) => ({
      ...prev,
      artists: prev.artists.map((artist) =>
        artist.index === index
          ? { ...artist, isActive: !artist.isActive }
          : artist
      ),
    }));
  };

  return (
    <>
      <button
        type="button"
        className="dropdown-button"
        onClick={() => toggleshutter()}
      >
        {ArtistData.name} <span className="arrow">▼</span>
      </button>
      <div className="dropdown-content">
        <div className="card-container">
          <h2 className="title">Site Details</h2>
          <div className="form-grid">
            <div className="image-section">
              <span className="media-label">Main Image</span>
              {ArtistData.profilePicture ? (
                <div className="media-item">
                  <img
                    src={URL.createObjectURL(ArtistData.profilePicture)}
                    alt="Selected"
                    className="media-image-mainimage"
                    onClick={() =>
                      setSelectedImage(
                        URL.createObjectURL(ArtistData.profilePicture)
                      )
                    }
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={removeprofilepicture}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="media-add-mainimage">
                  <Plus size={24} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden-input"
                    required
                    onChange={(e) => addprofilepicture(e)}
                  />
                </label>
              )}
            </div>
            {selectedImage && (
              <div
                className="fullscreen-modal"
                onClick={() => setSelectedImage(null)}
              >
                <img
                  src={selectedImage}
                  alt="Full Size"
                  className="fullscreen-image"
                />
              </div>
            )}
            <input
              name="name"
              value={ArtistData["name"]}
              placeholder="Full Name (Required)"
              required
              className="input-text"
              onChange={handleInputChange}
            />
            <input
              name="instrument"
              value={ArtistData["instrument"]}
              placeholder="Instrument (Required)"
              required
              className="input-text"
              onChange={handleInputChange}
            />
            <textarea
              name="detail"
              value={ArtistData["detail"]}
              placeholder="Detail (Optional)"
              className="textarea"
              onChange={handleInputChange}
            />
            <MediaUploadPage
              formData={ArtistMedia}
              setFormData={setArtistMedia}
            />
            <button
              type="button"
              className="save-button"
              onClick={() => {
                saveform();
              }}
            >
              {" "}
              Save{" "}
            </button>
            <button
              type="button"
              className="remove-button"
              onClick={handleremoveArtist}
            >
              {" "}
              Remove{" "}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
