import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import Logo from "../assets/logo.png";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [logoutInput, setLogoutInput] = useState("");
  const username = "miquela";
  const dropdownRef = useRef(null);
  const location = useLocation(); // Dapatkan lokasi halaman saat ini

  const navItems = [
    { name: "Home", link: "/home" },
    { name: "Tools", link: "/tools" },
    { name: "Google Dorking", link: "/google-dorking" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="py-5 px-8 flex justify-between items-center z-50 relative">
      {/* Logo */}
      <div className="text-2xl font-bold flex items-center space-x-7">
        <img src={Logo} alt="Cyber Forge Logo" className="h-10 w-10" />
        <span className="text-white">Cyber Forge</span>
      </div>

      {/* Navigation Menu */}
      <div className="flex items-center space-x-10">
        {navItems.map((item, index) => (
          <Link key={index} to={item.link}>
            <div
              className={`relative cursor-pointer px-3 py-1 transition-colors ${
                location.pathname === item.link
                  ? "text-green-400" // Warna hijau jika aktif
                  : "text-white hover:text-green-400"
              }`}
            >
              {item.name}
              <span
                className={`absolute bottom-0 left-0 w-full h-[2px] transition-transform duration-200 ease-in-out ${
                  location.pathname === item.link ? "bg-green-400 scale-x-100" : "bg-white scale-x-0 hover:scale-x-100"
                }`}
              ></span>
            </div>
          </Link>
        ))}

        {/* Profile Dropdown */}
        <div ref={dropdownRef} className="relative">
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-[#404040] transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-semibold">
                {username[0].toUpperCase()}
              </span>
            </div>
            <span className="text-white font-medium hover:text-green-400 transition-colors">{username}</span>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <p className="text-sm text-gray-400">Signed in as</p>
                <p className="text-white font-medium truncate">{username}</p>
              </div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsLogoutPopupOpen(true);
                }}
                className="w-full px-4 py-3 text-left text-red-400 hover:bg-[#2A2A2A] transition-colors flex items-center space-x-2"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Background Overlay and Popup */}
      {isLogoutPopupOpen && (
        <>
          {/* Background Overlay */}
          <div
            className="fixed inset-0 backdrop-blur-[2.5px] z-40"
            onClick={(e) => {
              e.stopPropagation(); // Prevent clicks on overlay from closing the popup
            }}
          ></div>

          {/* Popup */}
          <div
            className="fixed inset-0 flex justify-center items-center z-50"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside popup from closing it
          >
            <div
              className="bg-[#1E1E1E] rounded-lg p-6 w-96 border border-gray-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Ensure only popup is clickable
            >
              <h2 className="text-white text-xl font-bold mb-4">Confirm Logout</h2>
              <p className="text-gray-300 mb-4">
                Type your username <span className="font-semibold text-red-400">"{username}"</span> to confirm logout
              </p>
              <input
                type="text"
                value={logoutInput}
                onChange={(e) => setLogoutInput(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter username"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsLogoutPopupOpen(false)} // Close popup on cancel
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (logoutInput === username) {
                      console.log("User logged out");
                      setIsLogoutPopupOpen(false); // Close popup after logout
                    }
                  }}
                  disabled={logoutInput !== username}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    logoutInput === username
                      ? "bg-red-500 hover:bg-red-600 text-red-400"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;