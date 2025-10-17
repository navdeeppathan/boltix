// LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import http from "../service/http";
import CircularProgress from "@mui/material/CircularProgress";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    try {
      if (!email) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter your registered email address.",
        });
        return;
      }

      setLoading(true);
      const response = await http.post("/users/forgot-password", { email });
      const data = response.data;
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data?.message || "Password reset email sent successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        setEmail("");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error submitting email:", error);
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
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-[24px] font-normal text-[#212529]">
            No worries — we’ve got you covered!
          </p>
          <p className="mt-4 text-sm sm:text-base md:text-[24px] font-normal text-[#5D5D5D]">
            Enter your registered email address below, and we’ll send your login
            password directly to your inbox. Please make sure to check your spam
            or junk folder if you don’t see the email within a few minutes.
          </p>
        </div>

        <div className="lg:w-1/2 max-w-md w-full space-y-8 bg-[#212529] text-white rounded-[14px] shadow-lg p-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl text-center sm:text-3xl md:text-[48.65px] font-bold text-[#FFFFFF]">
              Forgot Password
            </h2>
            <p className="mt-2 text-sm text-center sm:text-base md:text-[20px] font-normal text-[#FFFFFF]">
              Enter your registered email to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-[#FFFFFF]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full px-4 py-2 rounded-md placeholder:text-[#8C8C8C] bg-[#FFFFFF] md:text-[18px] font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end mt-10">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-[154px] md:h-[48px] md:text-[16px] font-semibold bg-[#0088FF] hover:bg-blue-700 text-[#FFFFFF] py-2 rounded-md transition flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" />
                    Sending...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm md:text-[14px] font-normal text-[#FAF9F6] hover:underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
