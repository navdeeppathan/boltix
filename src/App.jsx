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
import TechnicianDashboard from "./Technician/TechnicianDashboard";
import PlantDashboard from "./PlantSupervisor/pages/PlantDashboard";
import VideoCallUser from "../videocall/VideoCallUser";
import VideoCallSupplier from "../videocall/VideoCallSupplier";
import VoiceCallUser from "../videocall/VoiceCallUser";
import BoltixLogin from "./auth/BoltixLogin";
import PlantSupervisorLoginPage from "./auth/PlantSupervisorLoginPage";
import PlantUserLoginPage from "./auth/PlantUserLoginPage";
import OEMUserLoginPage from "./auth/OEMUserLoginPage";
import OEMSupervisorLoginPage from "./auth/OEMSupervisorLoginPage";
import BoltixRegister from "./auth/BoltixRegister";
import RegisterPageOem from "./components/register/RegisterPageOem";

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
        {/* <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        /> */}
        {/* <Route
          path="/login/*"
          element={
            <PublicRoute>
              <LoginLayoutPage />
            </PublicRoute>
          }
        /> */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <BoltixLogin />
            </PublicRoute>
          }
        />

        <Route
          path="/plant-supervisor-login"
          element={
            <PublicRoute>
              <PlantSupervisorLoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/plant-user-login"
          element={
            <PublicRoute>
              <PlantUserLoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/oem-user-login"
          element={
            <PublicRoute>
              <OEMUserLoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/oem-supervisor-login"
          element={
            <PublicRoute>
              <OEMSupervisorLoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/boltix-registeration"
          element={
            <PublicRoute>
              <BoltixRegister />
            </PublicRoute>
          }
        />

        <Route
          path="/plant-operator-registration"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/oem-service-provider-registration"
          element={
            <PublicRoute>
              <RegisterPageOem />
            </PublicRoute>
          }
        />
        <Route
          path="/video-user/:name/:ticketId/:userId"
          element={<VideoCallUser />}
        />

        <Route path="/voice-call" element={<VoiceCallUser />} />
        <Route
          path="/video-supplier/:name/:ticketId/:userId"
          element={<VideoCallSupplier />}
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
            <ProtectedRoute role="oemsupervisor">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plant-supervisor/dashboard/*"
          element={
            <ProtectedRoute role="plantSupervisor">
              <PlantDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/technician/dashboard/*"
          element={
            <ProtectedRoute role="technician">
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<AboutUs />} />
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
