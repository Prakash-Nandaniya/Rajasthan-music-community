import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';
import './communitylist.css';

const CommunityList = () => {
  // Placeholder data (replace with API/database fetch)
  const communities = [
    { id: 1, name: "Manganiyar" },
    { id: 2, name: "Langas" },
  ];

  return (
    <div className="community-list-page">
      <Navbar />
      <button className="add-community-button">
        <Link to="/communityform">Add Community</Link>
      </button>
      <header className="list-header">
        <h1>Communities</h1>
        <p>Explore the list of music communities in Rajasthan.</p>
      </header>
      <section className="community-list">
        <ul>
          {communities.map((community) => (
            <li key={community.id}>
              <Link to={`/community/${community.id}`}>{community.name}</Link>
            </li>
          ))}
        </ul>
      </section>
      <Footer />
    </div>
  );
};

export default CommunityList;
