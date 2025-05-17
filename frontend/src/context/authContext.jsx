import { createContext, useContext, useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert('Anda harus login terlebih dahulu')
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
