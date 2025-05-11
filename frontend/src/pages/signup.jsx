import React, { useState } from "react";
import axiosInstance from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Untuk pop-up
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi input
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axiosInstance.post("/signup", {
        username,
        email,
        password,
        password_confirmation: confirmPassword,
        name: username,
      });

      console.log("Sign Up successful:", res.data);

      // Tampilkan notifikasi popup
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.email) {
        setError(err.response.data.email[0]);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <>
      {/* Modal Pop-up */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] border border-green-400 rounded-md p-6 max-w-sm w-full text-center animate-bounce-in">
            <h2 className="text-green-400 text-lg font-bold mb-2">
              Verifikasi Email
            </h2>
            <p className="text-white mb-4">
              Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#2D2D2D] hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Lanjut ke Login
            </button>
          </div>
        </div>
      )}

      {/* Form Signup */}
      <div className="min-h-screen bg-[#1E1E1E] text-green-400 font-mono flex items-center justify-center">
        <div className="w-full max-w-md p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Cyber Forge</h1>
            <p className="text-sm">Create your account</p>
          </div>

          {/* Terminal */}
          <div className="bg-[#1E1E1E] border border-gray-600 rounded-md p-4 overflow-hidden">
            {/* Prompt Username */}
            <div>
              <span className="text-green-400">cyber@forge</span>
              <span className="text-white">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-white">$</span>{" "}
              <span className="text-gray-500">signup</span>
            </div>

            {/* Input Username */}
            <div className="mt-4 relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500"
              />
              <input
                type="text"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-8 pr-2 py-1"
                placeholder="Enter your username..."
              />
            </div>

            {/* Input Email */}
            <div className="mt-4 relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-8 pr-2 py-1"
                placeholder="user@example.com"
              />
            </div>

            {/* Input Password */}
            <div className="mt-4 relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-8 pr-8 py-1"
                placeholder="Enter your password..."
              />
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mt-4 relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-8 pr-8 py-1"
                placeholder="Confirm your password"
              />
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 mt-2">
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Footer Options */}
          <div className="flex justify-between text-gray-500 mt-4">
            <div
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </div>
            <button
              type="submit"
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
