import React from "react";
import { motion } from "framer-motion";
import Header from "../utils/Header";
import Footer from "../utils/Footer";
import { useNavigate } from "react-router-dom";

const pageVariant = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const BoltixRegister = () => {
  const navigate = useNavigate();

  const handleClick = (role) => {
    console.log("Register as:", role);

    if (role === "Plant Operator") {
      navigate("/plant-operator-registration");
    } else if (role === "OEM / Service Provider") {
      navigate("/oem-service-provider-registration");
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          variants={pageVariant}
          initial="hidden"
          animate="visible"
          className="bg-white w-full max-w-5xl p-12 rounded-lg shadow-sm"
        >
          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            Boltix – Streamline plant and OEM collaboration in real time
          </motion.h1>

          <motion.p variants={fadeUp} className="text-gray-600 mb-12 max-w-3xl">
            Boltix connects plant operators and OEM/service providers on a
            single platform, enabling real-time visibility, faster coordination,
            and efficient industrial operations.
          </motion.p>

          {/* Register Section */}
          <motion.div
            custom={0}
            variants={sectionVariant}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-6">
              Register as a
            </h2>

            <div className="flex flex-wrap gap-6">
              {["Plant Operator", "OEM / Service Provider"].map(
                (role, index) => (
                  <motion.button
                    key={role}
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClick(role)}
                    className="role-btn"
                  >
                    {role}
                  </motion.button>
                ),
              )}
            </div>
          </motion.div>

          {/* Inline Styles */}
          <style>
            {`
              .role-btn {
                padding: 14px 32px;
                border: 2px solid #0a6ed1;
                background: transparent;
                color: #0a6ed1;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s ease, color 0.2s ease;
              }

              .role-btn:hover {
                background: #0a6ed1;
                color: #ffffff;
              }
            `}
          </style>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default BoltixRegister;
