// import React from 'react';
// import { useParams } from 'react-router-dom';
// import Navbar from '../navbar/navbar';
// import Footer from '../footer/footer';
// import './communiitydetail.css';

// const CommunityDetail = () => {
//   const { id } = useParams();

//   // Placeholder data for individual community (replace with API/database fetch)
//   const communityData = {
//     1: {
//       name: "Manganiyar",
//       location: "Barmer, Rajasthan",
//       musicStyle: "Folk",
//       description: "The Manganiyars are a traditional musician community known for their soulful folk songs and storytelling through music.",
//       photos: ["/images/manganiyar1.jpg", "/images/manganiyar2.jpg"],
//       videos: ["/videos/manganiyar_performance.mp4"],
//       audio: ["/audio/manganiyar_song.mp3"],
//     },
//     2: {
//       name: "Langas",
//       location: "Jaisalmer, Rajasthan",
//       musicStyle: "Sufi",
//       description: "Langas specialize in Sufi music and are known for their melodious tunes on traditional instruments like the Sindhi Sarangi.",
//       photos: ["/images/langas1.jpg", "/images/langas2.jpg"],
//       videos: ["/videos/langas_performance.mp4"],
//       audio: ["/audio/langas_song.mp3"],
//     },
//   };

//   const community = communityData[id];

//   if (!community) {
//     return <p>Community not found</p>;
//   }

//   return (
//     <div className="community-detail-page">
//       <Navbar />
//       <section className="community-detail">
//         <h1>{community.name}</h1>
//         <p><strong>Location:</strong> {community.location}</p>
//         <p><strong>Music Style:</strong> {community.musicStyle}</p>
//         <p>{community.description}</p>
//         <div className="media-section">
//           <h3>Photos</h3>
//           <div className="photos">
//             {community.photos.map((photo, idx) => (
//               <img src={photo} alt={`${community.name} photo ${idx + 1}`} key={idx} />
//             ))}
//           </div>
//           <h3>Videos</h3>
//           <div className="videos">
//             {community.videos.map((video, idx) => (
//               <video controls src={video} key={idx}>
//                 Your browser does not support the video tag.
//               </video>
//             ))}
//           </div>
//           <h3>Audio</h3>
//           <div className="audio">
//             {community.audio.map((audio, idx) => (
//               <audio controls src={audio} key={idx}>
//                 Your browser does not support the audio tag.
//               </audio>
//             ))}
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// };

// export default CommunityDetail;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';
import API from '../../../api'; // Ensure API utility is correctly imported
import './communiitydetail.css';

const CommunityDetail = () => {
  const { id } = useParams();
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

  if (loading) return <p>Loading community details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!community) return <p>Community not found</p>;

  return (
    <div className="community-detail-page">
      <Navbar />
      <section className="community-detail">
        <h1>{community.community}</h1>
        <p><strong>Location:</strong> {community.address}</p>
        <p><strong>Group Name:</strong> {community.groupName}</p>
        <p><strong>Quick Info:</strong> {community.quickInfo}</p>
        <p>{community.detail}</p>

        <div className="media-section">
          <h3>Main Image</h3>
          <img src={community.mainImage} alt={community.community} className="main-image" />

          <h3>More Photos</h3>
          <div className="photos">
            {community.moreImages?.map((img, idx) => (
              <img src={img.image} alt={`${community.community} photo ${idx + 1}`} key={idx} />
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
      <Footer />
    </div>
  );
};

export default CommunityDetail;
