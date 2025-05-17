import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Protected route middleware component
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    alert("login dulu lek")
    return <Navigate to="/login" replace />;
  }

  // Render the layout with the Outlet for nested routes if authenticated
  return <Outlet />;
};

export default PrivateRoute;