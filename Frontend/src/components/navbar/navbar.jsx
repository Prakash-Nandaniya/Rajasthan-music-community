// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom'; // Import useLocation
// import './navbar.css';
// import { useUser } from '../../../contextapi'; // Assuming you have a user context
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// const Navbar = () => {
//   const { userRole } = useUser(); // Assuming you have a user context
//   const [menuOpen, setMenuOpen] = useState(false);
//   const location = useLocation(); // Get the current route

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       {/* <Link className="navbar-brand" to="/">
//         Rajasthan Music
//       </Link> */}
//       <button
//         className="navbar-toggler"
//         type="button"
//         data-toggle="collapse"
//         data-target="#navbarTogglerDemo02"
//         aria-controls="navbarTogglerDemo02"
//         aria-expanded="false"
//         aria-label="Toggle navigation"
//       >
//         <span className="navbar-toggler-icon"></span>
//       </button>

//       <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
//         <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
//           <li className="nav-item active">
//             <Link className="nav-link" to="/">
//               Home <span className="sr-only"></span>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/about">
//               About Us
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/contact">
//               Contact Us
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/map">
//               Map
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/user/login">
//               Login
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/user/signup">
//               Signup
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/community">
//               Community List
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/editgroup/8">
//               Edit Group
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link className="nav-link" to="/artist/login">
//               Artist Login
//             </Link>
//           </li>
//           {userRole !== 'none' && (
//             <li className="nav-item">
//               <Link className="nav-link" to="/community">
//                 Community List
//               </Link>
//             </li>
//           )}
//         </ul>
//         {location.pathname === '/map' && ( // Conditionally render the search form
//           <form className="form-inline my-2 my-lg-0">
//             <input
//               className="form-control mr-sm-2"
//               type="search"
//               placeholder="Search"
//               aria-label="Search"
//             />
//             <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
//               Search
//             </button>
//           </form>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import API from "../../../api";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [markers, setMarkers] = useState([]);
  const navigate = useNavigate();

  // Fetch markers (similar to the map page)
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await API.get("map");
        const transformedData = response.data.map((item) => ({
          id: item.id,
          name: item.groupName,
          community: item.community,
          location: item.address || "Unknown",
          instrument: "unknown",
        }));
        setMarkers(transformedData);
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    };
    fetchMarkers();
  }, []);

  // Update suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const allValues = new Set();

    markers.forEach((marker) => {
      allValues.add(marker.name);
      allValues.add(marker.community);
      allValues.add(marker.location);
      allValues.add(marker.instrument);
    });

    const filtered = [...allValues].filter((item) =>
      item.toLowerCase().includes(query)
    );
    setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
  }, [searchQuery, markers]);

  const handleSuggestionClick = (value) => {
    setSearchQuery(value);
    setSuggestions([]);
    navigate(`/search?query=${value}`); // Redirect to a search results page (optional)
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery);
    navigate(`/search?query=${searchQuery}`); // Redirect to a search results page (optional)
  };

  return (
    // <nav className="navbar navbar-expand-lg navbar-light bg-light">
    //   <Link className="navbar-brand" to="/">
    //     Rajasthan Music
    //   </Link>
    //   <button
    //     className="navbar-toggler"
    //     type="button"
    //     data-toggle="collapse"
    //     data-target="#navbarTogglerDemo02"
    //     aria-controls="navbarTogglerDemo02"
    //     aria-expanded="false"
    //     aria-label="Toggle navigation"
    //   >
    //     <span className="navbar-toggler-icon"></span>
    //   </button>

    //   <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
    //     <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
    //       <li className="nav-item active">
    //         <Link className="nav-link" to="/">
    //           Home <span className="sr-only">(current)</span>
    //         </Link>
    //       </li>
    //       <li className="nav-item">
    //         <Link className="nav-link" to="/about">
    //           About Us
    //         </Link>
    //       </li>
    //       <li className="nav-item">
    //         <Link className="nav-link" to="/contact">
    //           Contact Us
    //         </Link>
    //       </li>
    //       <li className="nav-item">
    //         <Link className="nav-link" to="/map">
    //           Map
    //         </Link>
    //       </li>
    //     </ul>

    //     {/* 🔍 Search Box */}
    //     <form className="form-inline my-2 my-lg-0" onSubmit={handleSearchSubmit}>
    //       <input
    //         className="form-control mr-sm-2"
    //         type="search"
    //         placeholder="Search by name, community, location, or instrument..."
    //         aria-label="Search"
    //         value={searchQuery}
    //         onChange={(e) => setSearchQuery(e.target.value)}
    //       />
    //       <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
    //         Search
    //       </button>
    //       {suggestions.length > 0 && (
    //         <ul className="suggestions-list">
    //           {suggestions.map((suggestion, idx) => (
    //             <li key={idx} onClick={() => handleSuggestionClick(suggestion)}>
    //               {suggestion}
    //             </li>
    //           ))}
    //         </ul>
    //       )}
    //     </form>
    //   </div>
    // </nav>

    <div className="bd-example">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button
          className="navbar-toggler"
          type="button"
          dataToggle="collapse"
          dataTarget="#navbarTogglerDemo03"
          ariaControls="navbarTogglerDemo03"
          ariaExpanded="false"
          ariaLabel="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* <a className="navbar-brand" href="#">
          Navbar
        </a> */}

        <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              {/* <a className="nav-link" href="#">
                Home <span className="sr-only">(current)</span>
              </a> */}
            </li>

            <li className="nav-item">
       <Link className="nav-link" to="/">
          Home
       </Link>
       </li>

        <li className="nav-item">
       {/* <Link className="nav-link" to="/contact">
         Contact Us
       </Link> */}
       </li>
       <li className="nav-item">
       <Link className="nav-link" to="/about">
         About Us
       </Link>
       </li>       
        {/* <li className="nav-item">
       <Link className="nav-link" to="/map">
         Map
       </Link>
       </li>   */}
       <li className="nav-item">     
       <Link className="nav-link" to="/user/signup">
        Signup
       </Link>
       </li>
        <li className="nav-item">
       <Link className="nav-link" to="/community">
         Community
       </Link>    
        </li>
        <li className="nav-item">
       <Link className="nav-link" to="/user/login">
         Login
       </Link>
       </li>
       <li className="nav-item">
       <Link className="nav-link" to="/editgroup/:id">
         Edit group
       </Link>
       </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input
              className="form-control mr-sm-2"
              type="search"
              Pad
              placeholder="Search"
              ariaLabel="Search"
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;