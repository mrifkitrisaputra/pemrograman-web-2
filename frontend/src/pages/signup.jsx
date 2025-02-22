import React, { useState } from "react";
import axiosInstance from "../api/api"; // Import Axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // State untuk menampilkan error
  const [successMessage, setSuccessMessage] = useState(""); // State untuk menampilkan pesan sukses
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan/sembunyikan password
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    // Validasi input
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Kirim data ke backend
      const res = await axiosInstance.post("/signup", {
        username,
        email,
        password,
        password_confirmation: confirmPassword, // Tambahkan ini
        name: username, // Jika kolom `name` diperlukan, gunakan nilai ini
      });
      console.log("Sign Up successful:", res.data);
      setSuccessMessage("Sign Up berhasil"); // Set pesan sukses
      setError(""); // Reset error message

      // Reset form setelah berhasil
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect ke halaman login setelah signup
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Tunggu 2 detik sebelum redirect
    } catch (err) {
      console.error(err);
      // Tangkap pesan error dari backend
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Set error message dari backend
      } else {
        setError("Sign Up failed. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-green-400 font-mono flex items-center justify-center">
      {/* Container Utama */}
      <div className="w-full max-w-md p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          {/* Judul */}
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
            <FontAwesomeIcon icon={faUser} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type="text"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-8 pr-2 py-1" // Padding kiri untuk ikon
              placeholder="Enter your username..."
            />
          </div>
          {/* Input Email */}
          <div className="mt-4 relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-8 pr-2 py-1" // Padding kiri untuk ikon
              placeholder="user@example.com"
            />
          </div>
          {/* Input Password */}
          <div className="mt-4 relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type={showPassword ? "text" : "password"} // Toggle antara "text" dan "password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-8 pr-8 py-1" // Padding kiri untuk ikon, kanan untuk mata
              placeholder="Enter your password..."
            />
            {/* Div untuk Show/Hide Password */}
            <div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)} // Toggle state showPassword
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> {/* FontAwesomeIcon */}
            </div>
          </div>
          {/* Input Confirm Password */}
          <div className="mt-4 relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type={showPassword ? "text" : "password"} // Toggle antara "text" dan "password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pl-8 pr-8 py-1" // Padding kiri untuk ikon, kanan untuk mata
              placeholder="Confirm your password"
            />
            {/* Div untuk Show/Hide Password */}
            <div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-400 cursor-pointer"
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
          {successMessage && (
            <div className="text-green-500 mt-2">
              <span>{successMessage}</span>
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
          {/* Sign Up */}
          <div
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={handleSubmit} // Handle submit
          >
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;