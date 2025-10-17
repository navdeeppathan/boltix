import React from "react";
import Header from "../../utils/Header";
import RegHeroSection from "./RegHeroSection";
import RegisterOptions from "./RegisterOptions";
import CompanyRegistrationForm from "../../auth/CompanyRegistrationForm";
import HowItWorks from "./HowItWorks";
import Footer from "../../utils/Footer";

const RegisterPage = () => {
  return (
    <div>
      <div>
        <Header />
        <RegHeroSection />
        <RegisterOptions />
        {/* <CompanyRegistrationForm /> */}
        <HowItWorks />
        <Footer />
      </div>
    </div>
  );
};

export default RegisterPage;
