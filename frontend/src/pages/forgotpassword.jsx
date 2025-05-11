import React, { useState } from "react";
import axiosInstance from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validasi input
    if (!email) {
      setError("Email is required.");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      // Kirim request ke backend
      await axiosInstance.post("/forgot-password", { email });

      alert("Password reset link has been sent to your email!");
      navigate("/login");

    } catch (err) {
      console.error(err);

      const errorMessage = err.response?.data?.error || "Failed to send reset link.";
      setError(errorMessage);
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-green-400 font-mono flex items-center justify-center">
      {/* Container Utama */}
      <div className="w-full max-w-md p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold">Forgot Password</h1>
          <p className="text-sm">Enter your email to receive a password reset link.</p>
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
              disabled={isLoading}
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-6 pr-2 py-1"
              placeholder="user@example.com"
            />
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
            onClick={handleSubmit}
            disabled={isLoading}
            className={`text-blue-400 cursor-pointer hover:underline ${isLoading ? 'opacity-50' : ''}`}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;