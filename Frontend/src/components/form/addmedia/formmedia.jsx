import React, { useState, useEffect } from "react";
import { Plus, X, Maximize } from "lucide-react";
import "./formmedia.css";
import imageCompression from "browser-image-compression";

const handleImageChange = async (e, setFormData, setSizeMB, setAllowedImages, allowedImages) => {
  const files = Array.from(e.target.files);

  const options = {
    useWebWorker: true,
    fileType: "image/webp",
  };

  const finalFiles = [];
  let sizeMB_curr = 0;
  for (const file of files) {
    if (allowedImages <= 0) {
      alert("You have reached the maximum number of images allowed.");
      break;
    }
    try {
      const compressedFile = await imageCompression(file, options);
      finalFiles.push(compressedFile);
      sizeMB_curr += Number((compressedFile.size / 1024 / 1024).toFixed(2));
    } catch (error) {
      console.error(`Compression failed for ${file.name}, using original image:`, error);
      finalFiles.push(file);
      sizeMB_curr += Number((file.size / 1024 / 1024).toFixed(2));
    } finally {
      setAllowedImages((prev) => prev - 1);
    }
  }

  setSizeMB((prev) => {
    const prevNumber = Number(prev) || 0;
    const total = prevNumber + Number(sizeMB_curr);
    return Number(total.toFixed(2));
  });

  setFormData((prev) => ({
    ...prev,
    media: {
      ...prev.media,
      images: [...(prev.media.images || []), ...finalFiles],
    },
  }));
};

const handleVideoChange = async (e, setFormData, setSizeMB, setAllowedVideos, allowedVideos) => {
  const files = Array.from(e.target.files);
  const MAX_FILE_SIZE_MB = 30;
  const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

  const acceptedFiles = [];

  for (const file of files) {
    const sizeMB = file.size / (1024 * 1024);
    console.log(`Size of video ${file.name}: ${sizeMB.toFixed(2)}MB, Type: ${file.type}`);

    try {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`${file.name} is not a supported video format. Please use MP4, WebM, or OGG.`);
        continue;
      }

      if (sizeMB > MAX_FILE_SIZE_MB) {
        alert(`${file.name} is of ${sizeMB.toFixed(2)}MB. Please use a video smaller than ${MAX_FILE_SIZE_MB}MB.`);
        continue;
      }

      if (allowedVideos <= 0) {
        alert("Maximum videos reached");
        break;
      }

      acceptedFiles.push(file);
      setSizeMB(prev => Number((prev + sizeMB).toFixed(2)));
      setAllowedVideos(prev => prev - 1);
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
      alert(`Error processing ${file.name}: ${error.message}`);
    }
  }

  setFormData(prev => ({
    ...prev,
    media: {
      ...prev.media,
      videos: [...(prev.media.videos || []), ...acceptedFiles],
    },
  }));
};

const removeImage = (index, setFormData, setAllowedImages) => {
  setAllowedImages((prev) => prev + 1);
  setFormData((prev) => ({
    ...prev,
    media: {
      ...prev.media,
      images: prev.media.images.filter((_, i) => i !== index),
    },
  }));
};

const removeVideo = (index, setFormData, setAllowedVideos) => {
  setAllowedVideos((prev) => prev + 1);
  setFormData((prev) => ({
    ...prev,
    media: {
      ...prev.media,
      videos: prev.media.videos.filter((_, i) => i !== index),
    },
  }));
};

const getImageSrc = (file) => {
  if (!file) return null;
  return file instanceof File || file instanceof Blob
    ? URL.createObjectURL(file)
    : file;
};

export default function MediaUploadPage({
  formData,
  setFormData,
  setSizeMB,
  allowed_images,
  allowed_videos,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [allowedImages, setAllowedImages] = useState(allowed_images);
  const [allowedVideos, setAllowedVideos] = useState(allowed_videos);

  // Clean up object URLs when component unmounts or media changes
  useEffect(() => {
    const imageUrls = (formData.media.images || []).map(file => getImageSrc(file));
    const videoUrls = (formData.media.videos || []).map(file => getImageSrc(file));
    return () => {
      imageUrls.forEach(url => {
        if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      videoUrls.forEach(url => {
        if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [formData.media.images, formData.media.videos]);

  return (
    <div className="card-container">
      <h2 className="title">Upload Media</h2>
      <div className="form-grid">
        <div>
          <span className="form-label">Additional Media</span>
          <div className="media-preview">
            <div className="image-section">
              <span className="media-label">Images</span>
              {allowedImages > 0 && (
                <label className="media-add">
                  <Plus size={24} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden-input"
                    multiple
                    onChange={(e) => handleImageChange(e, setFormData, setSizeMB, setAllowedImages, allowedImages)}
                  />
                </label>
              )}
              <div>
                <h5>{allowed_images - allowedImages}/{allowed_images} images added</h5>
                <div className="formmedia-media-section">
                  {formData.media.images.map((file, index) => (
                    <div key={index} className="media-item">
                      <img
                        src={getImageSrc(file)}
                        alt={file.name}
                        className="media-image"
                        onClick={() => setSelectedImage(getImageSrc(file))}
                        onError={(e) => console.error(`Image preview error for ${file.name}:`, e)}
                      />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeImage(index, setFormData, setAllowedImages)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="video-section">
              <span className="media-label">Videos</span>
              {allowedVideos > 0 && (
                <label className="media-add">
                  <Plus size={24} />
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    className="hidden-input"
                    multiple
                    onChange={(e) => handleVideoChange(e, setFormData, setSizeMB, setAllowedVideos, allowedVideos)}
                  />
                </label>
              )}
              <div>
                <h5>{allowed_videos - allowedVideos}/{allowed_videos} videos added</h5>
                <div className="formmedia-media-section">
                  {formData.media.videos.map((file, index) => (
                    <div key={index} className="media-item video-container">
                      <video
                        src={getImageSrc(file)}
                        className="media-video"
                        controls
                        muted
                        onError={(e) => console.error(`Video preview error for ${file.name}:`, e)}
                      />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeVideo(index, setFormData, setAllowedVideos)}
                      >
                        <X size={18} />
                      </button>
                      <button
                        type="button"
                        className="maximize-btn"
                        onClick={() => setSelectedVideo(getImageSrc(file))}
                      >
                        <Maximize size={18} />
                      </button>
                    </div>
                  ))}
                </div>
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
            <video
              src={selectedVideo}
              className="fullscreen-video"
              controls
              autoPlay
            />
          </div>
        )}
      </div>
    </div>
  );
}