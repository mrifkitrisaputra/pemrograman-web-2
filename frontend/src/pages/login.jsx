import React, { useState } from "react";
import axiosInstance from "../api/api"; // Import Axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // Step untuk mengatur input username/password
  const [error, setError] = useState(""); // State untuk menampilkan error
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan/sembunyikan password

  const navigate = useNavigate(); // Inisialisasi useNavigate

  const handleSubmit = async () => {
    try {
      // Validasi input
      if (!username || !password) {
        setError("Username and password are required.");
        return;
      }

      // Kirim data ke backend
      const res = await axiosInstance.post("/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token); // Simpan token di localStorage
      alert("Login successful");
      navigate("/dashboard"); // Redirect ke halaman dashboard atau halaman utama setelah login
    } catch (err) {
      console.error(err);

      // Tangkap pesan error dari backend
      if (err.response && err.response.data && err.response.data.error) {
        const errorMessage = err.response.data.error;

        if (errorMessage === "Invalid username or password") {
          // Kembalikan ke input username jika username salah
          setError("Invalid username or password. Please try again.");
          setStep(1); // Reset ke input username
          setUsername(""); // Kosongkan username
          setPassword(""); // Kosongkan password
        } else {
          setError(errorMessage); // Tampilkan pesan error lainnya
        }
      } else {
        setError("Authentication failed. Please try again later.");
      }
    }
  };

  const handleInput = (e) => {
    if (step === 1) {
      setUsername(e.target.value);
    } else if (step === 2) {
      setPassword(e.target.value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (step === 1) {
        setStep(2); // Pindah ke input password
      } else if (step === 2) {
        handleSubmit(); // Submit form
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
      {/* Container Utama */}
      <div className="w-full max-w-md p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          {/* Judul */}
          <h1 className="text-xl font-bold">Cyber Forge</h1>
          {/* Welcome + Sign Up */}
          <div className="flex justify-between items-center">
            <p className="text-sm">Welcome to the system</p>
            <span
              className="text-blue-400 cursor-pointer hover:underline text-sm"
              onClick={() => navigate("/signup")} // Navigasi ke halaman Signup
            >
              Sign Up
            </span>
          </div>
        </div>
        {/* Terminal */}
        <div className="bg-black border border-gray-700 rounded-md p-4 overflow-hidden">
          {/* Prompt Username */}
          <div>
            <span className="text-green-400">cyber@forge</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$</span>{" "}
            <span className="text-gray-500">login</span>
          </div>
          {/* Input Username */}
          {step === 1 && (
            <div>
              <span className="text-green-400">Username:</span>{" "}
              <input
                type="text"
                autoFocus
                value={username}
                onChange={handleInput}
                onKeyPress={handleKeyPress}
                className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full"
                placeholder="root"
              />
            </div>
          )}
          {/* Input Password */}
          {step === 2 && (
            <div className="relative">
              <span className="text-green-400">Password:</span>{" "}
              <input
                type={showPassword ? "text" : "password"} // Toggle antara "text" dan "password"
                autoFocus
                value={password}
                onChange={handleInput}
                onKeyPress={handleKeyPress}
                className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pr-8" // Tambahkan padding kanan untuk ruang ikon
                placeholder="password..."
              />
              {/* Div untuk Show/Hide Password */}
              <div
                className="absolute right-0 top-1/2 transform  text-gray-500 hover:text-green-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)} // Toggle state showPassword
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> {/* FontAwesomeIcon */}
              </div>
            </div>
          )}
          {/* Error Message */}
          {error && (
            <div className="text-red-500 mt-2">
              <span>{error}</span>
            </div>
          )}
        </div>
        {/* Footer Options */}
        <div className="flex justify-end text-gray-500 mt-4">
          {/* Forgot Password Option */}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")} // Navigasi ke halaman Forgot Password
          >
            Forgot Password?
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;