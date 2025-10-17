import React from "react";
import PricingSection from "../components/landing/PricingSection";
import Header from "./Header";
import Footer from "./Footer";

const PricingPage = () => {
  return (
    <div>
      <Header />
      <div className="mt-20">
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
