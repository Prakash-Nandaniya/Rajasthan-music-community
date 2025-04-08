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
import MapData from './components/mapdata';
import EditGroup from './pages/editgroup/editgroup';
import ArtistLogin from './components/auth/artistlogin';
import EnterOTP from './components/auth/enterotp';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/community" element={<CommunityList />} />
        <Route path="/community/:id" element={<CommunityDetail />} />
        <Route path="/communityform" element={<CommunityForm />} />
        <Route path="/checkint" element={<MapData />} />
        <Route path="/editgroup/:id" element={<EditGroup  />} />
        <Route path="/artist/login" element={<ArtistLogin />} />
        <Route path="/artist/enterotp" element={<EnterOTP />} />
      </Routes>
    </Router>
  );
}

export default App;
