import React from "react";
import LoginPage from "../../auth/LoginPage";
import Header from "../../utils/Header";
import RegHeroSection from "../register/RegHeroSection";
import Footer from "../../utils/Footer";
import ForgotPassword from "../../auth/ForgotPassword";
import { Route, Routes } from "react-router-dom";

const LoginLayoutPage = () => {
  return (
    <div>
      <div>
        <Header />
        <RegHeroSection />
        {/* <LoginPage /> */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

export default LoginLayoutPage;
