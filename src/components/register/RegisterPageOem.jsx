import React from "react";
import Header from "../../utils/Header";
import RegHeroSection from "./RegHeroSection";
import RegisterOptions from "./RegisterOptions";
import CompanyRegistrationForm from "../../auth/CompanyRegistrationForm";
import HowItWorks from "./HowItWorks";
import Footer from "../../utils/Footer";
import RegisterOptionsOem from "./RegisterOptionsOem";

const RegisterPageOem = () => {
  return (
    <div>
      <div>
        <Header />
        {/* <RegHeroSection /> */}
        <RegisterOptionsOem />
        {/* <CompanyRegistrationForm /> */}
        <HowItWorks />
        <Footer />
      </div>
    </div>
  );
};

export default RegisterPageOem;
