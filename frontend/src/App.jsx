import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./component/layout";
import Homepage from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotpassword";
import ResetPassword from "./pages/resetpassword";
import Tools from "./pages/Tools";
import GoogleDorking from "./pages/google-dorking";
// import ResetPassword from "./pages/resetpassword";


const App = () => {
return (
    <Router>
      <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/home" element={<Homepage />} />
        <Route element={<Layout />}>
          <Route path="/tools" element={<Tools />} />
          <Route path="/google-dorking" element={<GoogleDorking />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
