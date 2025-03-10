import React from 'react';
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';
import './aboutus.css';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <Navbar />
      <header className="about-header">
        <h1>About Us</h1>
        <p>Preserving the cultural and musical heritage of Rajasthan's communities.</p>
      </header>
      <section className="our-story">
        <h2>Our Story</h2>
        <p>
          Rajasthan is home to diverse communities of musicians, each with a rich legacy of 
          traditional art and culture. Our platform is dedicated to documenting, preserving, 
          and celebrating their stories, songs, and way of life. By creating a digital 
          ethnographic map, we aim to make their voices heard across the world.
        </p>
      </section>
      <section className="our-mission">
        <h2>Our Mission</h2>
        <p>
          We aim to connect communities with a global audience, ensure that their legacy is 
          not forgotten, and provide them with opportunities for growth and recognition.
        </p>
      </section>
      <Footer />
    </div>
  );
};

export default AboutUs;
