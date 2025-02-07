import React, { useState, useEffect } from "react";
import axiosInstance from "../api/api"; // Import Axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan/sembunyikan password

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  // Validasi token saat halaman dimuat
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid or missing token.");
        setTimeout(() => navigate("/forgot-password"), 3000); // Redirect ke forgot password jika token tidak ada
        return;
      }

      try {
        // Kirim token ke backend untuk validasi
        await axiosInstance.post("/reset-password", { token });
      } catch (err) {
        console.error(err);

        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error); // Tangkap pesan error dari backend
        } else {
          setError("Invalid or expired token.");
        }

        setTimeout(() => navigate("/forgot-password"), 3000); // Redirect ke forgot password jika token tidak valid
      }
    };

    validateToken();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Kirim request ke backend
      await axiosInstance.post("/reset-password", { token, password });

      console.log("Password reset successful");
      setSuccess(true);
      setError("");

      // Arahkan pengguna ke halaman login setelah 2 detik
      setTimeout(() => {
        navigate("/login"); // Navigasi ke halaman login
      }, 2000);

      alert("Your password has been reset successfully! Redirecting to login...");
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Tangkap pesan error dari backend
      } else {
        setError("Something went wrong. Please try again later.");
      }

      setTimeout(() => setError(""), 3000); // Error hilang setelah 3 detik
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
      {/* Container Utama */}
      <div className="w-full max-w-md p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          {/* Judul */}
          <h1 className="text-xl font-bold">Reset Password</h1>
          <p className="text-sm">Enter your new password.</p>
        </div>

        {/* Terminal */}
        <div className="bg-black border border-gray-700 rounded-md p-4 overflow-hidden">
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
              type={showPassword ? "text" : "password"} // Toggle antara "text" dan "password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-6 pr-8 py-1" // Padding kiri untuk ikon, kanan untuk mata
              placeholder="Enter your new password"
            />
            {/* Div untuk Show/Hide Password */}
            <div
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)} // Toggle state showPassword
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> {/* FontAwesomeIcon */}
            </div>
          </div>

          {/* Input Confirm Password */}
          <div className="mt-4 relative">
            <FontAwesomeIcon icon={faLock} className="absolute top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type={showPassword ? "text" : "password"} // Toggle antara "text" dan "password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-6 pr-8 py-1" // Padding kiri untuk ikon, kanan untuk mata
              placeholder="Confirm your new password"
            />
            {/* Div untuk Show/Hide Password */}
            <div
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)} // Toggle state showPassword
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> {/* FontAwesomeIcon */}
            </div>
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
              <span>Your password has been reset successfully! Redirecting...</span>
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

export default ResetPassword;