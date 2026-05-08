// Footer.jsx
import React, { useState } from "react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

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
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
      className="bg-[#1F2328] text-white"
    >
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & Description */}
        <motion.div variants={item}>
          <motion.img
            src="/footerlogo.png"
            alt=""
            className="w-[174.64px] h-[102.85px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <p className="text-sm md:text-[16px] mt-4 leading-relaxed">
            Our AI-driven supply chain collaboration platform transforms the way
            industrial plants connect with manufacturers, suppliers, and service
            providers during equipment failures and service breakdowns.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={item}>
          <h3 className="md:text-[26px] text-lg font-semibold mb-4">
            Quick Links
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm md:text-[16px]">
            {["ABOUT", "PROCESS", "CONTACT", "TERMS"].map((link, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <a href={`/${link.toLowerCase()}`} className="hover:underline">
                  {link}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div variants={item}>
          <h3 className="md:text-[26px] text-lg mb-4">
            Sign up to receive news and updates.
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 bg-white rounded-md text-[#202020]"
            />

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                type="submit"
                className="bg-[#0088FF] w-[117.67px] h-[43px] rounded-[14px] text-white flex items-center justify-center gap-2 disabled:opacity-60"
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
              </motion.button>
            </div>
          </form>

          {/* Social Icons */}
          <div className="flex space-x-5 mt-6 justify-end text-xl">
            {[FaFacebookF, FaYoutube, FaInstagram].map((Icon, i) => (
              <motion.a
                key={i}
                whileHover={{ scale: 1.2, y: -4 }}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center"
                href="#"
              >
                <Icon />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-black py-4 px-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm md:text-[14px]">
          <div className="flex space-x-4 mb-3 md:mb-0">
            <a href="#" className="hover:underline">
              Terms and conditions
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              Privacy policy
            </a>
          </div>
          <p>©2025 – All Rights Reserved by the Nexteck</p>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
