import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const headerVariant = {
  hidden: { y: -80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const sidebarVariant = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const menuItem = {
  hidden: { opacity: 0, x: 20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08 },
  }),
};

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleLoad = () => setLoading2(false);

    if (document.readyState === "complete") {
      setLoading2(false);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    setLoading2(true);
    const handleLoad = () => setLoading2(false);

    if (document.readyState === "complete") {
      setLoading2(false);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, [location]);

  if (loading2) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <span className="loader2"></span>
        <style>{`
          .loader2 {
            width: 36px;
            height: 36px;
            border: 3px solid #C4C4C4;
            border-bottom-color: #464646;
            border-radius: 50%;
            animation: rotation 1s linear infinite;
          }
          @keyframes rotation {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <motion.header
        variants={headerVariant}
        initial="hidden"
        animate="visible"
        className="w-full fixed top-0 left-0 bg-white shadow-sm z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 lg:py-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <img src="/colorlogo.png" alt="BoltX Logo" className="h-[75px]" />
            </a>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8 text-[#212529] md:text-[16px] font-semibold">
              {["About", "Process", "Pricing"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="relative group"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#0088FF] transition-all group-hover:w-full"></span>
                </a>
              ))}

              <a href="/login" className="flex items-center gap-2">
                <img
                  src="/blacklogin.png"
                  alt=""
                  className="w-[9px] h-[11px]"
                />
                Login
              </a>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/boltix-registeration")}
                className="bg-[#0088FF] text-white w-[145px] h-[40px] rounded"
              >
                Let’s Start
              </motion.button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-2xl"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              variants={sidebarVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <img src="/logo.png" alt="Logo" className="h-8" />
                <button onClick={() => setSidebarOpen(false)}>
                  <FaTimes />
                </button>
              </div>

              <nav className="flex flex-col gap-6 p-6 font-semibold">
                {["About", "Process", "Pricing", "Login"].map((item, i) => (
                  <motion.a
                    key={item}
                    custom={i}
                    variants={menuItem}
                    initial="hidden"
                    animate="visible"
                    href={`/${item.toLowerCase()}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item}
                  </motion.a>
                ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    navigate("/boltix-registeration");
                    setSidebarOpen(false);
                  }}
                  className="bg-[#0088FF] text-white py-2 rounded"
                >
                  Let’s Start
                </motion.button>
              </nav>
            </motion.div>

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
