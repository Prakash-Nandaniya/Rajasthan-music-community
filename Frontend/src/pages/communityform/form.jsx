import React, { useState, useEffect } from "react";
import SiteDetailsPage from "../../components/form/detail/formdetail";
import AddressLocationPage from "../../components/form/adress/formadress";
import MediaUploadPage from "../../components/form/addmedia/formmedia";
import AddArtist from "../../components/form/addartist/addartist";
import "./form.css";
import { Link } from "react-router-dom";

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
    instruments: [],
    artists: [],
  });

  const [page, setPage] = useState(0);
  const [canGoNext, setCanGoNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSubmitted, setIsSubmitted] = useState(false); // Submission modal state
  const [isGroupNameChanged, setIsGroupNameChanged] = useState(false);
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
      !SiteformData.address ||
      !SiteformData.latitude ||
      !SiteformData.longitude ||
      !SiteformData.mainImage ||
      SiteformData.access.length === 0
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Validate artists data
    const isArtistsValid = SiteformData.artists.every((artist) => {
      return artist.name && artist.profilePicture && artist.instrument;
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
    formDataToSend.append(
      "latitude",
      parseFloat(SiteformData.latitude).toFixed(6)
    );
    formDataToSend.append(
      "longitude",
      parseFloat(SiteformData.longitude).toFixed(6)
    );
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
      formDataToSend.append(`artists[${artistIndex}].profilePicture`,artist.profilePicture);
      formDataToSend.append(`artists[${artistIndex}].instrument`,artist.instrument);
      formDataToSend.append(`instruments[${artistIndex}]`, artist.instrument);
      formDataToSend.append(`artists[${artistIndex}].detail`, artist.detail);

      // Append artist media (images)
      if (artist.media && artist.media.images) {
        artist.media.images.forEach((image, imageIndex) => {
          formDataToSend.append(
            `artists[${artistIndex}].media.images[${imageIndex}]`,
            image
          );
        });
      }

      // Append artist media (videos)
      if (artist.media && artist.media.videos) {
        artist.media.videos.forEach((video, videoIndex) => {
          formDataToSend.append(
            `artists[${artistIndex}].media.videos[${videoIndex}]`,
            video
          );
        });
      }
    });

    // Show loading animation
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/createsite/", {
        method: "POST",
        body: formDataToSend,
      });
      console.log("Response:", response);
      if (response.ok) {
        setIsSubmitted(true); // Show success modal
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to create site"}`);
      }
    } catch (error) {
      alert(`Error uploading media: ${error.message}`);
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  const handlePageChange = async (newPage) => {
    if (isGroupNameChanged) {
      setIsGroupNameChanged(false);
      try {
        let temp = canGoNext;
        setCanGoNext(false);
        const response = await fetch(
          `http://127.0.0.1:8000/groupNameCheck?groupName=${SiteformData.groupName}&community=${SiteformData.community}`,
          {
            method: "GET",
          }
        );
        setCanGoNext(temp);
        if (!response.ok) {
          alert("Some error occurred, try again");
          return;
        }
        const data = await response.json();
        if (data.exists) {
          alert("Group name already taken. Change it.");
          return;
        }
        setPage(newPage);
      } catch (error) {
        console.error("Error checking group name:", error);
        alert("Some error occurred, try again");
      }
    }
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
    <form>
      {/* Loading Animation */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* Success Modal */}
      {isSubmitted && (
        <div className="loading-overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>Submission Successful</h2>
              <p>
                Your request has been sent.you will be informed when it will be
                approved.
              </p>
              <Link to="/">
                <button>OK</button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-background"></div>
          <div
            className="progress"
            style={{ width: `${(page / 3) * 100}%` }}
          ></div>
        </div>
        <div className="progress-nodes">
          <span
            className={`node ${page >= 0 ? "active" : ""}`}
            data-label="Details"
          >
            1
          </span>
          <span
            className={`node ${page >= 1 ? "active" : ""}`}
            data-label="Address"
          >
            2
          </span>
          <span
            className={`node ${page >= 2 ? "active" : ""}`}
            data-label="Media"
          >
            3
          </span>
          <span
            className={`node ${page === 3 ? "active" : ""}`}
            data-label="Artists"
          >
            4
          </span>
        </div>
      </div>

      <div className="form-container">
        {page === 0 && (
          <SiteDetailsPage
            formData={SiteformData}
            handleInputChange={handleInputChange}
            setFormData={setSiteFormData}
            setIsGroupNameChanged={setIsGroupNameChanged}
          />
        )}

        {page === 1 && (
          <AddressLocationPage
            formData={SiteformData}
            handleInputChange={handleInputChange}
          />
        )}

        {page === 2 && (
          <MediaUploadPage
            formData={SiteformData}
            setFormData={setSiteFormData}
          />
        )}

        {page === 3 && (
          <AddArtist formData={SiteformData} setFormData={setSiteFormData} />
        )}
      </div>
      <div className="navigation-buttons">
        {page > 0 && (
          <button type="button" onClick={() => handlePageChange(page - 1)}>
            Previous
          </button>
        )}
        {page < 3 && (
          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={!canGoNext || isLoading || isSubmitted}
          >
            Next
          </button>
        )}
        {page === 3 && (
          <button
            type="submit"
            className="submit-button"
            onClick={handleSubmit}
            disabled={isLoading || isSubmitted}
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
}
