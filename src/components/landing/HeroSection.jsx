import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <section className="relative w-full h-screen mt-24">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url("/bgimg.png")`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center items-start py-4 px-4 sm:px-8 md:px-16 lg:px-32 text-white">
        {/* Sidebar Overlay (when open) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        {/* Hero Text */}
        <div className="mt-12 sm:mt-16 md:mt-20 max-w-full sm:max-w-xl md:max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-snug sm:leading-snug md:leading-tight lg:leading-tight">
            The first <span className="font-bold">AI-driven</span>
            <br />
            <span className="font-bold"> collaboration</span> hub for industrial{" "}
            <br /> plants and OEM ecosystems.
          </h1>
        </div>

        <div className="hidden md:flex flex-col items-center absolute right-4 sm:right-8 lg:right-120 bottom-4 sm:bottom-8 lg:bottom-32">
          <img
            src="/bgimg3.png"
            alt="Pointer"
            className="w-10 sm:w-12 lg:w-[45px] h-auto animate-glow"
          />
        </div>
        <style>
          {`
          @keyframes glow {
              0%, 100% {
                filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))
                        drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
                opacity: 0.9;
              }
              50% {
                filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))
                        drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
                opacity: 1;
              }
            }

            .animate-glow {
              animation: glow 1.8s ease-in-out infinite;
            }
          `}
        </style>
        {/* Description & Button */}
        <div className="mt-6 sm:mt-10 md:mt-40 max-w-full sm:max-w-sm md:max-w-xs">
          <p className="text-sm sm:text-base md:text-[14px] text-white">
            Our AI-driven supply chain collaboration platform transforms the way
            industrial plants connect with OEMs, suppliers, and service
            providers during equipment and service breakdowns.
          </p>

          <button className="mt-4 sm:mt-6 bg-[#0088FF] w-[100px] sm:w-[107px] h-[32px] sm:h-[34px] hover:bg-blue-600 transition text-white rounded">
            Read More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
