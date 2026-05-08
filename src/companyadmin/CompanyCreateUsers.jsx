import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import Select from "react-select";
import { RotatingLines } from "react-loader-spinner";
import http from "../service/http";

const CompanyCreateUsers = () => {
  return (
    <div>
      <div>
        <UserRegistrationForm />
      </div>
    </div>
  );
};

export default CompanyCreateUsers;

const UserRegistrationForm = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    parent_id: user.id,
    company_name: user.company.company_name,
    role_id: 1,
    full_name: "",
    mobile_number: "",
    email: "",
    designation: "",
    department: null,
    location_country: "",
    city: "",
  });

  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const depRes = await http.get("/departments");

      setDepartments(
        depRes.data?.data.map((item) => ({
          label: item.name,
          value: item.name, // 👈 ID goes in value
        })),
      );
    } catch (error) {
      console.error("Error fetching departments", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  //  Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await http.get("/countries");
        const options = res.data?.data.map((c) => ({
          value: c.name,
          label: c.name,
        }));
        setCountries(options);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const [app_level, setApp_level] = useState([]);

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const response = await http.get("/approval-levels");
        const options = response.data?.data.map((item) => ({
          label: item.level_name,
          value: item.level_name,
        }));
        setApp_level(options);
      } catch (error) {
        console.error("Error fetching priorities:", error);
      }
    };

    fetchPriorities();
  }, []);

  //  Input change
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  //   setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // clear error
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "designation" && {
        role_id: value === "supervisor" ? 6 : 1,
      }),
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  //  Country select change
  const handleCountryChange = (selectedOption) => {
    setFormData({
      ...formData,
      location_country: selectedOption ? selectedOption.value : "",
    });
    setErrors((prev) => ({ ...prev, location_country: "" }));
  };

  const handleApprovalChange = (selectedOption) => {
    setFormData({
      ...formData,
      approval_level: selectedOption ? selectedOption.value : "",
    });
    setErrors((prev) => ({ ...prev, approval_level: "" }));
  };
  //  Validation before submit
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });

    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email head_office_address";
    }

    // Phone number length
    if (formData.mobile_number && formData.mobile_number.length < 8) {
      newErrors.mobile_number = "Enter a valid phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("formdata:-", formData);
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await http.post("/users/register", formData);
      // console.log("Form submitted successfully:", res.data);

      if (res.data.status) {
        Swal.fire({
          icon: "success",
          title: "Form Submitted!",
          text:
            res.data.message ||
            "Your plant user has been successfully registered.",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/company-admin/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            res.data.error || res.data.message || "An unknown error occurred.",
          showConfirmButton: true,
        });
      }

      // redirect after success
    } catch (error) {
      const errorMsg =
        error.response?.data?.error?.includes("email") &&
        error.response?.data?.error?.includes("taken")
          ? "This email is already registered. Please use another one."
          : error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "An unknown error occurred.";

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: errorMsg,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full  flex items-center justify-center bg-gray-50 px-4">
      <div className="relative z-10 w-full flex flex-col items-center p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl md:text-[48px] font-bold text-[#212529]">
          User Registration Form
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-10 w-full max-w-4xl mx-auto p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Name */}
            <InputField
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              error={errors.full_name}
            />

            {/* Phone Number */}
            <InputField
              label="Phone Number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              error={errors.mobile_number}
            />

            {/* Email */}
            <InputField
              label="Email ID"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            {/* Designation */}
            {/* <InputField
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              error={errors.designation}
            /> */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Designation
              </label>

              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full border border-[#D9D4C6] rounded-lg px-3 py-2"
              >
                <option value="">Select designation</option>
                <option value="supervisor">Supervisor</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Department
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full border border-[#D9D4C6] rounded-lg px-3 py-2"
              >
                <option value="">Select department</option>

                {departments.map((dep) => (
                  <option key={dep.value} value={dep.value}>
                    {dep.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Country</label>

              <select
                name="location_country"
                value={formData.location_country}
                onChange={handleChange}
                required
                className="w-full border border-[#D9D4C6] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {loadingCountries ? "Loading countries..." : "Select Country"}
                </option>

                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
            <InputField
              label="City"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />
          </div>

          <div className="flex justify-start mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 bg-[#0088FF] text-white font-semibold rounded-[10px] px-6 py-2 transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading && (
                <RotatingLines
                  strokeColor="#FFFFFF"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="20"
                  height={20}
                  visible={true}
                />
              )}
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={`Enter ${label.toLowerCase()}`}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-[10px] bg-white px-3 py-2 focus:ring-2 focus:outline-none ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-[#D9D4C6] focus:ring-[#207EB1]"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
