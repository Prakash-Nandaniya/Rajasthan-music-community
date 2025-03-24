// src/components/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './auth.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [countryQuery, setCountryQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Germany', 'France',
    'Brazil', 'Japan', 'South Africa', 'Mexico', 'China', 'Russia', 'Italy', 'Spain',
  ];

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countryQuery.toLowerCase())
  );

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    setError('');
    setIsLoading(true); // Start loading
    console.log('Form submitted with email:', email);

    if (!email) {
      setError('Email is required');
      console.log('Email is empty');
      setIsLoading(false);
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      console.log('Invalid email format:', email);
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password is too short (minimum 8 characters)');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const signupData = {
      first_name: firstName,
      last_name: lastName,
      country,
      email,
      password,
    };

    console.log('Sending signup data:', signupData);

    try {
      const response = await axios.post('http://localhost:8000/signup', signupData, {
        withCredentials: true,
      });
      console.log('Signup response:', response.data);
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err.response);
      const errorMessage = err.response?.data?.email?.[0] || err.response?.data?.message || 'Signup failed';
      if (errorMessage.includes('custom user with this email already exists')) {
        setError('This email is already registered');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry);
    setCountryQuery(selectedCountry);
    setIsDropdownOpen(false);
  };

  const handleCountryInputChange = (e) => {
    setCountryQuery(e.target.value);
    setIsDropdownOpen(true);
    setCountry(e.target.value);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <div className="country-selector">
          <input
            type="text"
            placeholder="Country"
            value={countryQuery}
            onChange={handleCountryInputChange}
            onFocus={() => setIsDropdownOpen(true)}
            required
          />
          {isDropdownOpen && countryQuery && filteredCountries.length > 0 && (
            <ul className="country-dropdown">
              {filteredCountries.map((c) => (
                <li
                  key={c}
                  onClick={() => handleCountrySelect(c)}
                  className="country-option"
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="password-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button type="submit" disabled={isLoading} className={isLoading ? 'button-loading' : ''}>
          {isLoading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;