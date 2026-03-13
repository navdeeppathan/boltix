// import React from "react";
// import { FaEdit } from "react-icons/fa";

import { useEffect, useState } from "react";
import http from "../../service/http";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Swal from "sweetalert2";
import { baseURL } from "../../service/api";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 800,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function PlantSupervisorProfile() {
  const userdata = JSON.parse(localStorage.getItem("userData"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const progress = 70;
  // Keep it as is or calculate based on your logic\

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await http.get(`/users/profile/${userdata?.id}`); // your API route
      if (response.data.status) {
        console.log(response.data.data);
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [userdata?.id]);
  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    company_name: "",
    designation: "",
    business_type: "",
    location_country: "",
    no_of_offices: "",
    no_of_clients: "",
    no_of_machinery: "",
    product_category: "",
    maintainance_freq: "",
    pref_oem_service: "",
    manufacturer_service: "",
    reporting_approver: "",
    progress: 100,
  });
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        mobile_number: user.mobile_number || "",
        email: user.email || "",
        company_name: user.company?.company_name || "",
        designation: user.company?.designation || "",
        business_type: user.company?.business_type || "",
        location_country: user.company?.location_country || "",
        no_of_offices: user.company?.no_of_offices || "",
        no_of_clients: user.company?.no_of_clients || "",
        no_of_machinery: user.company?.no_of_machinery || "",
        product_category: user.company?.product_category || "",
        maintainance_freq: user.company?.maintainance_freq || "",
        pref_oem_service: user.company?.pref_oem_service || "",
        manufacturer_service: user.company?.manufacturer_service || "",
        reporting_approver: user.company?.reporting_approver || "",
        progress: 100,
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const handleSubmit = async () => {
    setLoadingUpdate(true);
    try {
      const data = new FormData();

      // Append all fields from formData
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (typeof formData[key] === "object") {
            data.append(key, JSON.stringify(formData[key]));
            console.log(JSON.stringify(formData[key]));
          } else {
            data.append(key, formData[key]);
          }
        }
      }

      // Send request
      const response = await http.put(`/users/update/${user.id}`, data);

      if (response.data.status) {
        setUser(response.data.data);
        localStorage.setItem("userData", JSON.stringify(response.data.data));

        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchUser();

        handleClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: response.data.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Update failed:", error);
      // Swal.fire({
      //   icon: "error",
      //   title: "Update Failed",
      //   text: error.response?.data?.message || "Something went wrong!",
      // });
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Something went wrong!",
      );
    } finally {
      setLoadingUpdate(false);
    }
  };

  console.log("formdata:-", formData);

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-full overflow-hidden">
          {/* Header Image */}
          <div className="overflow-hidden">
            <div className="relative">
              <img
                src="/bgimg.png"
                alt="Plant Banner"
                className="w-full h-60 rounded-[10px] object-cover"
              />
            </div>

            {/* Floating Info Card */}
            <div className="relative -mt-10 bg-[#F9F9F9] mx-6 rounded-[10px] shadow p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                {/* Left Section */}
                {/* <div className="flex items-start md:items-center gap-4">
                     <img
                       src="/person.jpg"
                       alt="User Logo"
                       className="w-14 h-14 rounded-full object-cover"
                     />
                     <div>
                       <h2 className="font-bold text-[#212529] leading-[100%] text-[20px] sm:text-[26px] md:text-[31.5px]">
                         {user?.company?.company_name || "N/A"} <br />
                         <span className="font-normal text-[#212529] leading-[100%] text-[12px] sm:text-[15px] md:text-[17.18px]">
                           ({user?.company?.designation || "Plant"})
                         </span>
                       </h2>
                     </div>
                   </div> */}
                <CompanyProfile user={user} />

                {/* Right Section - Edit Button */}
                <button
                  onClick={handleOpen}
                  className="mt-4 md:mt-0 bg-[#404040] text-white text-sm px-4 py-2 rounded-[6.56px] flex items-center gap-2 hover:bg-gray-700 transition"
                >
                  Edit Profile
                </button>
              </div>

              {/* Progress Section */}
              <div className="w-full mt-6">
                <div className="mt-3 text-xs text-[#212529] leading-tight space-y-1">
                  <p>
                    <span className="font-semibold">Comapny ID:</span>{" "}
                    {user?.id || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className="font-medium">
                      {user?.pic_status === 1 ? "Verified" : "Verified"}
                    </span>
                  </p>
                </div>

                <div className="relative w-full bg-gray-100 rounded-full h-[3px] mt-2">
                  <div
                    className="bg-blue-500 h-[3px] rounded-full relative transition-all duration-500"
                    style={{ width: `${user?.company?.progress}%` }}
                  >
                    <div className="absolute -top-6 right-0 translate-x-1/2">
                      <div className="relative bg-white text-[#000000] text-[10px] sm:text-[11px] font-medium px-2 py-[1px] rounded-full shadow-sm border border-gray-200 whitespace-nowrap">
                        {user?.company?.progress}% Completed
                        <div className="absolute left-1/2 -bottom-[4px] -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plant Overview / Details */}
          <div className="mt-4 bg-[#F9F9F9] mx-6 rounded-[10px] shadow p-6 space-y-8">
            {/* Plant Overview */}
            <div className="relative">
              <button className="absolute top-1 right-0 text-gray-500 hover:text-gray-700">
                <img
                  src="/elements.png"
                  alt=""
                  className="w-[20px] h-[20px] object-contain"
                />
              </button>
              <h2 className="text-lg font-semibold text-[#212529] mb-3">
                Company Overview
              </h2>
              <div className="grid sm:grid-cols-2 gap-y-2 text-[13px] text-[#212529]">
                <p>
                  <span className="font-semibold">Industry Type:</span>{" "}
                  {user?.company?.business_type || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Designation:</span>{" "}
                  {user?.company?.designation || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Employee Strength:</span>{" "}
                  {user?.company?.no_of_clients || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Contact Email:</span>{" "}
                  {user?.email || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Primary Contact:</span>{" "}
                  {user?.full_name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {user?.mobile_number || "N/A"}
                </p>
              </div>
            </div>

            {/* Divider Line */}
            <hr className="border-t border-[#000000]/20" />

            {/* Plant Details / Infrastructure */}
            <div className="relative">
              <button className="absolute top-1 right-0 text-gray-500 hover:text-gray-700">
                <img
                  src="/elements.png"
                  alt=""
                  className="w-[20px] h-[20px] object-contain"
                />
              </button>
              <h2 className="text-lg font-semibold text-[#212529] mb-3">
                Plant Details / Infrastructure
              </h2>
              <div className="grid sm:grid-cols-2 gap-y-2 text-[13px] text-[#212529]">
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {user?.company?.location_country || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Total Units:</span>{" "}
                  {user?.company?.no_of_employee || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Main Machinery:</span>{" "}
                  {user?.company?.product_category || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Maintenance Frequency:</span>{" "}
                  {user?.company?.maintainance_freq || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Preferred OEM Services:</span>{" "}
                  {user?.company?.pref_oem_services || "N/A"}
                </p>
              </div>
            </div>

            {/* Divider Line */}
            <hr className="border-t border-[#000000]/20" />

            {/* Plant Details / Infrastructure 2 */}
            <div className="relative">
              <button className="absolute top-1 right-0 text-gray-500 hover:text-gray-700">
                <img
                  src="/elements.png"
                  alt=""
                  className="w-[20px] h-[20px] object-contain"
                />
              </button>
              <h2 className="text-lg font-semibold text-[#212529] mb-3">
                Additional Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-y-2 text-[13px] text-[#212529]">
                <p>
                  <span className="font-semibold">Number of Sites:</span>{" "}
                  {user?.company?.no_of_offices || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Users in Each Site:</span>{" "}
                  {user?.company?.no_of_clients || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Reporting Approvers:</span>{" "}
                  {user?.company?.reporting_approver || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Machinery in Each Site:</span>{" "}
                  {user?.company?.no_of_machinery || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">
                    Manufacturers Providing Services:
                  </span>{" "}
                  {user?.company?.manufacturer_service || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/* Title */}
          <Typography variant="h6" component="h2" mb={2}>
            Edit Profile
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Top Fields */}
          <Box
            display="grid"
            gridTemplateColumns={{ sm: "1fr 1fr" }}
            gap={2}
            mb={2}
          >
            <TextField
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Contact Number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* Company / Plant Fields */}
          <Box
            display="grid"
            gridTemplateColumns={{ sm: "1fr 1fr" }}
            gap={2}
            mb={2}
          >
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              disabled
            />
            <TextField
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Industry Type"
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Location Country"
              name="location_country"
              value={formData.location_country}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="No of Offices"
              name="no_of_offices"
              value={formData.no_of_offices}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="No of Clients"
              name="no_of_clients"
              value={formData.no_of_clients}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="No of Machinery"
              name="no_of_machinery"
              value={formData.no_of_machinery}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Product Category"
              name="product_category"
              value={formData.product_category}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Maintenance Frequency"
              name="maintainance_freq"
              value={formData.maintainance_freq}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Preferred OEM Service"
              name="pref_oem_service"
              value={formData.pref_oem_service}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Manufacturers Providing Service"
              name="manufacturer_service"
              value={formData.manufacturer_service}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Reporting Approver"
              name="reporting_approver"
              value={formData.reporting_approver}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* Actions */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={loadingUpdate}
            >
              {loadingUpdate ? (
                <>
                  <CircularProgress size={24} color="inherit" />
                  "Saving..."
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

// adjust if needed

function CompanyProfile({ user }) {
  const [profilePic, setProfilePic] = useState(
    user?.company?.profile_pic
      ? `${user?.company?.profile_pic}`
      : "/person.jpg",
  );
  useEffect(() => {
    if (user?.company?.profile_pic) {
      setProfilePic(`${user.company.profile_pic}`);
    } else {
      setProfilePic("/person.jpg");
    }
  }, [user]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // handle file selection only
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    handleSubmit(file);
  };

  // handle API upload
  const handleSubmit = async (file) => {
    if (!file) return;
    if (!user?.id) {
      console.error("User ID is missing");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("profile_pic", file);

    setLoading(true);
    try {
      const response = await http.post("/company/profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      if (data.status) {
        setProfilePic(`${data.data.profile_pic}`);
      } else {
        alert(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error uploading profile picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start md:items-center gap-4 relative">
      <div className="relative w-14 h-14">
        <img
          src={profilePic || "/person.jpg"}
          alt="User Logo"
          className="w-14 h-14 rounded-full object-cover"
        />
        {/* Edit icon */}
        <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-md">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536M9 11l3 3L21 5l-3-3-12 12v3h3l12-12z"
            />
          </svg>
        </label>
      </div>

      <div>
        <h2 className="font-bold text-[#212529] leading-[100%] text-[20px] sm:text-[26px] md:text-[31.5px]">
          {user?.company?.company_name || "N/A"} <br />
          <span className="font-normal text-[#212529] leading-[100%] text-[12px] sm:text-[15px] md:text-[17.18px]">
            ({user?.company?.designation || "Plant"})
          </span>
        </h2>
      </div>
    </div>
  );
}
