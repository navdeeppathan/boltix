import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import http from "../service/http";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";
import HeaderAdminLogin from "../utils/HeaderAdminLogin";
import Footer from "../utils/Footer";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const cardVariant = {
  hidden: { opacity: 0, x: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter your registered email address.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await http.post("/users/forgot-password", { email });
      const data = response.data;

      Swal.fire({
        icon: "success",
        title: "Success",
        text: data?.message || "Password reset email sent successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      setEmail("");
      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "There was an error submitting your email. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderAdminLogin />
      <section className="relative bg-gray-100 mt-24 overflow-hidden">
        {/* Background */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src="/loginbg.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto px-4 sm:px-6 lg:px-32 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-10"
        >
          {/* Left Content */}
          <motion.div variants={fadeUp} className="lg:w-1/2">
            <h2 className="text-2xl sm:text-3xl md:text-[48.65px] font-bold text-[#212529]">
              Forgot Your Password?
            </h2>
            <p className="mt-2 md:text-[24px] text-[#212529]">
              No worries — we’ve got you covered!
            </p>
            <p className="mt-4 md:text-[24px] text-[#5D5D5D]">
              Enter your registered email address and we’ll send password reset
              instructions directly to your inbox.
            </p>
          </motion.div>

          {/* Forgot Password Card */}
          <motion.div
            variants={cardVariant}
            className="lg:w-1/2 max-w-md w-full bg-[#212529] text-white rounded-[14px] shadow-lg p-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-[48.65px] font-bold">
                Forgot Password
              </h2>
              <p className="md:text-[20px]">
                Enter your registered email to reset your password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <motion.div variants={fadeUp}>
                <label className="block mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-2 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                type="submit"
                className="w-full md:w-[154px] md:h-[48px] bg-[#0088FF] rounded-md font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" />
                    Sending...
                  </>
                ) : (
                  "Submit"
                )}
              </motion.button>

              {/* Back to Login */}
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
};

export default ForgotPassword;
