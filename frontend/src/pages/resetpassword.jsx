import React, { useState, useEffect } from "react";
import axiosInstance from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");

  console.log("Token:", token);
  console.log("Email:", email);

  // Validasi token saat halaman dimuat
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        setError("Invalid or missing token.");
        setTimeout(() => navigate("/forgot-password"), 3000);
        return;
      }

      try {
        const res = await axiosInstance.get("/check-reset-token", {
          params: { token, email },
        });

        console.log("Token valid:", res.data.message);
      } catch (err) {
        console.error(err);

        const errorMessage =
          err.response?.data?.error ||
          "Invalid or expired token.";

        setError(errorMessage);

        setTimeout(() => navigate("/forgot-password"), 3000);
    }
    };

    validateToken();
  }, [token, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      console.log("Password reset successful:", res.data);
      
      alert("Your password has been successfully reset!");
      navigate("/login");
    } catch (err) {
      console.error("Error resetting password:", err);

      const errorMessage =
        err.response?.data?.error ||
        "Something went wrong. Please try again later.";

      setError(errorMessage);
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
          <h1 className="text-xl font-bold">Reset Password</h1>
          <p className="text-sm">Enter your new password.</p>
        </div>

        {/* Terminal */}
        <div className="bg-[#1E1E1E] border border-gray-700 rounded-md p-4 overflow-hidden">
          {/* Prompt New Password */}
          <div>
            <span className="text-green-400">cyber@forge</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$</span>{" "}
            <span className="text-gray-500">reset-password</span>
          </div>

          {/* Input New Password */}
          <div className="mt-4 relative">
            <FontAwesomeIcon icon={faLock} className="absolute top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type={showPassword ? "text" : "password"}
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-6 pr-8 py-1"
              placeholder="Enter your new password"
            />
            <div
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mt-4 relative">
            <FontAwesomeIcon icon={faLock} className="absolute top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-6 pr-8 py-1"
              placeholder="Confirm your new password"
            />
            <div
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-400 cursor-pointer"
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

          {/* Tombol Submit */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </div>

        {/* Footer Options */}
        <div className="flex justify-between text-gray-500 mt-4">
          <div
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;