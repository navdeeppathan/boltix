import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { AiOutlineClose } from "react-icons/ai";
import http from "../service/http";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

const CreateTicketModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    title: "Ticket 1",
    category: "",
    priority: "",
    department: "",
    description: "",
    model: "",
    date: "",
    time: "",
    photo: null,
  });

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get userData from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.id);
      } catch (error) {
        console.error("Error parsing userData from localStorage", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("user_id", userId); // Replace with actual user ID as needed
      data.append("ticket_title", formData.title);
      data.append("category", formData.category);
      data.append("priority", formData.priority);
      data.append("department", formData.department);
      data.append("description", formData.description);
      data.append("model_number", formData.model);
      data.append("issue_date", formData.date);
      data.append("issue_time", formData.time);

      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      // Append a dummy user_id if required; replace with actual user_id if available
      data.append("user_id", "7");

      const response = await http.post("/tickets", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.data;

      if (result.status) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: result.message || "Ticket created successfully",
        });
        handleClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: result.message || "Failed to create ticket",
        });
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text:
          error.response.data.message ||
          "An unexpected error occurred while creating the ticket.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-[#FFFFFF] w-full max-w-3xl rounded-xl shadow-lg p-6 md:p-8 relative overflow-y-auto max-h-[95vh]">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-black"
          >
            <AiOutlineClose size={22} />
          </button>

          <h2 className="text-lg md:text-[24px] text-[#212529] font-semibold mb-4">
            Create Ticket
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className=" md:text[18px] font-bold text-[#212529] mb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text[18px] font-normal text-[#212529] mb-2">
                    Ticket Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border text-[#212529] tetx-[18px] font-normal border-[#D9D4C6] bg-[#FFFFFF]  rounded-[10px] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text[18px] font-normal text-[#212529] mb-2">
                    Category / Machinery Type
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border  text-[#212529] tetx-[18px] font-normal border-[#D9D4C6] bg-[#FFFFFF]  rounded-[10px] px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="machine1">Machine 1</option>
                    <option value="machine2">Machine 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm md:text[18px] font-normal text-[#212529] mb-2">
                    Priority
                  </label>
                  <input
                    type="text"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full border  text-[#212529] tetx-[18px] font-normal border-[#D9D4C6] bg-[#FFFFFF]  rounded-[10px] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text[18px] font-normal text-[#212529] mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full border text-[#212529] tetx-[18px] font-normal border-[#D9D4C6] bg-[#FFFFFF]  rounded-[10px] px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Problem Details */}
            <div>
              <h3 className="md:text[18px] font-bold text-[#212529] mb-2">
                Problem Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block md:text[18px] font-normal text-[#212529] text-sm mb-2">
                    Description of Issue
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border text-[#212529] tetx-[18px] font-normal border-[#D9D4C6] bg-[#FFFFFF]  rounded-[10px] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 md:text[18px] font-normal text-[#212529]">
                    Photo
                  </label>
                  <div className="flex px-2 py-1 justify-between border border-[#D9D4C6] rounded-[10px] items-center space-x-3">
                    <img
                      src={
                        formData.photo
                          ? URL.createObjectURL(formData.photo)
                          : "/machine.jpg"
                      }
                      alt="preview"
                      className="w-[62px] h-8 object-cover rounded-[6px]"
                    />

                    <label className="px-3 md:w-[160.19px] flex items-center justify-center md:h-8 md:px-0 md:py-0 py-2 bg-[#207EB1] text-[14px] font-medium rounded-[8px] text-[#FFFFFF]  cursor-pointer hover:bg-blue-700">
                      Take Machine Photo
                      <input
                        type="file"
                        accept="image/*"
                        name="photo"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2 md:text[18px] font-normal text-[#212529]">
                    Model Number
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full border text-[#212529] tetx-[18px] font-normal border-[#D9D4C6] bg-[#FFFFFF]  rounded-[10px] px-3 py-2"
                  />
                </div>
                <div>
                  <div>
                    <label className="block text-sm mb-2 md:text[18px] font-normal text-[#212529]">
                      Date & Time Issue Reported
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full border text-[#212529] tetx-[18px] font-normal border-[#D9D4C6] bg-[#FFFFFF]  rounded-[10px] px-3 py-2"
                      />

                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full border text-[#212529] tetx-[18px] font-normal border-[#D9D4C6] bg-[#FFFFFF]  rounded-[10px] px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 text-[18px] bg-[#207EB1] font-medium text-[#FFFFFF] rounded-[14px] hover:bg-blue-700 flex items-center gap-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CreateTicketModal;
