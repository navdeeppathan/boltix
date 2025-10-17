import React from "react";
import HeroSection from "./landing/HeroSection";
import ChallengeSection from "./landing/ChallengeSection";
import SolutionsSection from "./landing/SolutionsSection";
import PricingSection from "./landing/PricingSection";
import TestimonialsSection from "./landing/TestimonialsSection";
import Footer from "../utils/Footer";
import Header from "../utils/Header";

const LandingPage = () => {
  return (
    <div>
      <div>
        <Header />
        <HeroSection />
        <ChallengeSection />
        <SolutionsSection />
        <PricingSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
