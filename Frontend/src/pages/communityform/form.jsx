import React, { useState, useEffect } from "react";
import SiteDetailsPage from "../../components/form/detail/formdetail";
import AddressLocationPage from "../../components/form/adress/formadress";
import MediaUploadPage from "../../components/form/addmedia/formmedia";
import AddArtist from "../../components/form/addartist/addartist";
import "./form.css";

export default function CommunityForm() {
  const [SiteformData, setSiteFormData] = useState({
    mainImage: null,
    community: "",
    groupName: "",
    quickInfo: "",
    detail: "",
    address: "",
    latitude: "",
    longitude: "",
    media: {
      images: [],
      videos: [],
    },
    access: [],
    artists: [],
  });

  const [page, setPage] = useState(0);
  const [canGoNext, setCanGoNext] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSiteFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate required fields
    if (
      !SiteformData.community ||
      !SiteformData.groupName ||
      !SiteformData.quickInfo ||
      !SiteformData.detail ||
      !SiteformData.address ||
      !SiteformData.latitude ||
      !SiteformData.longitude ||
      !SiteformData.mainImage
    ) {
      alert("Please fill all required fields.");
      return;
    }
  
    // Validate artists data
    const isArtistsValid = SiteformData.artists.every((artist) => {
      return (
        artist.name &&
        artist.profilePicture &&
        artist.instrument &&
        artist.detail &&
        artist.media.images.length > 0 &&
        artist.media.videos.length > 0
      );
    });
  
    if (!isArtistsValid) {
      alert("Please fill all required fields for each artist.");
      return;
    }
  
    // Create FormData object
    const formDataToSend = new FormData();
  
    // Append basic fields
    formDataToSend.append("community", SiteformData.community);
    formDataToSend.append("groupName", SiteformData.groupName);
    formDataToSend.append("quickInfo", SiteformData.quickInfo);
    formDataToSend.append("detail", SiteformData.detail);
    formDataToSend.append("address", SiteformData.address);
    formDataToSend.append("latitude", parseFloat(SiteformData.latitude).toFixed(6));
    formDataToSend.append("longitude", parseFloat(SiteformData.longitude).toFixed(6));
    formDataToSend.append("mainImage", SiteformData.mainImage);
  
    // Append media (images & videos)
    SiteformData.media.images.forEach((image, index) => {
      formDataToSend.append(`media.images[${index}]`, image);
    });
    SiteformData.media.videos.forEach((video, index) => {
      formDataToSend.append(`media.videos[${index}]`, video);
    });
  
    // Append access numbers
    SiteformData.access.forEach((number, index) => {
      formDataToSend.append(`access[${index}]`, number);
    });
  
    // Append artists data
    SiteformData.artists.forEach((artist, artistIndex) => {
      // Append artist details
      formDataToSend.append(`artists[${artistIndex}].name`, artist.name);
      formDataToSend.append(`artists[${artistIndex}].profilePicture`, artist.profilePicture); // Ensure this is a file object
      formDataToSend.append(`artists[${artistIndex}].instrument`, artist.instrument); // Removed trailing dot
      formDataToSend.append(`artists[${artistIndex}].detail`, artist.detail); // Removed trailing dot
    
      // Append artist media (images)
      if (artist.media && artist.media.images) {
        artist.media.images.forEach((image, imageIndex) => {
          formDataToSend.append(`artists[${artistIndex}].media.images[${imageIndex}]`, image); // Ensure this is a file object
        });
      }
    
      // Append artist media (videos)
      if (artist.media && artist.media.videos) {
        artist.media.videos.forEach((video, videoIndex) => {
          formDataToSend.append(`artists[${artistIndex}].media.videos[${videoIndex}]`, video); // Ensure this is a file object
        });
      }
    });
  
    try {
      const response = await fetch("http://127.0.0.1:8000/createsite", {
        method: "POST",
        body: formDataToSend,
      });
      console.log(response);
      if (response.ok) {
        alert("Site created successfully");
      } else {
        const errorData = await response.json(); // Parse error response
        alert(`Error: ${errorData.message || "Failed to create site"}`);
      }
    } catch (error) {
      alert(`Error uploading media: ${error.message}`);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (page === 0) {
      const requiredFieldsFilled =
        SiteformData.mainImage &&
        SiteformData.community &&
        SiteformData.groupName &&
        SiteformData.quickInfo &&
        SiteformData.access.length > 0;
      setCanGoNext(requiredFieldsFilled);
    } else if (page === 1) {
      const requiredFieldsFilled = SiteformData.address;
      setCanGoNext(requiredFieldsFilled);
    } else {
      setCanGoNext(true);
    }
  }, [SiteformData, page]);

  return (
    <form >
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-background"></div>
          <div className="progress" style={{ width: `${((page) / 3) * 100}%` }}></div>
        </div>
        <div className="progress-nodes">
          <span className={`node ${page >= 0 ? "active" : ""}`} data-label="Details">1</span>
          <span className={`node ${page >= 1 ? "active" : ""}`} data-label="Address">2</span>
          <span className={`node ${page >= 2 ? "active" : ""}`} data-label="Media">3</span>
          <span className={`node ${page === 3 ? "active" : ""}`} data-label="Artists">4</span>
        </div>
      </div>


      <div className="form-container">
        {page === 0 && (
          <SiteDetailsPage
            formData={SiteformData}
            handleInputChange={handleInputChange}
            setFormData={setSiteFormData}
          />
        )}

        {page === 1 && <AddressLocationPage formData={SiteformData} handleInputChange={handleInputChange} />}

        {page === 2 && (
          <MediaUploadPage
            formData={SiteformData}
            setFormData={setSiteFormData}
          />
        )}

        {page === 3 && (
          <AddArtist
            formData={SiteformData}
            setFormData={setSiteFormData}
          />
        )}
      </div>
      <div className="navigation-buttons">
        {page > 0 && (
          <button type="button" onClick={() => handlePageChange(page - 1)}>
            Previous
          </button>
        )}
        {page < 3 && (
          <button type="button" onClick={() => handlePageChange(page + 1)} disabled={!canGoNext}>
            Next
          </button>
        )}
        {page === 3 && <button type="submit" className="submit-button" onClick={handleSubmit}>Submit</button>}
      </div>
    </form>
  );
}
