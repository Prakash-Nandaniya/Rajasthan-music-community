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

export default function MediaUploadPage({
  formData,
  setFormData,
}) {

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  console.log("formData: ",formData);
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
              <div className="media-section">
                {formData.media.images.map((file, index) => (
                  <div key={index} className="media-item">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="media-image"
                      onClick={() => setSelectedImage(URL.createObjectURL(file))}
                    />
                    <button className="remove-btn" onClick={() => removeImage(index,setFormData)}>
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
              <div className="media-section">
                {formData.media.videos.map((file, index) => (
                  <div key={index} className="media-item video-container">
                    <video src={URL.createObjectURL(file)} className="media-video" controls />
                    <button className="remove-btn" onClick={() => removeVideo(index,setFormData)}>
                      <X size={18} />
                    </button>
                    <button className="maximize-btn" onClick={() => setSelectedVideo(URL.createObjectURL(file))}>
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
