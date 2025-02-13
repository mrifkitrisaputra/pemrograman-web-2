// Navbar.tsx
import { useState } from 'react';

const Navbar = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logoutInput, setLogoutInput] = useState('');
  const username = "miquela"; // Ganti dengan username sesungguhnya

  const handleLogout = () => {
    // Implementasi logic logout disini
    console.log("User logged out");
    setIsLogoutModalOpen(false);
    setIsProfileModalOpen(false);
  };

  return (
    <nav className="bg-red p-4 border-b border-gray-700">
      <div className="container mx-auto flex justify-end">
        <button 
          onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
          className="flex items-center space-x-2 hover:bg-gray-700 rounded-full p-2 transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white">{username[0]}</span>
          </div>
        </button>

        {/* Profile Modal */}
        {isProfileModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setIsProfileModalOpen(false)}
          >
            <div 
              className="bg-[#1E1E1E] rounded-lg p-6 w-64 border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                  <span className="text-white text-xl">{username[0]}</span>
                </div>
                <h3 className="text-white font-semibold">{username}</h3>
              </div>
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {isLogoutModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setIsLogoutModalOpen(false)}
          >
            <div 
              className="bg-[#1E1E1E] rounded-lg p-6 w-96 border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-white text-xl font-bold mb-4">Confirm Logout</h2>
              <p className="text-gray-300 mb-4">
                Type your username <span className="font-semibold">{username}</span> to confirm logout
              </p>
              <input
                type="text"
                value={logoutInput}
                onChange={(e) => setLogoutInput(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={logoutInput !== username}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    logoutInput === username 
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;