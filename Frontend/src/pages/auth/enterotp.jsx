import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaMobileAlt, FaRedo } from "react-icons/fa";
import { useUser } from "../../../contextapi"; // Adjust path
import "./auth.css";

const EnterOTP = () => {
  const location = useLocation();
  const { mobileNo } = location.state || {};
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const navigate = useNavigate();
  const otpInputRef = useRef(null);
  const { login } = useUser(); // Access login function for artist

  useEffect(() => {
    if (otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || !mobileNo) return;
    setError("");
    setSuccess("");
    setIsLoading(true);
  
    const loginData = { mobileNo, otp };
  
    try {
      const response = await axios.post(
        "http://localhost:8000/artist/login/verifyotp/",
        loginData,
        { withCredentials: true }
      );
      const { site_id, ...userData } = response.data; // Extract site_id and other user data
      login({ ...userData, role: "artist", communityId: site_id }); // Store communityId
      navigate(`/communitypage/${site_id}`);
    } catch (err) {
      setError("Invalid OTP, please try again.");
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0 || !mobileNo) return;
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await axios.post("http://localhost:8000/artist/login/sendotp/", {
        mobileNo: mobileNo,
      });
      setSuccess("OTP resent successfully!");
      setResendTimer(60);
    } catch (err) {
      setError("Failed to resend OTP. Try again later.");
      console.error("Resend OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOtpVisibility = () => {
    setShowOtp(!showOtp);
  };

  return (
    <div className="auth-wrapper">
      <h2>Verify Your OTP</h2>
      <p className="auth-instruction">
        <FaMobileAlt className="auth-icon" /> We’ve sent an OTP to{" "}
        <strong>{mobileNo || "your number"}</strong>.
      </p>
      {error && <p className="auth-error">{error}</p>}
      {success && <p className="auth-success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="auth-password-container">
          <input
            type={showOtp ? "text" : "password"}
            className="auth-input"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            ref={otpInputRef}
            maxLength="6"
            required
          />
          <span className="auth-eye-icon" onClick={toggleOtpVisibility}>
            {showOtp ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="auth-button-container">
          <button
            type="submit"
            className={`auth-button ${isLoading ? "auth-button-loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </form>

      <div className="auth-resend">
        <button
          className="auth-resend-button"
          onClick={handleResendOTP}
          disabled={resendTimer > 0 || isLoading}
        >
          {resendTimer > 0
            ? `Resend in ${resendTimer}s`
            : "Resend OTP"}
          {!resendTimer && <FaRedo className="auth-icon resend-icon" />}
        </button>
      </div>

      <p className="auth-footer">
        Wrong number?{" "}
        <a href="/artist/login" className="auth-link">
          Change Mobile Number
        </a>
      </p>
    </div>
  );
};

export default EnterOTP;