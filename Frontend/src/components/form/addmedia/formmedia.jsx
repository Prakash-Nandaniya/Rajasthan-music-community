import React, { useState } from "react";
import { Plus, X, Maximize } from "lucide-react";
import "./formmedia.css";

const handleImageChange = (e,setFormData) => {
  const files = Array.from(e.target.files);
  setFormData((prev) => ({
    ...prev,
    media: { ...prev.media, images: [...prev.media.images, ...files] },
  }));
};

const handleVideoChange = (e,setFormData) => {
  const files = Array.from(e.target.files);
  setFormData((prev) => ({
    ...prev,
    media: { ...prev.media, videos: [...prev.media.videos, ...files] },
  }));
};

const removeImage = (index,setFormData) => {
  setFormData((prev) => ({
    ...prev,
    media: {
      ...prev.media,
      images: prev.media.images.filter((_, i) => i !== index),
    },
  }));
};

const removeVideo = (index,setFormData) => {
  setFormData((prev) => ({
    ...prev,
    media: {
      ...prev.media,
      videos: prev.media.videos.filter((_, i) => i !== index),
    },
  }));
};

const getImageSrc = (image) => {
  if (!image) return null;
  // Check if image is a File/Blob (for creation) or a string URL (for editing)
  return image instanceof File || image instanceof Blob
    ? URL.createObjectURL(image)
    : image; // Use URL string directly
};


export default function MediaUploadPage({
  formData,
  setFormData,
}) {

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  return (
    <div className="card-container">
      <h2 className="title">Upload Media</h2>
      <div className="form-grid">
        <div>
          <span className="form-label">Additional Media</span>
          <div className="media-preview">
            <div className="image-section">
              <span className="media-label">Images</span>
              <label className="media-add">
                <Plus size={24} />
                <input type="file" accept="image/*" className="hidden-input" multiple onChange={(e) => handleImageChange(e,setFormData)} />
              </label>
              <div className="formmedia-media-section">
                {formData.media.images.map((file, index) => (
                  <div key={index} className="media-item">
                    <img
                      src={getImageSrc(file)}
                      alt=""
                      className="media-image"
                      onClick={() => setSelectedImage(URL.createObjectURL(file))}
                    />
                    <button type="button" className="remove-btn" onClick={() => removeImage(index,setFormData)}>
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="video-section">
              <span className="media-label">Videos</span>
              <label className="media-add">
                <Plus size={24} />
                <input type="file" accept="video/*" className="hidden-input" multiple onChange={(e) => handleVideoChange(e,setFormData)} />
              </label>
              <div className="formmedia-media-section">
                {formData.media.videos.map((file, index) => (
                  <div key={index} className="media-item video-container">
                    <video src={getImageSrc(file.video)} className="media-video" controls />
                    <button type="button" className="remove-btn" onClick={() => removeVideo(index,setFormData)}>
                      <X size={18} />
                    </button>
                    <button type="button" className="maximize-btn" onClick={() => setSelectedVideo(URL.createObjectURL(file))}>
                      <Maximize size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {selectedImage && (
          <div className="fullscreen-modal" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Full Size" className="fullscreen-image" />
          </div>
        )}

        {selectedVideo && (
          <div className="fullscreen-modal" onClick={() => setSelectedVideo(null)}>
            <video src={selectedVideo} className="fullscreen-video" controls autoPlay />
          </div>
        )}
      </div>
    </div>
  );
}
