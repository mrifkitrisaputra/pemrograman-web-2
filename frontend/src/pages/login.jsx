import React, { useState } from "react";
import axios from "axios"; // 🔥 Harus di-import
import axiosInstance from "../api/api"; // Axios instance kamu
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Cegah refresh halaman

    try {
      // Ambil CSRF cookie dulu
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      const res = await axiosInstance.post("/login", {
        username,
        password,
      });

      if (res.data.redirect) {
        alert("Login successful");
        window.location.href = res.data.redirect;
      }

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);

      if (err.response && err.response.status === 401) {
        setError(err.response.data.error || "Invalid credential");
        setStep(1);
        setUsername("");
        setPassword("");
      } else {
        setError("Authentication failed. Please try again.");
      }

      
      setTimeout(() => setError(""), 3000);
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
        handleSubmit(e); // Submit form
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
          <h1 className="text-xl font-bold">Cyber Forge</h1>
          {/* Welcome + Sign Up */}
          <div className="flex justify-between items-center">
            <p className="text-sm">Welcome to the system</p>
            <span
              className="text-blue-400 cursor-pointer hover:underline text-sm"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </div>
        </div>

        {/* Terminal */}
        <div className="bg-[#1E1E1E] border border-gray-700 rounded-md p-4 overflow-hidden">
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
                type={showPassword ? "text" : "password"}
                autoFocus
                value={password}
                onChange={handleInput}
                onKeyPress={handleKeyPress}
                className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full pr-8"
                placeholder="password..."
              />
              <div
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
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
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;