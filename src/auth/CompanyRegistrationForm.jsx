// CompanyRegistrationForm.jsx
import React, { useState } from "react";
import http from "../service/http";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const CompanyRegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    mobileNumber: "",
    email: "",
    designation: "",
    offices: "",
    approver: "",
    machinery: "",
    clients: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    if (!formData.companyName || !formData.mobileNumber || !formData.email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await http.post("/users/register", formData);
      const data = await response.data;
      if (response.status) {
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: data.message || "You have Registered successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/login");
      } else {
        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Register error:", error);
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
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Background Image (with overlay fade) */}
      <div className="absolute inset-0">
        <img
          src="/regbg.png"
          alt="background"
          className="w-full h-full object-cover "
        />
      </div>

      {/* Form Section */}
      <div className="relative z-10  w-full flex flex-col items-center   p-6 sm:p-10 ">
        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-2xl sm:text-3xl md:text-[48.65px] font-bold text-[#212529]">
            Company registration form
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-[24px] font-normal text-[#212529]">
            Submit a link with the list of Question
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-14 max-w-lg">
          {/* Input Fields */}
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full border text-[#212529] font-normal border-[#D9D4C6] rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-[#207EB1] focus:outline-none"
            required
          />
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full border border-[#D9D4C6] text-[#212529] font-normal rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-[#207EB1] focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email ID"
            className="w-full border border-[#D9D4C6] text-[#212529] font-normal rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-[#207EB1] focus:outline-none"
            required
          />
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Designation"
            className="w-full border border-[#D9D4C6] text-[#212529] font-normal rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-[#207EB1] focus:outline-none"
          />
          <input
            type="number"
            name="offices"
            value={formData.offices}
            onChange={handleChange}
            placeholder="No of offices"
            className="w-full border border-[#D9D4C6] text-[#212529] font-normal rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-[#207EB1] focus:outline-none"
          />
          <input
            type="text"
            name="approver"
            value={formData.approver}
            onChange={handleChange}
            placeholder="Reporting Approver in each Offices"
            className="w-full border border-[#D9D4C6] text-[#212529] font-normal rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-[#207EB1] focus:outline-none"
          />
          <input
            type="text"
            name="machinery"
            value={formData.machinery}
            onChange={handleChange}
            placeholder="No of Machinery they sale / Service"
            className="w-full border border-[#D9D4C6] text-[#212529] font-normal rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-[#207EB1] focus:outline-none"
          />
          <input
            type="number"
            name="clients"
            value={formData.clients}
            onChange={handleChange}
            placeholder="No of Clients they provide the Services"
            className="w-full border border-[#D9D4C6] text-[#212529] font-normal rounded-[10px] px-3 py-2 focus:ring-2 focus:ring-[#207EB1] focus:outline-none"
          />

          {/* Submit Button */}
          <div className="flex flex-col items-center justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-[324px] md:h-[48px] bg-[#207EB1] text-white font-semibold rounded-[10px] px-4 py-2 hover:bg-blue-700 transition"
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
            {/* <div className="">
              <Link
                to="/login"
                className="ml-4 text-[#207EB1] font-semibold hover:underline"
              >
                Login
              </Link>
            </div> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyRegistrationForm;
