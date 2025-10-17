import React, { useEffect, useState } from "react";
import { FaCheck, FaChevronRight, FaSignOutAlt } from "react-icons/fa";
import Select from "react-select";
import http from "../service/http";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
const TicketCreation = () => {
  const [step, setStep] = useState(1);
  const user = JSON.parse(localStorage.getItem("userData"));
  const [formData, setFormData] = useState({
    user_id: user.id,
    steps: 4, // replace with actual logged-in user
    plant_name: "",
    category: "",
    ticket_title: "",
    priority: "",
    department: "",
    issue_date: "",
    issue_time: "",
    description: "",
    service: "",
    equipment: "",
    model_number: "",
    service_description: "",
    serial_number: "",
    manufacturer: "",
    service_provider: "",
    order_reference_number: "",
    service_contract_reference_number: "",
    manufacturer_contact: "",
    service_provider_contact: "",
    service_breakdown: "",
    explanation_of_service_breakdown: "",
    need_product_installation_support: "",
    need_service_implementation_support: "",
    replacement: "",
    functional_and_process_information: "",
    response_mode: "",
    status: "",
    photo: null,
    upload_document: null,
    response_time: "",
    resolution_time: "",
    escalation_time: "",
  });

  const navigate = useNavigate();

  const steps = [
    "Basic Information",
    "Equipment Info",
    "Service Information",
    "Support",
    "Define SLA",
  ];

  const nextStep = () => {
    if (step < steps.length) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const categoryOptions = [
    { value: "Machine Breakdown", label: "Machine Breakdown" },
    { value: "Service Breakdown", label: "Service Breakdown" },
  ];

  const priorityOptions = [
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const serviceOptions = [
    { value: "service", label: "Service" },
    { value: "maintenance", label: "Maintenance" },
    { value: "repair", label: "Repair" },
  ];

  const equipmentOptions = [
    { value: "machineA", label: "Machine A" },
    { value: "machineB", label: "Machine B" },
  ];

  const manufacturerOptions = [
    { value: "manufacturerA", label: "Manufacturer A" },
    { value: "manufacturerB", label: "Manufacturer B" },
  ];

  const serviceProviderOptions = [
    { value: "providerA", label: "Provider A" },
    { value: "providerB", label: "Provider B" },
  ];

  const orderOptions = [
    { value: "order1", label: "Order 001" },
    { value: "order2", label: "Order 002" },
  ];

  const serviceContractOptions = [
    { value: "contract1", label: "Contract 101" },
    { value: "contract2", label: "Contract 102" },
  ];

  const breakdownOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const responseModeOptions = [
    { value: "chat", label: "System Chat" },
    { value: "email", label: "Email" },
    { value: "call", label: "Phone Call" },
  ];

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "inProgress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const timeOptions = [
    { value: "1_hour", label: "1 Hour" },
    { value: "2_hours", label: "2 Hours" },
    { value: "4_hours", label: "4 Hours" },
    { value: "1_day", label: "1 Day" },
    { value: "2_days", label: "2 Days" },
  ];

  const customSelectStyles = (hasError = false) => ({
    control: (provided, state) => ({
      ...provided,
      borderRadius: "8px",
      borderColor: hasError
        ? "#DC2626" // red for error
        : state.isFocused
        ? "#007BFF"
        : "#D9D4C6",
      boxShadow: state.isFocused
        ? `0 0 0 1px ${hasError ? "#DC2626" : "#007BFF"}`
        : "none",
      padding: "2.5px",
      "&:hover": {
        borderColor: hasError ? "#DC2626" : "#007BFF",
      },
      minHeight: "40px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#111827",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#6B7280",
    }),
  });

  const [photo, setPhoto] = useState(null);

  // const handlePhotoCapture = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setPhoto(imageUrl);
  //   }
  // };

  const [fileName, setFileName] = useState("");

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFileName(file.name);
  //   } else {
  //     setFileName("");
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormData((prev) => ({ ...prev, upload_document: file }));
    } else {
      setFileName("");
      setFormData((prev) => ({ ...prev, upload_document: null }));
    }
  };

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    // Step 1 → Validate base info
    if (step === 1) {
      if (!formData.plant_name) newErrors.plant_name = true;
      if (!formData.category) newErrors.category = true;
      if (!formData.ticket_title) newErrors.ticket_title = true;

      if (!formData.department) newErrors.department = true;
      if (!formData.issue_date) newErrors.issue_date = true;
      if (!formData.issue_time) newErrors.issue_time = true;

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      nextStep();
    }

    // Step 2 → Validate photo & service info
    if (step === 2) {
      if (!formData.description) newErrors.description = true;
      if (!formData.photo) newErrors.photo = true;
      if (!formData.service) newErrors.service = true;
      if (!formData.equipment) newErrors.equipment = true;
      if (!formData.model_number) newErrors.model_number = true;
      if (!formData.service_description) newErrors.service_description = true;

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      nextStep();
    }

    // Step 3 → Validate service provider info
    if (step === 3) {
      if (!formData.serial_number) newErrors.serial_number = true;
      if (!formData.manufacturer) newErrors.manufacturer = true;
      if (!formData.service_provider) newErrors.service_provider = true;
      if (!formData.order_reference_number)
        newErrors.order_reference_number = true;
      if (!formData.service_contract_reference_number)
        newErrors.service_contract_reference_number = true;
      if (!formData.manufacturer_contact) newErrors.manufacturer_contact = true;
      if (!formData.service_provider_contact)
        newErrors.service_provider_contact = true;
      if (!formData.service_breakdown) newErrors.service_breakdown = true;
      if (!formData.explanation_of_service_breakdown)
        newErrors.explanation_of_service_breakdown = true;

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      nextStep();
    }

    // Step 4 → Final submit
    if (step === 4) {
      if (!formData.need_product_installation_support)
        newErrors.need_product_installation_support = true;
      if (!formData.need_service_implementation_support)
        newErrors.need_service_implementation_support = true;
      if (!formData.replacement) newErrors.replacement = true;
      if (!formData.functional_and_process_information)
        newErrors.functional_and_process_information = true;
      if (!formData.response_mode) newErrors.response_mode = true;
      if (!formData.status) newErrors.status = true;

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      nextStep();
    }

    if (step === 5) {
      if (!formData.response_time) newErrors.response_time = true;
      if (!formData.resolution_time) newErrors.resolution_time = true;
      if (!formData.escalation_time) newErrors.escalation_time = true;
      if (!formData.priority) newErrors.priority = true;
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const ticketForm = new FormData();

      // Append all fields properly (convert selects if needed)
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === "object" && value.value !== undefined) {
            ticketForm.append(key, value.value);
          } else {
            ticketForm.append(key, value);
          }
        }
      });

      if (formData.photo instanceof File) {
        ticketForm.append("photo", formData.photo);
      }

      if (formData.upload_document instanceof File) {
        ticketForm.append("upload_documents", formData.upload_document);
      }

      try {
        setLoading(true);

        // Correct endpoint (matches Laravel)
        const response = await http.post("/tickets", ticketForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const result = await response.data;

        if (result.status) {
          Swal.fire({
            icon: "success",
            title: "Ticket submitted successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/dashboard");
          console.log("Response:", result);
        } else {
          Swal.fire({
            icon: "error",
            title: "Submission failed",
            text: result.message || "Submission failed",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          icon: "error",
          title: "Submission failed",
          text:
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Something went wrong while submitting.",
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full bg-[#FFFFFF] min-h-screen ">
      {/* Left Form Section */}
      <div className="w-full  bg-[#FFFFFF]  ">
        {/* Tabs */}
        {/* <div className="w-full mb-6 bg-[#F9F9F9] rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-wrap border border-[#E5E5E5] rounded-xl overflow-hidden">
            {steps.map((title, index) => {
              const isCompleted = step > index + 1;
              const isActive = step === index + 1;

              return (
                <button
                  key={index}
                  onClick={() => setStep(index + 1)}
                  className={`relative flex items-center justify-center gap-2 w-full sm:w-1/2 md:w-1/4 py-5 px-2 border-r border-[#E5E5E5] last:border-r-0 transition-all 
                ${
                  isActive
                    ? "bg-[#F9F9F9] text-[#207EB1] font-semibold"
                    : "bg-[#F9F9F9] text-[#000]"
                }`}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold border 
                  ${
                    isCompleted
                      ? "bg-[#00C6A9] text-white border-[#00C6A9]" // ✅ green check
                      : isActive
                      ? "bg-[#207EB1] text-white border-[#207EB1]" // 🔵 active
                      : "border-[#1E1E1E] text-[#1E1E1E]" // ⚪ inactive
                  }`}
                  >
                    {isCompleted ? <FaCheck size={10} /> : index + 1}
                  </div>

                  <span className="text-sm md:text-[14px] whitespace-nowrap">
                    {title}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#207EB1]" />
                  )}
                </button>
              );
            })}
          </div>
        </div> */}

        <div className="w-full mb-6 bg-[#F9F9F9] rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-wrap border border-[#E5E5E5] rounded-xl overflow-hidden">
            {steps.map((title, index) => {
              const isCompleted = step > index + 1;
              const isActive = step === index + 1;

              return (
                <button
                  key={index}
                  onClick={() => setStep(index + 1)}
                  className={`relative flex items-center justify-center gap-2 flex-1 py-5 px-2 border-r border-[#E5E5E5] last:border-r-0 transition-all duration-200 
              ${
                isActive
                  ? "bg-[#F9F9F9] text-[#207EB1] font-semibold"
                  : "bg-[#F9F9F9] text-[#000]"
              }`}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold border 
                ${
                  isCompleted
                    ? "bg-[#00C6A9] text-white border-[#00C6A9]" // ✅ green check
                    : isActive
                    ? "bg-[#207EB1] text-white border-[#207EB1]" // 🔵 active
                    : "border-[#1E1E1E] text-[#1E1E1E]" // ⚪ inactive
                }`}
                  >
                    {isCompleted ? <FaCheck size={10} /> : index + 1}
                  </div>

                  <span className="text-sm md:text-[14px] whitespace-nowrap">
                    {title}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#207EB1]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-[#F9F9F9] rounded-[14px] p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* STEP CONTENT */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Site Name / Plant Name */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Site Name /Plant Name
                  </label>
                  <input
                    type="text"
                    name="plant_name"
                    placeholder="Plant Name"
                    value={formData.plant_name}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.plant_name ? "border-red-500" : "border-[#D9D4C6]"
                    } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                      errors.plant_name ? "red-500" : "007BFF"
                    }`}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Category
                  </label>
                  <Select
                    options={categoryOptions}
                    placeholder="Select category"
                    styles={customSelectStyles(errors.category)}
                    value={formData.category}
                    onChange={(option) =>
                      setFormData((prev) => ({ ...prev, category: option }))
                    }
                    components={{ IndicatorSeparator: () => null }}
                  />
                </div>

                {/* Ticket Title */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Ticket Title
                  </label>
                  <input
                    type="text"
                    placeholder="Ticket 1"
                    name="ticket_title"
                    value={formData.ticket_title}
                    onChange={handleChange}
                    // className="w-full border border-[#D9D4C6] bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    className={`w-full border ${
                      errors.ticket_title
                        ? "border-red-500"
                        : "border-[#D9D4C6]"
                    } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                      errors.ticket_title ? "red-500" : "007BFF"
                    }`}
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                    // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    className={`w-full border ${
                      errors.department ? "border-red-500" : "border-[#D9D4C6]"
                    } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                      errors.department ? "red-500" : "007BFF"
                    }`}
                  />
                </div>

                {/* Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Date & Time Issue Reported
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      name="issue_date"
                      value={formData.issue_date}
                      onChange={handleChange}
                      // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                      className={`w-full border ${
                        errors.issue_date
                          ? "border-red-500"
                          : "border-[#D9D4C6]"
                      } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                        errors.issue_date ? "red-500" : "007BFF"
                      }`}
                    />
                    <input
                      type="time"
                      name="issue_time"
                      value={formData.issue_time}
                      onChange={handleChange}
                      // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                      className={`w-full border ${
                        errors.issue_time
                          ? "border-red-500"
                          : "border-[#D9D4C6]"
                      } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                        errors.issue_time ? "red-500" : "007BFF"
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Description of Issue */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Description of Issue
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    className={`w-full border ${
                      errors.description ? "border-red-500" : "border-[#D9D4C6]"
                    } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                      errors.description ? "red-500" : "007BFF"
                    }`}
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Photo
                  </label>
                  <div
                    className={`flex items-center bg-white justify-between w-full border  ${
                      errors.photo ? "border-red-600" : "border-[#D9D4C6]"
                    } rounded-[8px] p-1.5`}
                  >
                    <div className="flex items-center gap-2">
                      {photo && (
                        <img
                          src={photo}
                          alt="Machine"
                          className="w-10 h-10 rounded-md object-cover"
                        />
                      )}
                    </div>
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer px-4 py-2 bg-[#007BFF] text-white rounded-md hover:bg-[#0066DD] text-sm whitespace-nowrap"
                    >
                      Take Machine Photo
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoCapture}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Select Equipment */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Select Equipment
                  </label>
                  <Select
                    options={serviceOptions}
                    placeholder="Select Equipment"
                    styles={customSelectStyles(errors.equipment)}
                    value={formData.equipment}
                    onChange={(option) =>
                      setFormData((prev) => ({ ...prev, equipment: option }))
                    }
                    components={{ IndicatorSeparator: () => null }}
                  />
                </div>

                {/* Select Service */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Select Service
                  </label>
                  <Select
                    options={equipmentOptions}
                    placeholder="Select Service"
                    styles={customSelectStyles(errors.service)}
                    value={formData.service}
                    onChange={(option) =>
                      setFormData((prev) => ({ ...prev, service: option }))
                    }
                    components={{ IndicatorSeparator: () => null }}
                  />
                </div>

                {/* Model Number */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Model Number
                  </label>
                  <input
                    type="text"
                    name="model_number"
                    value={formData.model_number}
                    onChange={handleChange}
                    placeholder="Model Number"
                    // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    className={`w-full border ${
                      errors.model_number
                        ? "border-red-500"
                        : "border-[#D9D4C6]"
                    } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                      errors.model_number ? "red-500" : "007BFF"
                    }`}
                  />
                </div>

                {/* Service Description */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Service Description
                  </label>
                  <textarea
                    rows="3"
                    name="service_description"
                    value={formData.service_description}
                    onChange={handleChange}
                    placeholder="Service Description"
                    // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    className={`w-full border ${
                      errors.service_description
                        ? "border-red-500"
                        : "border-[#D9D4C6]"
                    } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                      errors.service_description ? "red-500" : "007BFF"
                    }`}
                  ></textarea>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-[#F9F9F9]  rounded-2xl space-y-4">
                {/* Row 1 */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    placeholder="Serial Number"
                    // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    className={`w-full border ${
                      errors.serial_number
                        ? "border-red-500"
                        : "border-[#D9D4C6]"
                    } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                      errors.serial_number ? "red-500" : "007BFF"
                    }`}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Select Manufacturer
                    </label>
                    <Select
                      options={manufacturerOptions}
                      placeholder="Select Manufacturer"
                      styles={customSelectStyles(errors.manufacturer)}
                      value={formData.manufacturer}
                      onChange={(option) =>
                        setFormData((prev) => ({
                          ...prev,
                          manufacturer: option,
                        }))
                      }
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Select Service Provider
                    </label>
                    <Select
                      options={serviceProviderOptions}
                      placeholder="Select Service Provider"
                      styles={customSelectStyles(errors.service_provider)}
                      value={formData.service_provider}
                      onChange={(option) =>
                        setFormData((prev) => ({
                          ...prev,
                          service_provider: option,
                        }))
                      }
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Order / Reference Number
                    </label>
                    <Select
                      options={orderOptions}
                      placeholder="Select Order"
                      styles={customSelectStyles(errors.order_reference_number)}
                      value={formData.order_reference_number}
                      onChange={(option) =>
                        setFormData((prev) => ({
                          ...prev,
                          order_reference_number: option,
                        }))
                      }
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Service Contract Reference Number
                    </label>
                    <Select
                      options={serviceContractOptions}
                      placeholder="Select Contract"
                      styles={customSelectStyles(
                        errors.service_contract_reference_number
                      )}
                      value={formData.service_contract_reference_number}
                      onChange={(option) =>
                        setFormData((prev) => ({
                          ...prev,
                          service_contract_reference_number: option,
                        }))
                      }
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Manufacturer Contact
                    </label>
                    <input
                      type="text"
                      name="manufacturer_contact"
                      placeholder="Manufacturer Contact"
                      value={formData.manufacturer_contact}
                      onChange={handleChange}
                      // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                      className={`w-full border ${
                        errors.manufacturer_contact
                          ? "border-red-500"
                          : "border-[#D9D4C6]"
                      } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                        errors.manufacturer_contact ? "red-500" : "007BFF"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Service Provider Contact
                    </label>
                    <input
                      type="text"
                      name="service_provider_contact"
                      placeholder="Service Provider Contact"
                      value={formData.service_provider_contact}
                      onChange={handleChange}
                      // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                      className={`w-full border ${
                        errors.service_provider_contact
                          ? "border-red-500"
                          : "border-[#D9D4C6]"
                      } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                        errors.service_provider_contact ? "red-500" : "007BFF"
                      }`}
                    />
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Service Breakdown?
                    </label>
                    <Select
                      options={breakdownOptions}
                      placeholder="Select"
                      styles={customSelectStyles(errors.service_breakdown)}
                      value={formData.service_breakdown}
                      onChange={(option) =>
                        setFormData((prev) => ({
                          ...prev,
                          service_breakdown: option,
                        }))
                      }
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Explanation of Service Breakdown
                  </label>
                  <textarea
                    rows="3"
                    name="explanation_of_service_breakdown"
                    value={formData.explanation_of_service_breakdown}
                    onChange={handleChange}
                    placeholder="Explanation of Service Breakdown"
                    // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    className={`w-full border ${
                      errors.explanation_of_service_breakdown
                        ? "border-red-500"
                        : "border-[#D9D4C6]"
                    } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                      errors.explanation_of_service_breakdown
                        ? "red-500"
                        : "007BFF"
                    }`}
                  ></textarea>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="bg-[#F9F9F9] p-6 rounded-2xl space-y-4">
                {/* Row 1 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Do You Need Product Installation Support?
                    </label>
                    <Select
                      options={yesNoOptions}
                      placeholder="Select"
                      styles={customSelectStyles(
                        errors.need_product_installation_support
                      )}
                      value={formData.need_product_installation_support}
                      onChange={(option) =>
                        setFormData((prev) => ({
                          ...prev,
                          need_product_installation_support: option,
                        }))
                      }
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Do You Need Service Implementation support?
                    </label>
                    <Select
                      options={yesNoOptions}
                      placeholder="Select"
                      styles={customSelectStyles(
                        errors.need_service_implementation_support
                      )}
                      value={formData.need_service_implementation_support}
                      onChange={(option) =>
                        setFormData((prev) => ({
                          ...prev,
                          need_service_implementation_support: option,
                        }))
                      }
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Replacement
                    </label>
                    <Select
                      options={yesNoOptions}
                      placeholder="Select"
                      styles={customSelectStyles(errors.replacement)}
                      value={formData.replacement}
                      onChange={(option) =>
                        setFormData((prev) => ({
                          ...prev,
                          replacement: option,
                        }))
                      }
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Functional and Process information if any
                    </label>
                    <input
                      type="text"
                      placeholder="Yes"
                      name="functional_and_process_information"
                      value={formData.functional_and_process_information}
                      onChange={handleChange}
                      // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                      className={`w-full border ${
                        errors.functional_and_process_information
                          ? "border-red-500"
                          : "border-[#D9D4C6]"
                      } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                        errors.functional_and_process_information
                          ? "red-500"
                          : "007BFF"
                      }`}
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Response Mode
                    </label>
                    <Select
                      options={responseModeOptions}
                      placeholder="System Chat"
                      styles={customSelectStyles(errors.response_mode)}
                      value={formData.response_mode}
                      onChange={(option) =>
                        setFormData((prev) => ({
                          ...prev,
                          response_mode: option,
                        }))
                      }
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Upload Documents if any
                    </label>
                    <div
                      className={`flex items-center bg-white gap-2 border ${
                        errors.file ? "border-red-500" : "border-[#D9D4C6]"
                      } rounded-[8px] p-1.5`}
                    >
                      <input
                        type="text"
                        disabled
                        value={fileName || "No file chosen"}
                        className="flex-1 p-1.5 text-sm text-gray-600 bg-transparent focus:outline-none"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer px-4 py-2 bg-[#007BFF] text-white text-sm rounded-md hover:bg-[#0066DD]"
                      >
                        Upload
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Status
                    </label>
                    <Select
                      options={statusOptions}
                      placeholder="New"
                      styles={customSelectStyles(errors.status)}
                      value={formData.status}
                      onChange={(option) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: option,
                        }))
                      }
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Response Time
                  </label>
                  <Select
                    options={timeOptions}
                    placeholder="How long it takes to acknowledge a new ticket."
                    styles={customSelectStyles(errors.response_time)}
                    value={formData.response_time}
                    onChange={(option) =>
                      setFormData((prev) => ({
                        ...prev,
                        response_time: option,
                      }))
                    }
                    components={{ IndicatorSeparator: () => null }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Resolution Time
                  </label>
                  <Select
                    options={timeOptions}
                    placeholder="How long it takes to close or resolve the ticket."
                    styles={customSelectStyles(errors.resolution_time)}
                    value={formData.resolution_time}
                    onChange={(option) =>
                      setFormData((prev) => ({
                        ...prev,
                        resolution_time: option,
                      }))
                    }
                    components={{ IndicatorSeparator: () => null }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Escalation Time
                  </label>
                  <Select
                    options={timeOptions}
                    placeholder="When a ticket should auto-escalate if not resolved."
                    styles={customSelectStyles(errors.escalation_time)}
                    value={formData.escalation_time}
                    onChange={(option) =>
                      setFormData((prev) => ({
                        ...prev,
                        escalation_time: option,
                      }))
                    }
                    components={{ IndicatorSeparator: () => null }}
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Priority
                  </label>
                  <Select
                    options={priorityOptions}
                    placeholder="Select priority"
                    styles={customSelectStyles(errors.priority)}
                    value={formData.priority}
                    onChange={(option) =>
                      setFormData((prev) => ({ ...prev, priority: option }))
                    }
                    components={{ IndicatorSeparator: () => null }}
                  />
                </div>
              </div>
            )}

            {/* SINGLE NAVIGATION SECTION (shared for all steps) */}
            <div className="border-t border-[#000000]/30 pt-6 flex flex-wrap justify-between  gap-4">
              {/* Back button - visible in all steps */}
              <button
                type="button"
                disabled={step === 1}
                onClick={prevStep}
                className="px-6 py-2 border border-[#D1D5DB] rounded-md text-[#000] bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Back
              </button>

              {/* Step 4 (final step) buttons */}
              {step === 5 && (
                <>
                  {/* <button
                    type="button"
                    className="px-6 py-2 bg-[#007BFF] text-white rounded-md hover:bg-[#0066DD]"
                  >
                    Submit for Approval
                  </button> */}
                  {/* <button
                    type="button"
                    className="px-6 py-2 bg-[#A8D0FF] text-white rounded-md cursor-default"
                  >
                    Approval yes
                  </button> */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 px-6 py-2 h-[40px] bg-[#007BFF] text-white rounded-md transition ${
                      loading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-[#0066DD]"
                    }`}
                  >
                    {loading ? (
                      <>
                        <RotatingLines
                          strokeColor="#FFFFFF"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="20"
                          visible={true}
                        />
                        Submitting...
                      </>
                    ) : (
                      "Submit to OEM/Service provider"
                    )}
                  </button>
                </>
              )}

              {step !== 5 && (
                /* Step 1–3: Next button */
                <button
                  type="submit"
                  // onClick={nextStep}
                  className="px-8 py-2 bg-[#007BFF] text-white rounded-md hover:bg-[#0066DD] flex items-center gap-2 transition"
                >
                  Next <FaChevronRight size={14} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right Sidebar */}
      {/* <div className="w-full md:w-[20%]">
        <UserCard />
        <div className=" bg-[#F9F9F9] rounded-xl shadow-sm p-4">
          <h4 className="font-semibold text-[#212529] mb-3">Recent Messages</h4>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-3 shadow-sm text-sm text-[#333]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/34/Red_circle.svg"
                    alt="icon"
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-[#D8232A]">Daihatsu</span>
                </div>
                <p className="text-[12px] text-[#555] mb-2 leading-snug">
                  Thank you for reaching out. We’ve received your inquiry
                  regarding the centrifugal pump repair and are reviewing your
                  details.
                </p>
                <div className="flex justify-between text-[11px] text-[#9D9D9D]">
                  <span>1m ago</span>
                  <button className="text-[#007BFF] hover:underline">
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

const UserCard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    console.log(storedData);
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  if (!userData) {
    return <div>Loading...</div>; // or return null to render nothing until data is loaded
  }

  return (
    <div className="bg-[#F9F9F9] rounded-2xl shadow p-4 w-full mx-auto mb-6 flex flex-col items-center">
      {/* Role / Designation */}
      <p className="text-sm text-[#212529] text-[16px] font-bold mb-4 self-start">
        {userData.company?.designation || "N/A"}
      </p>

      {/* Profile Image */}
      <img
        src="https://i.pravatar.cc/100"
        alt="user"
        className="w-16 h-16 rounded-full mb-2 object-cover"
      />

      {/* Email */}
      <p className="text-sm text-[16px] font-bold text-[#212529]">
        {userData.email || "User email not available"}
      </p>

      {/* Company Name */}
      <p className="text-sm text-[#666] text-[14px] mt-1">
        {userData.company?.company_name || "Company name not available"}
      </p>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        className="mt-10 px-4 py-2 bg-[#D9D9D9]/20 rounded-[30px] flex items-center text-[16px] font-semibold justify-center gap-2 text-[#212529] hover:bg-gray-200 transition text-sm"
      >
        <FaSignOutAlt className="text-gray-600" /> Logout
      </button>
    </div>
  );
};
export default TicketCreation;
