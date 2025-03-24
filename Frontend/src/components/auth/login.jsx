// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    setError('');
    setIsLoading(true); // Start loading

    const loginData = { email, password };

    try {
      const response = await axios.post('http://localhost:8000/login/', loginData, {
        withCredentials: true,
      });
      navigate('/');
    } catch (err) {
      setError('email or password is wrong, please try again');
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={isLoading} className={isLoading ? 'button-loading' : ''}>
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <p>
        Need an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;