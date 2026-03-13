import React from "react";
import HeroSection from "./landing/HeroSection";
import ChallengeSection from "./landing/ChallengeSection";
import SolutionsSection from "./landing/SolutionsSection";
import PricingSection from "./landing/PricingSection";
import TestimonialsSection from "./landing/TestimonialsSection";
import Footer from "../utils/Footer";
import Header from "../utils/Header";
import CoupaHero from "./landing/CoupaHero";

const LandingPage = () => {
  return (
    <div>
      <div>
        <Header />
        <HeroSection />
        <CoupaHero />
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
