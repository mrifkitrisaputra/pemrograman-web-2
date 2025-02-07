// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotpassword";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Halaman Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        {/* Halaman Signup */}
        <Route path="/signup" element={<Signup />} />
        {/* Halaman Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
};

export default App;