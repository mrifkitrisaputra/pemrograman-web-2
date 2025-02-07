import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // Step untuk mengatur input username/password
  const [mode, setMode] = useState("login"); // Mode: "login", "signup", atau "forgot"
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan/sembunyikan password

  const handleSubmit = async () => {
    try {
      let endpoint = "";
      if (mode === "login") {
        endpoint = "/api/login";
      } else if (mode === "signup") {
        endpoint = "/api/signup";
      } else if (mode === "forgot") {
        endpoint = "/api/forgot-password";
      }

      const res = await axios.post(`http://localhost:8080${endpoint}`, {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert(`${mode === "login" ? "Login" : mode === "signup" ? "Sign Up" : "Password Reset"} successful`);
    } catch (err) {
      console.error(err);
      setError(true);
      setTimeout(() => setError(false), 3000); // Error hilang setelah 3 detik
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
          <h1 className="text-2xl font-bold">Kali Linux</h1>
          {/* Welcome + Sign Up */}
          <div className="flex justify-between items-center">
            <p className="text-sm">Welcome to the system</p>
            <span
              className="text-blue-400 cursor-pointer hover:underline text-sm"
              onClick={() => setMode("signup")}
            >
              Sign Up
            </span>
          </div>
        </div>

        {/* Terminal */}
        <div className="bg-black border border-gray-700 rounded-md p-4 overflow-hidden">
          {/* Prompt Username */}
          <div>
            <span className="text-green-400">kali@linux</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$</span>{" "}
            <span className="text-gray-500">{mode === "login" ? "login" : mode === "signup" ? "signup" : "forgot-password"}</span>
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
                placeholder="toor"
              />
              {/* Div untuk Show/Hide Password */}
              <div
                className="absolute right-0 top-1/2 transform text-gray-500 hover:text-green-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)} // Toggle state showPassword
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> {/* FontAwesomeIcon */}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-500 mt-2">
              <span>{mode === "login" ? "Authentication failed." : mode === "signup" ? "Sign Up failed." : "Password reset failed."}</span>
            </div>
          )}
        </div>

        {/* Footer Options */}
        <div className="flex justify-end text-gray-500 mt-4">
          {/* Forgot Password Option */}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => setMode("forgot")}
          >
            Forgot Password?
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;