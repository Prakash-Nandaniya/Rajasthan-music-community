import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import AboutUs from './components/aboutus/aboutus';
import ContactUs from './components/contactus/contactus';
import Home from './components/home/home';
import MapPage from './components/map/mappage';
import CommunityList from './components/communitylist/communitylist';
import CommunityDetail from './components/communitydetail/communitydetail';
import CommunityForm from './pages/communityform/form';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/community" element={<CommunityList />} />
        <Route path="/community/:id" element={<CommunityDetail />} />
        <Route path="/communityform" element={<CommunityForm />} />
      </Routes>
    </Router>
  );
}

export default App;
