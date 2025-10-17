import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa"; // Menu icon
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
        {/* Navbar */}
        {/* <nav className="w-full flex justify-between items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[100px] sm:w-[120px] md:w-[127px] h-auto"
          />
          <ul className="hidden md:flex gap-6 lg:gap-8 text-white items-center font-medium text-sm sm:text-base">
            <li
              className="hover:text-[#0088FF] cursor-pointer"
              onClick={() => navigate("/about-us")}
            >
              About
            </li>
            <li
              className="hover:text-[#0088FF] cursor-pointer"
              onClick={() => navigate("/process")}
            >
              Process
            </li>
            <li
              className="hover:text-[#0088FF] cursor-pointer"
              onClick={() => navigate("/pricing")}
            >
              Pricing
            </li>
            <li
              className="hover:text-[#0088FF] cursor-pointer flex items-center gap-2"
              onClick={() => navigate("/login")}
            >
              <img
                src="/login.png"
                alt=""
                className="w-[9px] h-[11px] object-cover"
              />
              Login
            </li>
            <li>
              <button
                onClick={() => navigate("/register")}
                className="bg-[#0088FF] text-white w-[100px] sm:w-[120px] md:w-[145px] h-[35px] sm:h-[38px] md:h-[40px] rounded hover:bg-blue-600 transition"
              >
                Let's Start
              </button>
            </li>
          </ul>

          <div className="md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white text-2xl"
            >
              <FaBars />
            </button>
          </div>
        </nav> */}
        {/* Sidebar (Mobile) */}
        {/* <div
          className={`fixed top-0 right-0 h-full w-64 bg-[#0A0A0A] text-white transform ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white text-xl"
            >
              <FaTimes />
            </button>
          </div>
          <ul className="flex flex-col gap-6 p-6 text-base font-medium">
            <li
              className="hover:text-[#0088FF] cursor-pointer"
              onClick={() => {
                navigate("/about-us");
                setSidebarOpen(false);
              }}
            >
              About
            </li>
            <li
              className="hover:text-[#0088FF] cursor-pointer"
              onClick={() => {
                navigate("/process");
                setSidebarOpen(false);
              }}
            >
              Process
            </li>
            <li
              className="hover:text-[#0088FF] cursor-pointer"
              onClick={() => {
                navigate("/pricing");
                setSidebarOpen(false);
              }}
            >
              Pricing
            </li>
            <li
              className="hover:text-[#0088FF] cursor-pointer flex items-center gap-2"
              onClick={() => setSidebarOpen(false)}
            >
              <img
                src="/login.png"
                alt=""
                className="w-[9px] h-[11px] object-cover"
              />
              Login
            </li>
            <li>
              <button
                className="bg-[#207EB1] text-white w-full h-[40px] rounded hover:bg-blue-600 transition"
                onClick={() => {
                  navigate("/register");
                  setSidebarOpen(false);
                }}
              >
                Let's Start
              </button>
            </li>
          </ul>
        </div> */}
        {/* Sidebar Overlay (when open) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        {/* Hero Text */}
        <div className="mt-12 sm:mt-16 md:mt-20 max-w-full sm:max-w-xl md:max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[50px] font-semibold leading-snug sm:leading-snug md:leading-tight lg:leading-tight">
            The first <span className="font-extrabold">AI-driven</span>
            <br />
            <span className="font-extrabold"> collaboration</span> hub for
            industrial <br /> plants and OEM ecosystems.
          </h1>
        </div>
        {/* The first AI-driven collaboration hub for industrial plants and OEM
        ecosystems. */}
        {/* Pointer Icon */}
        {/* <div className="hidden md:flex flex-col items-center absolute right-4 sm:right-8 lg:right-120 bottom-4 sm:bottom-8 lg:bottom-50">
          <img
            src="/bgimg3.png"
            alt="Pointer"
            className="w-10 sm:w-12 lg:w-[45px] h-auto"
          />
        </div> */}
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
