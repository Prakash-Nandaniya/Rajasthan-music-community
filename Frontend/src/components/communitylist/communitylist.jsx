// import React from 'react';
// import { Link } from 'react-router-dom';
// import Navbar from '../navbar/navbar';
// import Footer from '../footer/footer';
// import './communitylist.css';

// const CommunityList = () => {
//   // Placeholder data (replace with API/database fetch)
//   const communities = [
//     { id: 1, name: "Manganiyar" },
//     { id: 2, name: "Langas" },
//   ];

//   return (
//     <div className="community-list-page">
//       <Navbar />
//       <button className="add-community-button">
//         <Link to="/communityform">Add Community</Link>
//       </button>
//       <header className="list-header">
//         <h1>Communities</h1>
//         <p>Explore the list of music communities in Rajasthan.</p>
//       </header>
//       <section className="community-list">
//         <ul>
//           {communities.map((community) => (
//             <li key={community.id}>
//               <Link to={`/community/${community.id}`}>{community.name}</Link>
//             </li>
//           ))}
//         </ul>
//       </section>
//       <Footer />
//     </div>
//   );
// };

// export default CommunityList;
// import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';
import API from '../../../api'; // Ensure you import API utility
import './communitylist.css';
import { useUser } from '../../../contextapi';
const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   
  const  {userRole}  = useUser(); // Assuming you have a user context
  useEffect(() => {
    API.get("/map")
      .then((response) => {
        setCommunities(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching communities:", error);
        setError("Failed to load communities.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="community-list-page">
 <Navbar />
<button className="add-community-button">
  {userRole ==="artist" ? (
    <Link to="/communityform">Add Community</Link>
  ) : (
    <span onClick={() => alert("Please login as artist")}>Add Community</span>
  )}
</button>
      <header className="list-header">
        <h1>Communities</h1>
        <p>Explore the list of music communities in Rajasthan.</p>
      </header>

      {loading ? (
        <p>Loading communities...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <section className="community-list">
          <ul>
          {communities.map((community) => (
  <li key={community.id} className="community-item">
    <Link to={`/community/${community.id}`} className="community-link">
      <div className="community-card">
        {/* Display the community image */}
        <img
          src={community.mainImage || "default-image.jpg"} // Fallback to a default image if mainImage is not available
          alt={`${community.groupName} Image`}
          className="community-image"
        />
        <div className="community-details">
          {/* Display the group name */}
          <h3 className="community-name">{community.groupName}</h3>
          {/* Display the instruments */}
          <p className="community-instruments">
            <strong>Instruments:</strong> {community.instrumets || "N/A"}
          </p>
          {/* Display the community name */}
          <p className="community-community">
            <strong>Community:</strong> {community.community}
          </p>
        </div>
      </div>
    </Link>
  </li>
))}
          </ul>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default CommunityList;
