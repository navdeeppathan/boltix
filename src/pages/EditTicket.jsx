import React, { useEffect, useState } from "react";
import { FaCheck, FaChevronRight, FaSignOutAlt } from "react-icons/fa";
import Select from "react-select";
import http from "../service/http";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useParams } from "react-router-dom";

const EditTicket = () => {
  const { id: ticketId } = useParams();

  const [step, setStep] = useState(1);
  const user = JSON.parse(localStorage.getItem("userData"));

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalDescription, setApprovalDescription] = useState("");
  const [approving, setApproving] = useState(false);

  const [formData, setFormData] = useState({
    user_id: user.id,
    steps: 4, // replace with actual logged-in user
    plant_name: "",
    category: "",
    ticket_title: "",
    priority: null,
    department: "",
    issue_date: "",
    issue_time: "",
    description: "",
    service: "",
    equipment: "",
    sub_equipment: "",
    model_number: "",
    service_description: "",
    serial_number: "",
    manufacturer: null,
    service_provider: "",
    order_reference_number: "",
    service_contract_reference_number: "",
    manufacturer_contact: "",
    manufacturer_email: "",
    service_contact_provider: "",
    service_provider_email: "",
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
    product_id: null,
    parent_user_id: user.parent_id,
  });

  const navigate = useNavigate();

  const steps =
    formData.category?.value === "Machine Breakdown"
      ? ["Basic Information", "Equipment Details", "Support"]
      : formData.category?.value === "Service Breakdown"
        ? ["Basic Information", "Service Details", "Support"]
        : ["Basic Information", "Support"];

  const nextStep = () => {
    if (step < steps.length) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const [categoryOptions, setCategories] = useState([]);
  const [priorityOptions, setPriorities] = useState([]);
  const [serviceOptions, setServices] = useState([]);
  const [equipmentOptions, setEquipments] = useState([]);
  const [manufacturerOptions, setManufacturers] = useState([]);
  const [serviceProviderOptions, setServiceProviders] = useState([]);
  const [orderOptions, setOrders] = useState([]);
  const [serviceContractOptions, setServiceContracts] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [responseModeOptions, setModes] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);

  useEffect(() => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().split(" ")[0].slice(0, 5); // HH:MM

    setFormData((prev) => ({
      ...prev,
      issue_date: currentDate,
      issue_time: currentTime,
    }));
  }, []);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          catRes,
          priRes,
          servRes,
          // equipRes,
          manuRes,
          provRes,
          orderRes,
          contractRes,
          statusRes,
          timeRes,
          depRes,
          modeRes,
        ] = await Promise.all([
          http.get("/categories"),
          http.get("/priorities"),
          http.get("/service-types"),
          // http.get("/equipments"),
          http.get("/users/manufacturers"),
          http.get("/service-providers"),
          http.get("/orders"),
          http.get("/service-contracts"),
          http.get("/statuses"),
          http.get("/time-durations"),
          http.get("/departments"),
          http.get("/response-modes"),
        ]);

        setTimeOptions(
          timeRes.data.data.map((item) => ({
            label: item.duration_label,
            value: item.duration_label,
          })),
        );
        setStatusOptions(
          statusRes.data.data.map((item) => ({
            label: item.status_name,
            value: item.status_name,
          })),
        );

        setCategories(
          catRes.data.data.map((item) => ({
            label: item.category_name,
            value: item.category_name,
          })),
        );

        setPriorities(
          priRes.data.data.map((item) => ({
            label: item.priority_name,
            value: item.id,
          })),
        );

        setServices(
          servRes.data.data.map((item) => ({
            label: item.service_name,
            value: item.service_name,
          })),
        );

        // setEquipments(
        //   equipRes.data.data.map((item) => ({
        //     label: item.equipment_name,
        //     value: item.equipment_name,
        //   }))
        // );

        setManufacturers(
          manuRes.data.data.map((item) => ({
            label: item.company?.company_name,
            value: item.id,
            data: item,
          })),
        );

        setData(manuRes.data.data);

        setServiceProviders(
          provRes.data.data.map((item) => ({
            label: item.provider_name,
            value: item.provider_name,
          })),
        );

        setOrders(
          orderRes.data.data.map((item) => ({
            label: item.order_name,
            value: item.order_name,
          })),
        );

        setServiceContracts(
          contractRes.data.data.map((item) => ({
            label: item.contract_name,
            value: item.contract_name,
          })),
        );

        setDepartments(
          depRes.data?.data.map((item) => ({
            label: item.name,
            value: item.name,
          })),
        );
        setModes(
          modeRes.data?.data.map((item) => ({
            label: item.label,
            value: item.value,
          })),
        );
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchData();
  }, []);

  console.log("menufactureroption:-", manufacturerOptions);

  const [equipmentData, setEquipmentData] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [childOptions, setChildOptions] = useState([]);

  // 🔹 Fetch parent + child equipment data once
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await http.get("/equipments");
        if (response.data?.status && Array.isArray(response.data.data)) {
          setEquipmentData(response.data.data);

          // Convert parent equipment list into dropdown options
          const parentList = response.data.data.map((item) => ({
            value: item.equipment_name,
            label: item.equipment_name,
            children: item.children || [],
          }));
          setParentOptions(parentList);
        }
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      }
    };
    fetchEquipments();
  }, []);

  // 🔹 Update child options when parent changes
  const handleParentChange = (selectedParent) => {
    setFormData((prev) => ({
      ...prev,
      equipment: selectedParent,
      sub_equipment: null, // reset child when parent changes
    }));

    if (selectedParent?.children?.length > 0) {
      const mappedChildren = selectedParent.children.map((child) => ({
        value: child.equipment_name,
        label: child.equipment_name,
      }));
      setChildOptions(mappedChildren);
    } else {
      setChildOptions([]);
    }
  };

  // 🔹 Handle child selection
  const handleChildChange = (selectedChild) => {
    setFormData((prev) => ({
      ...prev,
      sub_equipment: selectedChild,
    }));
  };

  const breakdownOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
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

  const [fileName, setFileName] = useState("");

  const selectedManufacturer = manufacturerOptions.find(
    (m) => m.value === formData.manufacturer?.value,
  );

  const productOptions =
    selectedManufacturer?.data?.products?.map((product) => ({
      label: product.name,
      value: product.id,
    })) || [];

  console.log(
    "productsoption:-",
    productOptions,
    formData.manufacturer,
    manufacturerOptions,
    selectedManufacturer,
  );

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

  useEffect(() => {
    if (!ticketId) return;

    const fetchTicket = async () => {
      try {
        const res = await http.get(`/tickets/${ticketId}`);
        const ticket = res.data.data;

        console.log("ticketwdit:-", ticket);

        setFormData((prev) => ({
          ...prev,
          plant_name: ticket.plant_name || "",
          category: ticket.category
            ? { label: ticket.category, value: ticket.category }
            : null,
          ticket_title: ticket.ticket_title || "",
          priority: ticket.priority?.id || null,
          department: ticket.department || "",
          issue_date: ticket.issue_date || "",
          issue_time: ticket.issue_time || "",
          description: ticket.description || "",
          service: ticket.service
            ? { label: ticket.service, value: ticket.service }
            : null,
          equipment: ticket.equipment
            ? { label: ticket.equipment, value: ticket.equipment }
            : null,
          sub_equipment: ticket.sub_equipment
            ? { label: ticket.sub_equipment, value: ticket.sub_equipment }
            : null,
          model_number: ticket.model_number || "",
          serial_number: ticket.serial_number || "",
          manufacturer: ticket.manufacturer
            ? manufacturerOptions.find((m) => m.value === ticket.manufacturer)
            : null,
          manufacturer_contact: ticket.manufacturer_contact || "",
          manufacturer_email: ticket.manufacturer_email || "",
          product_id: ticket.product_id || null,
          service_provider: ticket.service_provider
            ? { label: ticket.service_provider, value: ticket.service_provider }
            : null,

          service_contact_provider: ticket.service_contact_provider || "",
          service_provider_email: ticket.service_provider_email || "",
          service_description: ticket.service_description || "",
          order_reference_number: ticket.order_reference_number
            ? {
                label: ticket.order_reference_number,
                value: ticket.order_reference_number,
              }
            : null,
          service_contract_reference_number:
            ticket.service_contract_reference_number || "",
          service_breakdown: ticket.service_breakdown
            ? {
                label: ticket.service_breakdown,
                value: ticket.service_breakdown,
              }
            : null,
          explanation_of_service_breakdown:
            ticket.explanation_of_service_breakdown || "",
          need_product_installation_support:
            ticket.need_product_installation_support
              ? {
                  label: ticket.need_product_installation_support,
                  value: ticket.need_product_installation_support,
                }
              : null,
          need_service_implementation_support:
            ticket.need_service_implementation_support
              ? {
                  label: ticket.need_service_implementation_support,
                  value: ticket.need_service_implementation_support,
                }
              : null,
          replacement: ticket.replacement
            ? { label: ticket.replacement, value: ticket.replacement }
            : null,
          functional_and_process_information:
            ticket.functional_and_process_information || "",
          response_mode: ticket.response_mode
            ? { label: ticket.response_mode, value: ticket.response_mode }
            : null,
          status: ticket.status || "",
        }));

        // existing photo preview
        if (ticket.images?.length > 0) {
          setPhoto(
            `${process.env.REACT_APP_API_URL}/${ticket.images[0].photo}`,
          );
        }

        // existing document name
        if (ticket.documents?.length > 0) {
          setFileName(ticket.documents[0].upload_documents.split("/").pop());
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    };

    fetchTicket();
  }, [ticketId, manufacturerOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    // Step 1 → Validate base info
    if (step === 1) {
      if (!formData.plant_name) newErrors.plant_name = true;
      if (!formData.category) newErrors.category = true;
      if (!formData.ticket_title) newErrors.ticket_title = true;
      if (!formData.priority) newErrors.priority = true;
      if (!formData.department) newErrors.department = true;
      if (!formData.issue_date) newErrors.issue_date = true;
      if (!formData.issue_time) newErrors.issue_time = true;

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      nextStep();
    }

    console.log("cliecked");

    // Step 2 → Validate photo & service info
    if (step === 2 && formData.category?.value === "Machine Breakdown") {
      if (!formData.description) newErrors.description = true;
      if (!formData.photo) newErrors.photo = true;
      if (!formData.equipment) newErrors.equipment = true;
      if (!formData.sub_equipment) newErrors.sub_equipment = true;
      if (!formData.model_number) newErrors.model_number = true;
      if (!formData.order_reference_number)
        newErrors.order_reference_number = true;
      // if (!formData.manufacturer_contact) newErrors.manufacturer_contact = true;
      if (!formData.serial_number) newErrors.serial_number = true;
      if (!formData.manufacturer) newErrors.manufacturer = true;
      if (!formData.product_id) newErrors.product_id = true;
      if (!formData.service_breakdown) newErrors.service_breakdown = true;
      if (!formData.explanation_of_service_breakdown)
        newErrors.explanation_of_service_breakdown = true;
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      nextStep();
      return;
    }

    if (step === 2 && formData.category?.value === "Service Breakdown") {
      if (!formData.service) newErrors.service = true;
      if (!formData.service_description) newErrors.service_description = true;
      if (!formData.service_provider) newErrors.service_provider = true;

      if (!formData.service_contract_reference_number)
        newErrors.service_contract_reference_number = true;

      if (!formData.service_contact_provider)
        newErrors.service_contact_provider = true;
      if (!formData.service_provider_email)
        newErrors.service_provider_email = true;
      if (!formData.service_breakdown) newErrors.service_breakdown = true;
      if (!formData.explanation_of_service_breakdown)
        newErrors.explanation_of_service_breakdown = true;

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      nextStep();
      return;
    }

    // Step 4 → Final submit
    if (step === 3) {
      if (!formData.need_product_installation_support)
        newErrors.need_product_installation_support = true;
      if (!formData.need_service_implementation_support)
        newErrors.need_service_implementation_support = true;
      if (!formData.replacement) newErrors.replacement = true;
      if (!formData.functional_and_process_information)
        newErrors.functional_and_process_information = true;
      if (!formData.response_mode) newErrors.response_mode = true;
      // if (!formData.status) newErrors.status = true;

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      console.log("formdata:-", formData);

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

      for (let pair of ticketForm.entries()) {
        console.log(pair[0], pair[1]);
      }

      try {
        setLoading(true);

        const response = await http.post(`/tickets/${ticketId}`, ticketForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const result = await response.data;

        if (result.status) {
          if (result.status) {
            Swal.fire({
              icon: "success",
              title: "Ticket updated successfully!",
              timer: 1200,
              showConfirmButton: false,
            }).then(() => {
              // 🔥 Open approval popup AFTER success swal
              setShowApprovalModal(true);
            });
          }

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

  const submitApproval = async () => {
    if (!approvalDescription.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Description required",
        text: "Please enter approval description",
      });
      return;
    }

    try {
      setApproving(true);

      await http.post(`/tickets/approve_status/${ticketId}`, {
        action: 3, // example: 3 = Returned (change if needed)
        description: approvalDescription,
        user_id: user.id,
      });

      Swal.fire({
        icon: "success",
        title: "Approval submitted",
        timer: 1200,
        showConfirmButton: false,
      });

      setShowApprovalModal(false);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Approval failed",
        text: error.response?.data?.message || "Failed to submit approval",
      });
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full bg-[#FFFFFF] min-h-screen ">
      {/* Left Form Section */}
      <div className="w-full  bg-[#FFFFFF]  ">
        {/* Tabs */}

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
                    ? "bg-[#00C6A9] text-white border-[#00C6A9]" // green check
                    : isActive
                      ? "bg-[#207EB1] text-white border-[#207EB1]" // active
                      : "border-[#1E1E1E] text-[#1E1E1E]" // inactive
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
                    Breakdown Category
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
                  <Select
                    options={departments} // from state
                    placeholder="Select Department"
                    styles={customSelectStyles(errors.department)}
                    value={
                      departments.find(
                        (option) => option.value === formData.department,
                      ) || null
                    }
                    onChange={(option) =>
                      setFormData((prev) => ({
                        ...prev,
                        department: option.value,
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
                    value={
                      priorityOptions.find(
                        (option) => option.value === formData.priority,
                      ) || null
                    }
                    onChange={(option) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: option.value,
                      }))
                    }
                    components={{ IndicatorSeparator: () => null }}
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
            {formData.category?.value === "Machine Breakdown" && step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#000] mb-1">
                    Description of Issue
                  </label>

                  <Editor
                    style={{
                      height: "200px",
                      border: errors.description
                        ? "1px solid #f87171"
                        : "1px solid #D9D4C6",
                      // borderRadius: "8px",
                    }}
                    value={formData.description}
                    onTextChange={(e) =>
                      setFormData({ ...formData, description: e.htmlValue })
                    }
                  />

                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Select Equipment */}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Equipment (Category)
                    </label>
                    <Select
                      options={parentOptions}
                      placeholder="Select Equipment"
                      styles={customSelectStyles(errors.equipment)}
                      value={formData.equipment}
                      onChange={handleParentChange}
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>

                  {/* Child Equipment */}
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Equipment (Sub Category)
                    </label>
                    <Select
                      options={childOptions}
                      placeholder={
                        formData.equipment
                          ? "Select sub Equipment"
                          : "Select Equipment First"
                      }
                      isDisabled={!formData.equipment}
                      styles={customSelectStyles(errors.sub_equipment)}
                      value={formData.sub_equipment}
                      onChange={handleChildChange}
                      components={{ IndicatorSeparator: () => null }}
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
                        Upload Machine Photo
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

                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Select Manufacturer(OEM)
                    </label>
                    <Select
                      options={manufacturerOptions}
                      placeholder="Select Manufacturer"
                      styles={customSelectStyles(errors.manufacturer)}
                      value={formData.manufacturer}
                      onChange={(option) =>
                        setFormData((prev) => ({
                          ...prev,
                          manufacturer: option, // store only ID
                          manufacturer_contact:
                            option?.data?.mobile_number || "",
                          manufacturer_email: option?.data?.email || "",
                          product_id: null,
                        }))
                      }
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Select Machine of Manufacturer
                    </label>

                    <Select
                      options={productOptions}
                      placeholder={
                        formData.manufacturer
                          ? "Select Product"
                          : "Select Manufacturer First"
                      }
                      value={
                        productOptions.find(
                          (p) => p.value === formData.product_id,
                        ) || null
                      }
                      onChange={(option) =>
                        setFormData((prev) => ({
                          ...prev,
                          product_id: option.value, // store only product ID
                        }))
                      }
                      isDisabled={!formData.manufacturer}
                      components={{ IndicatorSeparator: () => null }}
                      styles={customSelectStyles(errors.product_id)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Manufacturer Contact Number (OEM)
                    </label>
                    <input
                      type="text"
                      name="manufacturer_contact"
                      placeholder="Manufacturer Contact"
                      value={formData.manufacturer_contact}
                      onChange={handleChange}
                      disabled
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
                      Manufacturer Email (OEM)
                    </label>
                    <input
                      type="text"
                      name="manufacturer_email"
                      placeholder="Manufacturer Email"
                      value={formData.manufacturer_email}
                      onChange={handleChange}
                      disabled
                      // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                      className={`w-full border ${
                        errors.manufacturer_email
                          ? "border-red-500"
                          : "border-[#D9D4C6]"
                      } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                        errors.manufacturer_email ? "red-500" : "007BFF"
                      }`}
                    />
                  </div>
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
                    <label className="block  text-sm font-medium text-[#000] mb-1">
                      Equipment Breakdown?
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
                  <label className="block text-sm  font-medium text-[#000] mb-1">
                    Explanation of Equipment Breakdown
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
              </>
            )}

            {formData.category?.value === "Service Breakdown" && step === 2 && (
              <div className="bg-[#F9F9F9]  rounded-2xl space-y-4">
                {/* Row 1 */}

                <div className="grid md:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Service Provider Contact
                    </label>
                    <input
                      type="text"
                      name="service_contact_provider"
                      placeholder="Service Provider Contact"
                      value={formData.service_contact_provider}
                      onChange={handleChange}
                      // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                      className={`w-full border ${
                        errors.service_contact_provider
                          ? "border-red-500"
                          : "border-[#D9D4C6]"
                      } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                        errors.service_contact_provider ? "red-500" : "007BFF"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Service Provider Email
                    </label>
                    <input
                      type="text"
                      name="service_provider_email"
                      placeholder="Service Provider Contact"
                      value={formData.service_provider_email}
                      onChange={handleChange}
                      // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                      className={`w-full border ${
                        errors.service_provider_email
                          ? "border-red-500"
                          : "border-[#D9D4C6]"
                      } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                        errors.service_provider_email ? "red-500" : "007BFF"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Service Contract Reference Number
                    </label>
                    {/* <Select
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
                    /> */}
                    <input
                      type="text"
                      name="service_contract_reference_number"
                      placeholder="Service Contract Reference Number"
                      value={formData.service_contract_reference_number}
                      onChange={handleChange}
                      // className="w-full border bg-white border-[#D9D4C6] rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                      className={`w-full border ${
                        errors.service_contract_reference_number
                          ? "border-red-500"
                          : "border-[#D9D4C6]"
                      } bg-white rounded-[8px] p-2.5 focus:outline-none focus:ring-2 focus:ring-${
                        errors.service_contract_reference_number
                          ? "red-500"
                          : "007BFF"
                      }`}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* select service */}
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Select Service
                    </label>
                    <Select
                      options={serviceOptions}
                      placeholder="Select Service"
                      styles={customSelectStyles(errors.service)}
                      value={formData.service}
                      onChange={(option) =>
                        setFormData((prev) => ({ ...prev, service: option }))
                      }
                      components={{ IndicatorSeparator: () => null }}
                    />
                  </div>
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

                {/* Row 3 */}
                <div className="grid md:grid-cols-2 gap-4"></div>

                {/* Row 4 */}
                <div className="grid md:grid-cols-2 gap-4"></div>

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
              <div className="bg-[#F9F9F9] p-6 rounded-2xl space-y-4">
                {/* Row 1 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#000] mb-1">
                      Do you need{" "}
                      {formData.category?.value === "Service Breakdown"
                        ? "additional service"
                        : "product installation"}{" "}
                      support?
                    </label>
                    <Select
                      options={yesNoOptions}
                      placeholder="Select"
                      styles={customSelectStyles(
                        errors.need_product_installation_support,
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
                      Do you need service implementation support?
                    </label>
                    <Select
                      options={yesNoOptions}
                      placeholder="Select"
                      styles={customSelectStyles(
                        errors.need_service_implementation_support,
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
                      Do you need product or{" "}
                      {formData.category?.value === "Service Breakdown"
                        ? "service"
                        : "equipment"}{" "}
                      replacement
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
                      Functional and process information if any
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
                      Response mode
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
                      Upload documents if any
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
                {/* <div className="grid md:grid-cols-2 gap-4">
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
                </div> */}
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
              {step === 3 && (
                <>
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
                        Updating...
                      </>
                    ) : (
                      "Submit to Manufacturer/Service provider"
                    )}
                  </button>
                </>
              )}

              {step !== 3 && (
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
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-lg p-6 relative">
            {/* Close */}
            <button
              onClick={() => setShowApprovalModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Add Approval Description
            </h2>

            {/* Description */}
            <Editor
              style={{ height: "180px", border: "1px solid #D9D4C6" }}
              value={approvalDescription}
              onTextChange={(e) => setApprovalDescription(e.htmlValue)}
            />

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={submitApproval}
                disabled={approving}
                className={`px-4 py-2 bg-[#007BFF] text-white rounded-md hover:bg-[#0066DD]
            ${approving ? "opacity-70 cursor-not-allowed" : ""}
          `}
              >
                {approving ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTicket;
