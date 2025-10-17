// Footer.jsx
import React, { useState } from "react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
import Swal from "sweetalert2";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please enter your email address.",
        confirmButtonColor: "#0088FF",
      });
      return;
    }

    setLoading(true);

    // Simulate a short delay
    setTimeout(() => {
      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "Subscribed!",
        text: `Thank you, ${email}! You have been added to our newsletter.`,
        confirmButtonColor: "#0088FF",
      });

      setEmail("");
    }, 1000);
  };
  return (
    <footer className="bg-[#1F2328] text-[#FFFFFF]">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & Description */}
        <div>
          <img
            src="/footerlogo.png"
            alt=""
            className="w-[174.64px] h-[102.85px]"
          />
          <p className="text-sm md:text-[16px] font-normal leading-relaxed">
            Our AI-driven supply chain collaboration platform transforms the way
            industrial plants connect with OEMs, suppliers, and service
            providers during equipment and service breakdowns.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[#FFFFFF] text-lg font-semibold md:text-[26px]  mb-4">
            Quick Links
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm md:text-[16px] font-normal">
            <li>
              <a href="/about-us" className="hover:text-[#FFFFFF]">
                ABOUT
              </a>
            </li>
            <li>
              <a href="/process" className="hover:text-[#FFFFFF]">
                PROCESS
              </a>
            </li>
            <li>
              <a href="/pricing" className="hover:text-[#FFFFFF]">
                PRICING
              </a>
            </li>
            <li>
              <a href="/contact-us" className="hover:text-[#FFFFFF]">
                CONTACT
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-[#FFFFFF]">
                TERMS
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-[#FFFFFF] md:text-[26px]  text-lg font-normal mb-4">
            Sign up to receive news and updates.
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 bg-[#FFFFFF] rounded-md w-full md:text-[16px] sm:w-auto flex-1 text-[#202020]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0088FF] hover:bg-[#1a5d82] w-[117.67px] h-[43px] rounded-[14px] text-[#FFFFFF] flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                {loading && (
                  <RotatingLines
                    strokeColor="#FFFFFF"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="20"
                    visible={true}
                  />
                )}
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>

          {/* Social Links */}
          <div className="flex space-x-5 mt-6 justify-end text-xl">
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-200 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-200 transition"
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-200 transition"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-4 px-6">
        <div className="max-w-7xl mx-auto flex px-6 flex-col md:flex-row justify-between items-center text-sm font-normal md:text-[14px] text-[#FFFFFF]">
          {/* Left Links */}
          <div className="flex space-x-4 mb-3 md:mb-0">
            <a href="#" className="hover:text-[#FFFFFF]">
              Terms and conditions
            </a>
            <span>|</span>
            <a href="#" className="hover:text-[#FFFFFF]">
              Privacy policy
            </a>
          </div>

          {/* Copyright */}
          <p>©2025 – All Rights Reserved by the Nexteck</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
