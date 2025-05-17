import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axiosInstance from "../api/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const res = await axiosInstance.post("/login", {
        username: username, // Use the username state
        password: password, // Use the password state
      });

      // Laravel Sanctum returns the token in the response data
      const token = res.data;

      if (token) {
        // Store the token (e.g., in localStorage or an auth context)
        localStorage.setItem("token", token); // Or use a more secure method
        alert("Login successful!");
        setIsAuthenticated(true);
        navigate("/google-dorking"); // Redirect to the home page or dashboard
      } else {
        setError("Login failed: Token not received.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data.message || "Login failed. Please check your credentials."
      );
      setUsername("");
      setPassword("");
      setStep(1);
    } finally {
      setLoading(false);
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
        setStep(2);
      } else if (step === 2) {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-green-400 font-mono flex items-center justify-center">
      <div className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-xl font-bold">Cyber Forge</h1>
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

        <div className="bg-[#1E1E1E] border border-gray-700 rounded-md p-4 overflow-hidden">
          <div>
            <span className="text-green-400">cyber@forge</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$</span>{" "}
            <span className="text-gray-500">login</span>
          </div>
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
          {error && (
            <div className="text-red-500 mt-2">
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end text-gray-500 mt-4">
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </div>
        {loading && <p className="text-yellow-400">Loading...</p>}
      </div>
    </div>
  );
};

export default Login;
