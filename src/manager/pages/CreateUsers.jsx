import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../../service/http";
import Swal from "sweetalert2";
import Select from "react-select";
import { RotatingLines } from "react-loader-spinner";

const CreateUsers = () => {
  return (
    <div>
      <div>
        <UserRegistrationForm />
      </div>
    </div>
  );
};

export default CreateUsers;

const UserRegistrationForm = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    parent_id: user.id,
    company_name: user.company.company_name,
    role_id: 4,
    full_name: "",
    mobile_number: "",
    email: "",
    designation: "",
  });

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState(null);

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
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // clear error
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

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const res = await http.get("/designations");
        const formatted = res.data.data.map((item) => ({
          value: item.name,
          label: item.name,
        }));
        setDesignations(formatted);
      } catch (err) {
        console.error("Failed to load designations:", err);
      }
    };
    fetchDesignations();
  }, []);

  const handleDesignationChange = (option) => {
    setSelectedDesignation(option);
    setFormData({ ...formData, designation: option ? option.value : "" });
    setErrors((prev) => ({ ...prev, designation: "" }));
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
            "Your plant registration has been successfully submitted.",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/manager/dashboard/users-list");
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
      {/* <div className="absolute inset-0">
        <img
          src="/regbg.png"
          alt="background"
          className="w-full h-full object-cover"
        />
      </div> */}

      <div className="relative z-10 w-full flex flex-col items-center p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl md:text-[48px] font-bold text-[#212529]">
          User Registration Form
        </h2>
        {/* <p className="mt-2 text-sm sm:text-base md:text-[24px] font-normal text-[#212529]">
          Submit a link with the list of Questions
        </p> */}

        <form
          onSubmit={handleSubmit}
          className="mt-10 w-full max-w-4xl mx-auto p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            {/* <InputField
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              error={errors.company_name}
            /> */}

            {/* Plant Name */}
            {/* <InputField
              label="Plant Name"
              name="plant_name"
              value={formData.plant_name}
              onChange={handleChange}
              error={errors.plant_name}
            /> */}

            {/* Location Country */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Country
              </label>
              <Select
                options={countries}
                isLoading={loadingCountries}
                value={
                  formData.location_country
                    ? {
                        value: formData.location_country,
                        label: formData.location_country,
                      }
                    : null
                }
                onChange={handleCountryChange}
                placeholder="Select country"
                isClearable
                isSearchable
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "10px",
                    borderColor: errors.location_country ? "red" : "#D9D4C6",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: errors.location_country ? "red" : "#207EB1",
                    },
                  }),
                }}
                components={{
                  IndicatorSeparator: () => null,
                }}
              />
              {errors.location_country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.location_country}
                </p>
              )}
            </div> */}

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

            <div>
              <label className="text-[16px] font-semibold mb-1">
                Designation
              </label>
              <Select
                options={designations}
                placeholder="Select role"
                value={selectedDesignation}
                onChange={handleDesignationChange}
                className="mb-3"
                components={{ IndicatorSeparator: () => null }}
                isClearable
              />
              {errors.designation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.designation}
                </p>
              )}
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approval Level
              </label>
              <Select
                options={app_level}
                isLoading={app_level.length === 0}
                value={
                  formData.approval_level
                    ? {
                        value: formData.approval_level,
                        label: formData.approval_level,
                      }
                    : null
                }
                onChange={handleApprovalChange}
                placeholder="Select level of approval"
                isClearable
                isSearchable
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "10px",
                    borderColor: errors.approval_level ? "red" : "#D9D4C6",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: errors.approval_level ? "red" : "#207EB1",
                    },
                  }),
                }}
                components={{
                  IndicatorSeparator: () => null,
                }}
              />
              {errors.approval_level && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.approval_level}
                </p>
              )}
            </div> */}
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

// ✅ Reusable Input Component
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
