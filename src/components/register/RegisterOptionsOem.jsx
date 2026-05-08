import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import http from "../../service/http";
import CircularProgress from "@mui/material/CircularProgress";
import { RotatingLines } from "react-loader-spinner";

const RegisterOptionsOem = () => {
  const [selectedForm, setSelectedForm] = useState("plant"); // "plant" or "supplier"
  const [loading, setLoading] = useState(false);

  const handleSelectForm = (form) => {
    if (form !== selectedForm) {
      setLoading(true); // show loader
      setTimeout(() => {
        setSelectedForm(form);
        setLoading(false); // hide loader after 2 sec
      }, 1000);
    }
  };
  return (
    <div>
      {/* Registration Options */}
      {/* <section className="w-full flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-10 px-4 sm:px-8 md:px-16 lg:px-32 py-12">
      
        <div
          // onClick={() => setSelectedForm("plant")}
          onClick={() => handleSelectForm("plant")}
          className={`cursor-pointer flex flex-col justify-between rounded-[14px] shadow-md w-full md:w-1/3 p-6 sm:p-8 transition-all duration-300 ${
            selectedForm === "plant"
              ? "bg-[#1E1E1E] text-[#FFFFFF]"
              : "bg-white text-black border-2 border-[#D9D4C6]"
          }`}
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src={selectedForm === "plant" ? "/reg1.png" : "/regblack1.png"}
                alt=""
                className="w-[64px] h-[64px]"
              />
              <h2 className="text-lg sm:text-xl md:text-[24px] font-bold">
                Register as a Plant Operator
              </h2>
            </div>
            <ol className="space-y-4 text-sm sm:text-base leading-relaxed">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#F5F1E7] text-[#212529] text-xs font-bold">
                  1
                </span>
                Submit the form below
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#F5F1E7] text-[#212529] text-xs font-bold">
                  2
                </span>
                On Summation, BoltiX expert will evaluate the answer and will
                provide implementation approach and proposal
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#F5F1E7] text-[#212529] text-xs font-bold">
                  3
                </span>
                BoltiX will create your Account based on the confirmation and
                will send you the username and password
              </li>
            </ol>
          </div>
        </div>

        
        <div
          // onClick={() => setSelectedForm("supplier")}
          onClick={() => handleSelectForm("supplier")}
          className={`cursor-pointer flex flex-col justify-between rounded-[14px] shadow-md w-full md:w-1/3 p-6 sm:p-8 transition-all duration-300 ${
            selectedForm === "supplier"
              ? "bg-[#1E1E1E] text-[#FFFFFF]"
              : "bg-white text-black border-2 border-[#D9D4C6]"
          }`}
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src={
                  selectedForm === "supplier" ? "/regwhite2.png" : "/reg2.png"
                }
                alt="/reg2.png"
                className="w-[64px] h-[64px]"
              />
              <h2 className="text-lg sm:text-xl md:text-[24px] font-bold">
                Register as a OEM/Service Provider
              </h2>
            </div>
            <ol className="space-y-4 text-sm sm:text-base leading-relaxed">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#F5F1E7] text-[#212529] text-xs font-bold">
                  1
                </span>
                Submit the form below
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#F5F1E7] text-[#212529] text-xs font-bold">
                  2
                </span>
                On Summation, BoltiX expert will evaluate the answer and will
                provide implementation approach and proposal
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#F5F1E7] text-[#212529] text-xs font-bold">
                  3
                </span>
                BoltiX will create your Account based on the confirmation and
                will send you the username and password
              </li>
            </ol>
          </div>
        </div>
      </section> */}

      {/* {loading ? (
        <div className="flex justify-center items-center py-12">
          <RotatingLines
            strokeColor="#1E1E1E"
            strokeWidth="5"
            animationDuration="0.75"
            width="64"
            visible={true}
          />
        </div>
      ) : selectedForm === "plant" ? ( */}
      {/* <PlantRegistrationForm />
      ) : ( */}
      <SupplierRegistrationForm />
      {/* )} */}
    </div>
  );
};

export default RegisterOptionsOem;

// adjust your import path

const PlantRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: "",
    role_id: 12,
    plant_name: "",
    location_country: "",
    contact_name: "",
    mobile_number: "",
    email: "",
    designation: "",
    approval_level: "",
    parent_id: null,
    plant_location: "",
  });

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
          label: item.name,
          value: item.id, //  use name as the value
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

  const handlePlantCountryChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      plant_location: selectedOption ? selectedOption.value : "",
    }));
    setErrors((prev) => ({ ...prev, plant_location: "" }));
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
      if (key === "parent_id") return;
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
        navigate("/login");
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
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="absolute inset-0">
        <img
          src="/regbg.png"
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl md:text-[48px] font-bold text-[#212529]">
          Industrial Plant Registration Form
        </h2>
        <p className="mt-2 text-sm sm:text-base md:text-[24px] font-normal text-[#212529]">
          Submit a link with the list of Questions
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 w-full max-w-4xl mx-auto p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <InputField
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              error={errors.company_name}
            />

            {/* Plant Name */}
            <InputField
              label="Plant Name"
              name="plant_name"
              value={formData.plant_name}
              onChange={handleChange}
              error={errors.plant_name}
            />

            {/* Location Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company location country
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plant location country(if diff from company)
              </label>
              <Select
                options={countries}
                isLoading={loadingCountries}
                value={
                  formData.plant_location
                    ? {
                        value: formData.plant_location,
                        label: formData.plant_location,
                      }
                    : null
                }
                onChange={handlePlantCountryChange}
                placeholder="Select country"
                isClearable
                isSearchable
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "10px",
                    borderColor: errors.plant_location ? "red" : "#D9D4C6",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: errors.plant_location ? "red" : "#207EB1",
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
            </div>

            {/* Contact Name */}
            <InputField
              label="Contact Name"
              name="contact_name"
              value={formData.contact_name}
              onChange={handleChange}
              error={errors.contact_name}
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
            <InputField
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              error={errors.designation}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approval Level
              </label>
              <Select
                options={app_level}
                isLoading={app_level.length === 0}
                value={
                  app_level.find(
                    (opt) => opt.value === formData.approval_level,
                  ) || null
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
            </div>
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

const SupplierRegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: "",
    role_id: 12,
    business_type: "",
    head_office_address: "",
    location_country: "",
    full_name: "",
    designation: "Admin",
    email: "",
    mobile_number: "",
    product_category: "",
    website_link: "",
    parent_id: null,
    regional_off_add: "",
    office_number: "",
  });

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch countries
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

  const businessTypeOptions = [
    { value: "Manufacturer", label: "Manufacturer" },
    { value: "Service Provider", label: "Service Provider" },
  ];
  //  Input change handler
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //  Country select handler
  const handleCountryChange = (selectedOption) => {
    setFormData({
      ...formData,
      location_country: selectedOption ? selectedOption.value : "",
    });
    setErrors((prev) => ({ ...prev, location_country: "" }));
  };

  const handleBusinessTypeChange = (selectedOption) => {
    setFormData({
      ...formData,
      business_type: selectedOption ? selectedOption.value : "",
    });
    setErrors((prev) => ({ ...prev, business_type: "" }));
  };

  //  Validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.company_name)
      newErrors.company_name = "Company name is required";
    if (!formData.business_type)
      newErrors.business_type = "Business type is required";
    if (!formData.head_office_address)
      newErrors.head_office_address = "head_office_address is required";
    if (!formData.location_country)
      newErrors.location_country = "Country is required";
    if (!formData.full_name) newErrors.full_name = "Full name is required";
    if (!formData.designation)
      newErrors.designation = "Designation is required";
    if (!formData.product_category)
      newErrors.product_category = "Product category is required";
    if (!formData.website_link)
      newErrors.website_link = "Website link is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.mobile_number)
      newErrors.mobile_number = "Phone number is required";
    else if (!/^\d{8,15}$/.test(formData.mobile_number))
      newErrors.mobile_number = "Enter a valid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await http.post("/users/register", formData);

      if (res.data.status) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text:
            res.data.message ||
            "A link has been sent to your email to access your dashboard.",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const errorMsg =
          res.data.error?.includes("email") && res.data.error?.includes("taken")
            ? "This email is already registered. Please use another one."
            : res.data.error ||
              res.data.message ||
              "An unknown error occurred.";
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: errorMsg,
          showConfirmButton: true,
        });
      }

      // console.log("formdata", formData);
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
    <div className="relative w-full min-h-screen mt-24 flex items-center justify-center bg-gray-50 px-4">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/regbg.png"
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-[#0088ffcf] text-center">
          Manufacturer/Service Provider Registration Form
        </h2>
        <p className="mt-2 text-sm sm:text-sm md:text-lg font-normal text-[#0088ffcf] text-center">
          Once registered, a link will be sent to login and access your profile
          dashboard.
        </p>

        <form
          onSubmit={handleSubmit}
          className=" max-w-3xl w-full  backdrop-blur-sm  p-6 "
        >
          {/* Company Information Section */}
          {/* <h2 className="text-lg font-semibold text-[#212529] mb-4">
            OEM/Company Information
          </h2> */}

          <div className="grid md:grid-cols-2 gap-4">
            <InputFieldSupplier
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              error={errors.company_name}
            />

            <div>
              <label className="block text-sm font-medium text-[#212529] mb-1">
                Business Type
              </label>
              <Select
                options={businessTypeOptions}
                // isLoading={loadingBusinessTypes}
                value={
                  formData.business_type
                    ? {
                        value: formData.business_type,
                        label: formData.business_type,
                      }
                    : null
                }
                onChange={handleBusinessTypeChange}
                placeholder="Select business type"
                isClearable
                isSearchable
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "10px",
                    borderColor: errors.business_type ? "red" : "#D9D4C6",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: errors.business_type ? "red" : "#207EB1",
                    },
                  }),
                }}
                components={{
                  IndicatorSeparator: () => null,
                }}
              />
              {errors.business_type && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.business_type}
                </p>
              )}
            </div>

            <InputFieldSupplier
              label="Head Office Address"
              name="head_office_address"
              value={formData.head_office_address}
              onChange={handleChange}
              error={errors.head_office_address}
              isTextarea
            />

            <InputFieldSupplier
              label="Regional Office Address(if any) "
              name="regional_off_add"
              value={formData.regional_off_add}
              onChange={handleChange}
              error={errors.regional_off_add}
              isTextarea
            />

            {/* Country Select */}
            <div>
              <label className="block text-sm font-medium text-[#212529] mb-1">
                Country
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
            </div>
          </div>

          {/* Divider */}
          <hr className="my-8 border-gray-200" />

          {/* Contact Person Section */}
          <h2 className="text-lg font-semibold text-[#212529] mb-4">
            Contact Person
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <InputFieldSupplier
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              error={errors.full_name}
            />

            {/* <InputFieldSupplier
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              error={errors.designation}
            /> */}

            <InputFieldSupplier
              label="Email ID"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <InputFieldSupplier
              label="Phone Number"
              name="mobile_number"
              type="tel"
              value={formData.mobile_number}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, mobile_number: value });
              }}
              error={errors.mobile_number}
            />
            <InputFieldSupplier
              label="Office Telephone Number"
              name="office_number"
              type="tel"
              value={formData.office_number}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, office_number: value });
              }}
              error={errors.office_number}
            />

            <InputFieldSupplier
              label="Company Products and Services"
              name="product_category"
              value={formData.product_category}
              onChange={handleChange}
              error={errors.product_category}
            />

            <InputFieldSupplier
              label="Website Link"
              name="website_link"
              value={formData.website_link}
              onChange={handleChange}
              error={errors.website_link}
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
const InputFieldSupplier = ({
  label,
  name,
  type = "text",
  value,
  isTextarea = false,
  onChange,
  error,
}) => (
  <div>
    <label className="block text-sm font-medium text-[#212529] mb-1">
      {label}
    </label>
    {isTextarea ? (
      <textarea
        name={name}
        rows={3}
        placeholder={`Enter ${label.toLowerCase()}`}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-[10px] bg-white px-3 py-2 focus:ring-2 focus:outline-none transition resize-none ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-[#D9D4C6] focus:ring-[#207EB1]"
        }`}
      />
    ) : (
      <input
        type={type}
        name={name}
        placeholder={`Enter ${label.toLowerCase()}`}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-[10px] bg-white px-3 py-2 focus:ring-2 focus:outline-none transition ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-[#D9D4C6] focus:ring-[#207EB1]"
        }`}
      />
    )}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
