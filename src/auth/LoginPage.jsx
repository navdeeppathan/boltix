// LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import http from "../service/http";
import CircularProgress from "@mui/material/CircularProgress";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      const response = await http.post("/users/login", formData);

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

        if (roleId === 2) {
          navigate("/manager/dashboard");
          localStorage.setItem("asManager", 1);
        } else {
          navigate("/dashboard");
          localStorage.setItem("asCompany", 1);
        }
      } else {
        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-gray-100">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/loginbg.png"
          alt="Background"
          className="w-full h-full object-cover "
        />
      </div>

      {/* Content */}
      <div className="relative z-10  mx-auto px-4 sm:px-6 lg:px-32 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Side */}
        <div className="lg:w-1/2 text-white">
          <h2 className="text-2xl sm:text-3xl md:text-[48.65px] font-bold text-[#212529]">
            Welcome to the Boltix
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-[24px] font-normal text-[#212529]">
            {/* Your account has been successfully <br /> verified! */}
            The first AI-driven collaboration hub for industrial plants and OEM
            ecosystems.
          </p>
          <p className="mt-4 text-sm sm:text-base md:text-[24px] font-normal text-[#5D5D5D]">
            Please log in using the username and password sent to your
            registered email. Once logged in, you can access your personalized
            dashboard, whether you’re a Plant Operator or an OEM Supplier, to
            manage profiles, collaborate, and connect seamlessly within our
            network.
          </p>
        </div>

        {/* Right Side Login Card */}
        {/* <div className="lg:w-1/2 max-w-md w-full space-y-8 bg-[#212529] text-white rounded-[14px] shadow-lg p-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl text-center sm:text-3xl md:text-[48.65px] font-bold text-[#FFFFFF]">
              Login
            </h2>
            <p className="mt-2 text-sm  text-center sm:text-base md:text-[20px] font-normal text-[#FFFFFF]">
              After First Login Change the password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
           
            <div>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="User Name"
                className="w-full px-4 py-2 rounded-md bg-[#FFFFFF] md:text-[18px] font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 rounded-md bg-[#FFFFFF] md:text-[18px] font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-between items-center">
                <Link
                  to="/register"
                  href="#"
                  className="text-sm md:text-[14px] text-[#207EB1] font-normal  hover:underline mt-4 block text-right"
                >
                  Sigup now
                </Link>
                <a
                  href="#"
                  className="text-sm md:text-[14px]  font-normal text-[#FAF9F6] hover:underline mt-4 block text-right"
                >
                  Forgot password?
                </a>
              </div>
            </div>

           
            <div className="flex justify-end mt-24">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-[154px] md:h-[48px] md:text-[16px] font-semibold bg-[#207EB1] hover:bg-blue-700 text-[#FFFFFF] py-2 rounded-md transition"
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div> */}
        <div className="lg:w-1/2 max-w-md w-full space-y-8 bg-[#212529] text-white rounded-[14px] shadow-lg p-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl text-center sm:text-3xl md:text-[48.65px] font-bold text-[#FFFFFF]">
              Login
            </h2>
            <p className="mt-2 text-sm text-center sm:text-base md:text-[20px] font-normal text-[#FFFFFF]">
              After first login change the password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm mb-2 text-[#FFFFFF]">
                User Name
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your User Name"
                className="w-full px-4 py-2 rounded-md placeholder:text-[#8C8C8C] bg-[#FFFFFF] md:text-[18px] font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password with Eye Icon */}
            <div>
              <label className="block text-sm mb-2 text-[#FFFFFF]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-md placeholder:text-[#8C8C8C] bg-[#FFFFFF] md:text-[18px] font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-[#207EB1]"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                )}
              </div>

              <div className="flex justify-end mt-3">
                <a
                  // href="/login/forgot-password"
                  onClick={() => navigate("/login/forgot-password")}
                  className="text-sm md:text-[14px] font-normal text-[#FAF9F6] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end mt-10">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-[154px] md:h-[48px] md:text-[16px] font-semibold bg-[#0088FF] hover:bg-blue-700 text-[#FFFFFF] py-2 rounded-md transition flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    {/* <CircularProgress size={20} color="inherit" /> */}
                    <RotatingLines
                      strokeColor="#FFFFFF"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="20"
                      visible={true}
                    />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
