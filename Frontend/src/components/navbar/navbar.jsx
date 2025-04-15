import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useUser } from "../../../contextapi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useUser();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logoutHandler = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BE_URL}logout/`,
        {},
        { withCredentials: true }
      );
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const communityId = user?.communityId;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/community", label: "Community" },
    ...(user?.role !== "artist" ? [{ path: "/artistcorner", label: "Artist Corner" }] : []),
    ...(user?.role === "artist" && communityId
      ? [{ path: `/communitypage/${communityId}`, label: "Your Community" }]
      : []),
  ];

  const renderNavItems = (isDropdown = false) =>
    navLinks.map((link) => (
      <li key={link.path} className={isDropdown ? "dropdown-item" : "nav-item"}>
        <Link
          className={isDropdown ? "dropdown-item" : "nav-link"}
          to={link.path}
          role={isDropdown ? "menuitem" : undefined}
        >
          {link.label}
        </Link>
      </li>
    ));

  const renderAuthSection = () => {
    if (!isAuthenticated || !user) {
      return (
        <div className="auth-buttons">
          <Link to="/user/login">
            <button className="btn btn-outline-custom-orange">Login</button>
          </Link>
          <Link to="/user/signup">
            <button className="btn btn-custom-orange">Signup</button>
          </Link>
        </div>
      );
    }
    return (
      <div className="dropdown">
        <button
          className="btn btn-custom-orange dropdown-toggle"
          type="button"
          id="profileDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Profile
        </button>
        <ul className="dropdown-menu" aria-labelledby="profileDropdown">
          <li>
            <button className="dropdown-item" onClick={logoutHandler} role="menuitem">
              Logout
            </button>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="navbar-content">
        <div className="navbar-left-group">
          {isMobile ? (
            <div className="dropdown">
              <button
                className="navbar-toggler"
                type="button"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                {renderNavItems(true)}
              </ul>
            </div>
          ) : (
            <ul className="navbar-nav mx-auto mt-2 mt-lg-0">{renderNavItems()}</ul>
          )}
          <span className="navbar-brand">Manchitra</span>
        </div>
        {renderAuthSection()}
      </div>
    </nav>
  );
};

export default Navbar;