import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import API from "../../../api"; // Ensure API utility is correctly imported
import { useUser } from "../../../contextapi"; // Assuming user context for authentication
import "./communitypage.css"; // New CSS file for styling

const CommunityPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userRole } = useUser(); // Get user role from context

  useEffect(() => {
    API.get(`/detail/${id}`)
      .then((response) => {
        setCommunity(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching community details:", error);
        setError("Failed to load community details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading community details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!community) return <p>Community not found</p>;

  return (
    <div>
      <Navbar />
      <div className="community-page-container">
        <section className="community-page">
          <div className="edit-button-container">
            <Link to={`/editgroup/${id}`}>
              <button className="btn btn-custom-orange">Edit Community</button>
            </Link>
          </div>
          <h1>{community.community}</h1>
          <p>
            <strong>Location:</strong> {community.address}
          </p>
          <p>
            <strong>Group Name:</strong> {community.groupName}
          </p>
          <p>
            <strong>Quick Info:</strong> {community.quickInfo}
          </p>
          <p>{community.detail}</p>

          <div className="media-section">
            <h3>Main Image</h3>
            <img
              src={community.mainImage}
              alt={community.community}
              className="main-image"
            />

            <h3>More Photos</h3>
            <div className="photos">
              {community.moreImages?.map((img, idx) => (
                <img
                  src={img.image}
                  alt={`${community.community} photo ${idx + 1}`}
                  key={idx}
                />
              ))}
            </div>

            <h3>Videos</h3>
            <div className="videos">
              {community.videos?.map((video, idx) => (
                <video controls src={video.video} key={idx}>
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityPage;
