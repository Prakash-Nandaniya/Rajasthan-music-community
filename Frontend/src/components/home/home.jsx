import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';
import './home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <header className="hero">
        <h1>Welcome to Ethnographic Map</h1>
        <p>Discover the cultural and musical heritage of Rajasthan's communities.</p>
        <Link to="/map" className="cta-button">Explore the Map</Link>
      </header>
      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          Our mission is to preserve and celebrate the rich heritage of Rajasthan's musician 
          and cultural communities. By documenting their art, stories, and way of life, 
          we aim to create a bridge between tradition and the modern world.
        </p>
      </section>
      <section className="call-to-action">
        <h2>Join Us</h2>
        <p>
          Whether you're a community member looking to share your story or a visitor eager 
          to learn more, we welcome you to be a part of this journey.
        </p>
        <Link to="/user/signup" className="cta-button">Sign Up</Link>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
