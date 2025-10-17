// HeroSection.jsx
import React from "react";

const RegHeroSection = () => {
  return (
    <section className="relative w-full h-[406px] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url("/reghero.png")`, // replace with your image
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10 "></div>

      {/* Content */}
      <div className="relative z-20 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 top-15 max-w-4xl">
        <h1 className="text-white font-semibold text-xl sm:text-2xl md:text-3xl lg:text-[41.78px] leading-snug">
          <div>
            The first <span className="font-extrabold"> AI-driven </span>
          </div>
          <div>
            <span className="font-extrabold">collaboration</span> hub for
            industrial
          </div>
          <div>plants and OEM ecosystems</div>
        </h1>
      </div>
    </section>
  );
};

export default RegHeroSection;
