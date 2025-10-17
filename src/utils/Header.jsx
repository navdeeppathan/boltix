// Header.jsx
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [loading2, setLoading2] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleLoad = () => setLoading2(false);

    // If everything is already loaded (like cached images)
    if (document.readyState === "complete") {
      setLoading2(false);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);
  // Optionally, show loading on route change
  useEffect(() => {
    setLoading2(true);

    const handleLoad = () => setLoading2(false);

    if (document.readyState === "complete") {
      setLoading2(false);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, [location]);

  if (loading2) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          zIndex: 9999,
        }}
      >
        <span class="loader2"></span>
        <style>
          {`
              .loader2 {
        width: 36px;
        height: 36px;
        border: 3px solid #C4C4C4;
        border-bottom-color: #464646;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        }
    
        @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
        } `}
        </style>
      </div>
    );
  }

  return (
    <header className="w-full fixed top-0 left-0 bg-[#FFFFFF] shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 lg:py-4">
        <div className="flex justify-between items-center h-16 ">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="/colorlogo.png" // replace with your exact logo path
              alt="BoltX Logo"
              className=" h-[75px] w-auto"
            />
          </a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium md:text-[16px] md:font-semibold text-[#212529]">
            <a
              href="/about-us"
              className="hover:text-[#0088FF]  transition-colors"
            >
              About
            </a>
            <a
              href="/process"
              className="hover:text-[#0088FF] transition-colors"
            >
              Process
            </a>
            <a
              href="/pricing"
              className="hover:text-[#0088FF] transition-colors"
            >
              Pricing
            </a>
            <a
              className="hover:text-[#0088FF] transition-colors cursor-pointer flex items-center gap-2"
              // onClick={() => navigate("/login")}
              href="/login"
            >
              <img
                src="/blacklogin.png"
                alt=""
                className="w-[9px] h-[11px] object-cover"
              />
              Login
            </a>
            <button
              onClick={() => navigate("/register")}
              className="bg-[#0088FF] text-[#FFFFFF] md:text-[16px] font-semibold w-[145px] h-[40px] px-5 py-2 rounded hover:bg-blue-600 transition"
            >
              Let's Start
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-2xl text-gray-700"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-[#212529] text-xl"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col gap-6 p-6 text-[#212529] text-base font-semibold">
          <a
            href="/about-us"
            onClick={() => setSidebarOpen(false)}
            className="hover:text-[#0088FF]"
          >
            About
          </a>
          <a
            href="/process"
            onClick={() => setSidebarOpen(false)}
            className="hover:text-[#0088FF]"
          >
            Process
          </a>
          <a
            href="/pricing"
            onClick={() => setSidebarOpen(false)}
            className="hover:text-[#0088FF]"
          >
            Pricing
          </a>
          <a
            className="hover:text-[#0088FF] transition-colors cursor-pointer flex items-center gap-2"
            // onClick={() => navigate("/login")}
            href="/login"
          >
            <img
              src="/blacklogin.png"
              alt=""
              className="w-[9px] h-[11px] object-cover"
            />
            Login
          </a>
          <button
            className="bg-[#0088FF] text-[#FFFFFF]  py-2 rounded hover:bg-blue-600 transition"
            onClick={() => {
              navigate("/register");
              setSidebarOpen(false);
            }}
          >
            Let's Start
          </button>
        </nav>
      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
