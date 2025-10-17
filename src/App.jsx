import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import RegisterPage from "./components/register/RegisterPage";
import LoginLayoutPage from "./components/login/LoginLayoutPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./middleware/ProtectedRoute";
import PublicRoute from "./middleware/PublicRoute";
import ManagerDashboard from "./manager/ManagerDashboard";
import AboutUs from "./utils/Aboutus";
import ServiceProcess from "./utils/ServiceProcess";
import PricingPage from "./utils/PricingPage";
import ContactForm from "./utils/ContactForm";

//Import React Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Terms from "./utils/Terms";
import Contact from "./utils/Contact";
const App = () => {
  return (
    <BrowserRouter>
      {/* Global Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login/*"
          element={
            <PublicRoute>
              <LoginLayoutPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute role="company">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/dashboard/*"
          element={
            <ProtectedRoute role="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/process" element={<ServiceProcess />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/contact-us" element={<Contact />} />

        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
