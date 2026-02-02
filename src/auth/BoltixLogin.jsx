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

const BoltixLogin = () => {
  const navigate = useNavigate();
  const handleClick = (category, role) => {
    console.log(`${category} - ${role}`);
    if (category == "Plant" && role == "Admin") {
      navigate("/plant-company-admin-login");
    } else if (category == "Plant" && role == "Supervisor") {
      navigate("/plant-supervisor-login");
    } else if (category == "Plant" && role == "User") {
      navigate("/plant-user-login");
    } else if (category == "OEM" && role == "Admin") {
      navigate("/oem-company-admin-login");
    } else if (category == "OEM" && role == "User") {
      navigate("/oem-user-login");
    } else if (category == "OEM" && role == "Supervisor") {
      navigate("/oem-supervisor-login");
    }
    // navigate(`/login?type=${category}&role=${role}`)
  };

  return (
    <>
      <Header />
      <div className="min-h-screen mt-24 bg-gray-100 flex items-center justify-center">
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
            Boltix connects plant teams and OEM partners on a single platform,
            enabling real-time visibility, faster coordination, and efficient
            industrial operations.
          </motion.p>

          {/* Role Sections */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Plant */}
            <motion.div
              custom={0}
              variants={sectionVariant}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Plant
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
                {["Admin", "Supervisor", "User"].map((role, index) => (
                  <motion.button
                    key={role}
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClick("Plant", role)}
                    className="role-btn"
                  >
                    {role}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* OEM */}
            <motion.div
              custom={1}
              variants={sectionVariant}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-lg font-semibold text-gray-700 mb-4">OEM</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Admin", "Supervisor", "User"].map((role) => (
                  <motion.button
                    key={role}
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClick("OEM", role)}
                    className="role-btn"
                  >
                    {role}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Styles */}
          <style>
            {`
            .role-btn {
              padding: 12px 28px;
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

export default BoltixLogin;
