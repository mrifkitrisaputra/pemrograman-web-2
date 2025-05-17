import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Layout from "./component/layout";

// Pages
import Homepage from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotpassword";
import ResetPassword from "./pages/resetpassword";
import Tools from "./pages/Tools";
import GoogleDorking from "./pages/google-dorking";

// Auth
import { AuthProvider } from "./context/authContext";
import PrivateRoute from "./component/privateRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes (Require Login) */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Homepage />
              </PrivateRoute>
            }
          />

          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/tools" element={<Tools />} />
            <Route path="/google-dorking" element={<GoogleDorking />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
