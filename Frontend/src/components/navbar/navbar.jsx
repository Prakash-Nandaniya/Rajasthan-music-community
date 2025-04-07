import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useUser } from '../../../contextapi'; // Assuming you have a user context

const Navbar = () => {
  const { userRole } = useUser(); // Assuming you have a user context
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Ethnographic Map</div>
      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/map">Map</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
        {userRole === "none" ? null : <li><Link to="/community">communitylist</Link></li>}
      </ul>
    </nav>
  );
};

export default Navbar;