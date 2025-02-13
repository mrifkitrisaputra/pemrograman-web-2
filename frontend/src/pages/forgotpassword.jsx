import React, { useState } from "react";
import axiosInstance from "../api/api"; // Import Axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // Inisialisasi useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Kirim request ke backend
      const res = await axiosInstance.post("/forgot-password", {
        email,
      });

      console.log("Password reset request sent:", res.data);
      setSuccess(true);
      setError("");
      alert("Password reset link has been sent to your email!");
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Tangkap pesan error dari backend
      } else {
        setError("Failed to send password reset link.");
      }

      setTimeout(() => setError(""), 3000); // Error hilang setelah 3 detik
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-green-400 font-mono flex items-center justify-center">
      {/* Container Utama */}
      <div className="w-full max-w-md p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          {/* Judul */}
          <h1 className="text-xl font-bold">Forgot Password</h1>
          <p className="text-sm">Enter your email to reset your password.</p>
        </div>

        {/* Terminal */}
        <div className="bg-[#1E1E1E] border border-gray-700 rounded-md p-4 overflow-hidden">
          {/* Prompt Email */}
          <div>
            <span className="text-green-400">cyber@forge</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$</span>{" "}
            <span className="text-gray-500">forgot-password</span>
          </div>

          {/* Input Email */}
          <div className="mt-4 relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-6 pr-2 py-1" // Padding kiri untuk ikon
              placeholder="user@example.com"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 mt-2">
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="text-green-400 mt-2">
              <span>Password reset link has been sent to your email!</span>
            </div>
          )}
        </div>

        {/* Footer Options */}
        <div className="flex justify-between text-gray-500 mt-4">
          {/* Back to Login */}
          <div
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")} // Navigasi ke halaman login
          >
            Back to Login
          </div>

          {/* Submit Button */}
          <div
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={handleSubmit} // Handle submit
          >
            Reset Password
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;