import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import http from "../service/http";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
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

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter your email address.",
      });
      return;
    }

    if (!formData.password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter your password.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await http.post("/admin/login", formData);

      const data = await response.data;

      if (response.status) {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("userData", JSON.stringify(data?.data));

        const roleId = data?.data?.role_id;
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: data.message || "You have logged in successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        if (roleId == 11) {
          navigate("/admin/dashboard");
          localStorage.setItem("asAdmin", 1);
        }
      } else {
        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || data.error || "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderAdminLogin />
      <section className="relative mt-24 bg-gray-100 overflow-hidden">
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
              Welcome to Boltix Admin
            </h2>

            <p className="mt-2 md:text-[24px] text-[#212529]">
              Centralized control for managing the Boltix AI collaboration
              ecosystem.
            </p>

            <p className="mt-4 md:text-[18px] text-[#5D5D5D]">
              Log in to monitor operations, manage users, oversee Manufacturer
              integrations, and ensure seamless collaboration across industrial
              plants.
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            variants={cardVariant}
            className="lg:w-1/2 max-w-md w-full bg-[#212529] text-white rounded-[14px] shadow-lg p-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-[48px] font-bold">
                Admin Access
              </h2>
              <p className="md:text-[16px]">
                Authorized administrators only. Please sign in to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <motion.div variants={fadeUp}>
                <label className="block mb-2">User Name</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your User Name"
                  className="w-full px-4 py-2 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={fadeUp}>
                <label className="block mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md bg-white text-gray-900 pr-10 focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.password && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#207EB1]"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  )}
                </div>

                {/* <div className="text-right mt-2">
                  <Link
                    to="/login/forgot-password"
                    className="text-sm hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div> */}
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
                    <RotatingLines width="20" strokeColor="#fff" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
};

export default AdminLoginPage;
