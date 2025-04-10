import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';
import API from '../../../api'; // Ensure API utility is correctly imported
import './communiitydetail.css';

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get(`/detail/${id}`)
      .then((response) => {
        setCommunity(response.data);
        console.log("Community details:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching community details:", error);
        setError("Failed to load community details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="loading-message">Loading community details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!community) return <p className="not-found-message">Community not found</p>;

  const handleArtistClick = (artistId) => {
    navigate(`/community/${id}/artists/${artistId}`);
  };

  return (
    <div className="community-detail-page">
      <Navbar />
      <section className="community-detail">
        <h1 className="community-title">{community.community}</h1>
        
        <div className="info-section">
          <p className="community-location"><strong>📍 Location:</strong> {community.address}</p>
          <p className="community-group"><strong>🎵 Group Name:</strong> {community.groupName}</p>
          <p className="community-info"><strong>ℹ️ Quick Info:</strong> {community.quickInfo}</p>
          <p className="community-description">{community.detail}</p>
        </div>

        <div className="media-section">
          <h3 className="media-heading">Main Image</h3>
          <img src={community.mainImage} alt={community.community} className="main-image" />

          <h3 className="media-heading">More Photos</h3>
          <div className="photos">
            {community.moreImages?.map((img, idx) => (
              <img src={img.image} alt={`${community.community} photo ${idx + 1}`} key={idx} className="photo-item" />
            ))}
          </div>

          <h3 className="media-heading">Videos</h3>
          <div className="videos">
            {community.videos?.map((video, idx) => (
              <video controls src={video.video} key={idx} className="video-item">
                Your browser does not support the video tag.
              </video>
            ))}
          </div>
        </div>

        <div className="artist-section">
          <h3 className="artist-heading">Artists</h3>
          <div className="artist-list">
            {community.artists?.map((artist) => (
              <div className="artist-card" key={artist.id}>
                <img
                  src={artist.profilePicture}
                  alt={artist.name}
                  className="artist-profile-picture"
                />
                <h4 className="artist-name">{artist.name}</h4>
                <p className="artist-instrument"><strong>Instrument:</strong> {artist.instrument}</p>
                <button
                  className="artist-button"
                  onClick={() => handleArtistClick(artist.id)}
                >
                  View Artist
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CommunityDetail;