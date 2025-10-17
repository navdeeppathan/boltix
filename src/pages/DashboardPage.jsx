// DashboardPage.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  FaTicketAlt,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaClock,
  FaUsers,
  FaFileAlt,
  FaCommentAlt,
  FaVideo,
  FaPhone,
  FaSignOutAlt,
  FaCamera,
} from "react-icons/fa";
import http from "../service/http";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";

import { baseURL } from "../service/api";
import Swal from "sweetalert2";
import { RotatingLines } from "react-loader-spinner";

import { Videocam, Call, Close } from "@mui/icons-material";
import { toast } from "react-toastify";

import "../utils/CustomScroll.css";

const DashboardPage = () => {
  const stats = [
    {
      label: "Open Tickets",
      value: 3,
      icon: <FaTicketAlt />,
      color: "bg-pink-500",
    },
    {
      label: "In Progress Tickets",
      value: 2,
      icon: <FaHourglassHalf />,
      color: "bg-purple-500",
    },
    {
      label: "High Priority Issues",
      value: 1,
      icon: <FaExclamationTriangle />,
      color: "bg-pink-600",
    },
    {
      label: "Recently Created Tickets",
      value: 3,
      icon: <FaClock />,
      color: "bg-blue-500",
    },
    {
      label: "Issues Reported",
      value: 15,
      icon: <FaFileAlt />,
      color: "bg-blue-600",
    },
    {
      label: "Active Conversations",
      value: 3,
      icon: <FaUsers />,
      color: "bg-sky-500",
    },
  ];
  return (
    <div className="bg-[#FFFFFF] space-y-6">
      <DashboardStatus />
      <TicketOverview />
    </div>
  );
};

export default DashboardPage;

const DashboardStatus = () => {
  // const stats = [
  //   {
  //     label: "Open Tickets",
  //     value: 3,
  //     icon: "/h1.png",
  //     color: "bg-[#DC2776]",
  //   },
  //   {
  //     label: "In Progress Tickets",
  //     value: 2,
  //     icon: "/h2.png",
  //     color: "bg-[#9532E9]",
  //   },
  //   {
  //     label: "High Priority Issues",
  //     value: 1,
  //     icon: "/h3.png",
  //     color: "bg-[#EA2179]",
  //   },
  //   {
  //     label: "Recently Created Tickets",
  //     value: 3,
  //     icon: "/h4.png",
  //     color: "bg-[#2466EB]",
  //   },
  //   {
  //     label: "Issues Reported",
  //     value: 15,
  //     icon: "/h5.png",
  //     color: "bg-[#037DC8]",
  //   },
  //   {
  //     label: "Active Conversations",
  //     value: 3,
  //     icon: "/h6.png",
  //     color: "bg-[#09A7EA]",
  //   },
  // ];

  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await http.get("/tickets/by-stage"); // your API endpoint
        const groupedTickets = res.data.data;

        const statsArray = [
          {
            label: "Open Tickets",
            value: groupedTickets.open.length,
            icon: "/h1.png",
            color: "bg-[#DC2776]",
          },
          {
            label: "In Progress Tickets",
            value: groupedTickets.in_progress.length,
            icon: "/h2.png",
            color: "bg-[#9532E9]",
          },
          {
            label: "High Priority Issues",
            value: groupedTickets.high_priority.length,
            icon: "/h3.png",
            color: "bg-[#EA2179]",
          },
          {
            label: "Recently Created Tickets",
            value: groupedTickets.recently_created.length,
            icon: "/h4.png",
            color: "bg-[#2466EB]",
          },
          {
            label: "Issues Reported",
            value:
              groupedTickets.pending.length +
              groupedTickets.in_progress.length +
              groupedTickets.open.length,
            icon: "/h5.png",
            color: "bg-[#037DC8]",
          },
          {
            label: "Active Conversations",
            value:
              groupedTickets.pending.reduce(
                (acc, t) => acc + t.chats.length,
                0
              ) +
              groupedTickets.in_progress.reduce(
                (acc, t) => acc + t.chats.length,
                0
              ) +
              groupedTickets.open.reduce((acc, t) => acc + t.chats.length, 0),
            icon: "/h6.png",
            color: "bg-[#09A7EA]",
          },
        ];

        setStats(statsArray);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };

    fetchTickets();
  }, []);
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* ✅ Left: Current Status (80%) */}
      <div className="w-full  bg-[#F9F9F9] rounded-[14px] p-4 sm:p-6 md:p-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-[16px] text-[#212529] font-bold">
            Current Status
          </h2>
          <select className="bg-[#FFFFFF] w-[100px] sm:w-[120px] h-[32px] rounded-[7.44px] px-2 py-1 text-sm text-[#212529] font-medium border border-gray-200 focus:outline-none">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>

        {/* Responsive Grid of Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 flex flex-col items-start justify-between text-start min-h-[120px] sm:min-h-[150px]"
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white mb-2 ${item.color}`}
              >
                <img
                  src={item.icon}
                  alt=""
                  className="w-[20px] h-[20px] sm:w-[25px] sm:h-[25px]"
                />
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-[#000000] font-semibold leading-tight">
                {item.value}
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-[14px] text-[#000000] font-medium leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Right: Ongoing Call (20%) */}
      {/* <div className="w-full lg:w-[20%] bg-[#F9F9F9] rounded-[14px] p-4 flex flex-col items-center justify-center relative">
        
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <img src="/person.jpg" alt="user" className="w-9 h-9 rounded-full" />
        </div>

        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <img src="/callside.png" alt="" className="w-8 h-8" />
        </button>

        
        <div className="w-[82px] h-[82px] flex items-center justify-center rounded-full bg-[#FFFFFF] mb-3 mt-6">
          <img
            src="/call.png"
            alt=""
            className="w-[58px] object-contain h-[58px]"
          />
        </div>

        <p className="text-[#000000] md:text-[14px] font-semibold">
          15 : 00 min
        </p>
        <p className="text-md text-[#000000] md:text-[16px] font-bold mb-3">
          Ongoing Calls
        </p>

        <button className="w-10 h-10 flex items-center justify-center rounded-full">
          <img src="/redcall.png" alt="" className="w-9 h-9" />
        </button>
      </div> */}
      {/* <div>
        <UserCard />
      </div> */}
    </div>
  );
};

const TicketOverview = () => {
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);

  const storedUser = localStorage.getItem("userData");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const [openChat, setOpenChat] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const fetchTickets = async () => {
    try {
      const response = await http.get(`/tickets/user/${parsedUser?.id}`);
      if (response.data.status) {
        const data = response.data.data;
        setTickets(data);
        // Set the first ticket as active by default
        if (data.length > 0) {
          setActiveTab(0);
          setActiveTicket(data[0]);
          localStorage.setItem("activeTicket", JSON.stringify(data[0]));
        }
      }
    } catch (error) {
      console.error("Error fetching tickets", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, []);

  const [open, setOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("userData"));
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  useEffect(() => {
    if (open) {
      const fetchManagers = async () => {
        try {
          const payload = { user_id: user.id };
          setLoadingManagers(true);
          const res = await http.get("/users/managers", {
            params: payload, // <-- pass as query params
          });
          setManagers(res.data.data || []);
        } catch (err) {
          console.error("Error fetching managers:", err);
        } finally {
          setLoadingManagers(false);
        }
      };
      fetchManagers();
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingMessages(true);
      await http.post("/chats", {
        user_id: user.id,
        ticket_id: activeTicket?.id,
        sender: user.id,
        receiver: selectedManager.id,
        message: message,
        date_time: new Date().toISOString().slice(0, 19).replace("T", " "),
      });

      Swal.fire({
        icon: "success",
        title: "Message Sent",
        text: "Your message has been sent successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      setMessage("");
      setSelectedManager(null);
      setOpen(false);
      fetchTickets();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response.data.message ||
          err.response.data.error ||
          "Failed to send message. Please try again.",
      });
      console.error("Error sending message:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleCloseChat = (refresh = false) => {
    setOpenChat(false);
    setSelectedTicketId(null);
    if (refresh) fetchTickets();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 bg-[#FFFFFF] min-h-screen ">
        {/* Left Main Section - 80% */}
        <div className="w-full  bg-[#F9F9F9] rounded-xl shadow-sm ">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
            <h2 className="text-base md:text-[16px] text-[#212529] font-bold">
              Ticket Activity Overview
            </h2>

            {/* Action Buttons */}
            {/* <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 md:mt-0">
              
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#707578] text-white hover:opacity-90 transition">
                <FaFileAlt size={16} />
              </button>

              
              {activeTicket?.response_mode?.toLowerCase() === "chat" && (
                <button
                  onClick={() => setOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#8FCAA1] text-white hover:opacity-90 transition"
                >
                  <FaCommentAlt size={16} />
                </button>
              )}

             
              <div className="flex items-center bg-[#09A7EA] rounded-full overflow-hidden">
                {activeTicket?.response_mode?.toLowerCase() === "video" && (
                  <button className="px-3 py-2 text-white flex items-center hover:bg-[#0c9dd9] transition">
                    <FaVideo size={15} />
                  </button>
                )}
                <div className="w-px bg-white h-5"></div>
                {activeTicket?.response_mode?.toLowerCase() === "call" && (
                  <button className="px-3 py-2 text-white flex items-center hover:bg-[#0c9dd9] transition">
                    <FaPhone size={15} />
                  </button>
                )}
              </div>

             
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0A84FF] hover:bg-[#007AFF] text-white text-[13px] sm:text-[14px] font-medium rounded-full transition-all duration-200 w-full sm:w-auto">
                <FaCamera className="text-[14px]" />
                Take Photo/Upload
              </button>
            </div> */}
          </div>

          {/* Tabs */}
          <div className="border-b border-[#CECECE]/40 py-2 pl-4 flex gap-6  text-sm">
            {tickets.length > 0 ? (
              tickets.map((ticket, index) => (
                <button
                  key={ticket.id}
                  onClick={() => {
                    setActiveTab(index);
                    setActiveTicket(ticket);
                    localStorage.setItem(
                      "activeTicket",
                      JSON.stringify(ticket)
                    );
                  }}
                  className={`md:text-[14px] whitespace-nowrap ${
                    activeTab === index
                      ? "text-[#282D37] font-bold"
                      : "text-[#9D9D9D]"
                  }`}
                >
                  {`Ticket ${index + 1}`}
                </button>
              ))
            ) : (
              <p className="text-gray-400 pl-4 text-sm">No tickets found</p>
            )}
          </div>

          <div className="flex bg-white border-b border-[#CECECE]/40  flex-col md:flex-row justify-between items-start md:items-center p-4">
            <h2 className="text-base md:text-[13px] text-[#212529] font-semibold">
              OEM / Service <br /> Provider Name
            </h2>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 md:mt-0">
              {/* Document Icon */}
              {/* <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#707578] text-white hover:opacity-90 transition">
                <FaFileAlt size={16} />
              </button> */}
              <UploadTicketDoc
                ticketId={activeTicket?.id}
                fetchTickets={fetchTickets}
              />

              {/* Chat Icon */}
              {activeTicket?.response_mode?.toLowerCase() === "chat" && (
                <button
                  // onClick={() => setOpen(true)}
                  onClick={() => {
                    setSelectedTicketId(activeTicket.id);
                    setOpenChat(true);
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#8FCAA1] text-white hover:opacity-90 transition"
                >
                  <FaCommentAlt size={16} />
                </button>
              )}

              <ChatModal
                open={openChat}
                onClose={(refresh) => handleCloseChat(refresh)}
                ticketId={selectedTicketId}
                user={user}
              />

              {/* Video + Call pill */}
              <div className="flex items-center bg-[#09A7EA] rounded-full overflow-hidden">
                {activeTicket?.response_mode?.toLowerCase() === "video" && (
                  <button className="px-3 py-2 text-white flex items-center hover:bg-[#0c9dd9] transition">
                    <FaVideo size={15} />
                  </button>
                )}
                <div className="w-px bg-white h-5"></div>
                {activeTicket?.response_mode?.toLowerCase() === "call" && (
                  <button className="px-3 py-2 text-white flex items-center hover:bg-[#0c9dd9] transition">
                    <FaPhone size={15} />
                  </button>
                )}
              </div>

              {/* Take Photo */}
              {/* <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0A84FF] hover:bg-[#007AFF] text-white text-[13px] sm:text-[14px] font-medium rounded-full transition-all duration-200 w-full sm:w-auto">
                <FaCamera className="text-[14px]" />
                Take Photo/Upload
              </button> */}
              <UploadTicketImage
                ticketId={activeTicket?.id}
                fetchTickets={fetchTickets}
              />
            </div>
          </div>

          {/* Ticket Board */}
          {/* Ticket Board */}
          {loading ? (
            <div className="p-6 text-center text-gray-400">
              <>
                {/* <CircularProgress size={20} color="inherit" /> */}
                <RotatingLines
                  strokeColor="#1E1E1E"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="20"
                  visible={true}
                />
                Loading tickets...
              </>
            </div>
          ) : tickets.length > 0 ? (
            <TicketBoard
              tickets={[tickets[activeTab]]}
              onClick={() => {
                setSelectedTicketId(activeTicket.id);
                setOpenChat(true);
              }}
            />
          ) : (
            <div className="p-6 text-center text-gray-400">
              No tickets available
            </div>
          )}
        </div>
      </div>
      {/* MUI Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {!selectedManager ? (
            <>
              <Typography variant="h6" mb={2}>
                Select a Manager
              </Typography>
              <div className="space-y-2">
                {loadingManagers ? (
                  <div className="flex items-center justify-center">
                    <CircularProgress size={20} color="inherit" />
                  </div>
                ) : (
                  managers.map((manager) => (
                    <div key={manager.id} className="space-y-2">
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setSelectedManager(manager)}
                      >
                        {manager.full_name}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <Typography variant="h6" mb={2}>
                Message to {selectedManager.name}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-3 space-x-2">
                <Button
                  variant="outlined"
                  onClick={() => setSelectedManager(null)}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!message.trim() || loadingMessages}
                >
                  {loadingMessages ? (
                    <>
                      <CircularProgress size={20} color="inherit" /> Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

const UploadTicketImage = ({ ticketId, fetchTickets }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Open file picker (camera or gallery)
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Upload selected file
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("ticket_id", ticketId);
      formData.append("photo", file);

      const res = await http.post("/ticket-images/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (fetchTickets) await fetchTickets();

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleButtonClick}
        disabled={loading}
        className={`flex items-center justify-center gap-2 px-4 py-2 bg-[#0A84FF] hover:bg-[#007AFF] text-white text-[13px] sm:text-[14px] font-medium rounded-full transition-all duration-200 w-full sm:w-auto ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        <FaCamera className="text-[14px]" />
        {loading ? "Uploading..." : "Take Photo / Upload"}
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        capture="environment" // opens camera on mobile
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

const UploadTicketDoc = ({ ticketId, fetchTickets }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Trigger hidden file input
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("ticket_id", ticketId);
      formData.append("upload_documents", file);

      // Post to Laravel API
      await http.post("/ticket-docs/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (fetchTickets) await fetchTickets();
      toast.success("📄 Document uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleButtonClick}
        disabled={loading}
        className={`w-9 h-9 flex items-center justify-center rounded-full bg-[#707578] text-white hover:opacity-90 transition ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        <FaFileAlt size={16} />
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv" // document formats
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
const TicketBoard = ({ tickets = [], onClick }) => {
  const ticket = tickets[0];
  if (!ticket) return null;
  console.log("ticket:-", ticket);
  // const [pictureTicket, setPictureTicket] = useState(null);

  // Sync pictureTicket with ticket prop on mount or when ticket changes
  // useEffect(() => {
  //   if (ticket?.pic_status === 1 && ticket?.photo) {
  //     setPictureTicket(ticket);
  //   } else {
  //     setPictureTicket(null);
  //   }
  // }, [ticket]);

  // const handleDragStart = (e, t) => {
  //   e.dataTransfer.setData("ticketId", t.id);
  // };

  // const handleDragOver = (e) => e.preventDefault();

  // const handleDrop = async (e) => {
  //   e.preventDefault();
  //   if (ticket?.pic_status === 0 && ticket?.photo) {
  //     try {
  //       // Call API to update pic_status
  //       await http.post(`/tickets/update-pic-status/${ticket.id}/1`);

  //       // Update pictureTicket state
  //       setPictureTicket({ ...ticket, pic_status: 1 });
  //     } catch (error) {
  //       console.error(
  //         "Error updating pic_status",
  //         error.response?.data || error.message
  //       );
  //     }
  //   }
  // };

  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return "N/A";
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return created.toLocaleDateString();
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* New Column */}
        <div className="md:border-r md:min-h-screen md:border-[#CECECE]/40 px-4">
          <h3 className="font-bold text-[#282D37] md:text-xs mb-2 mt-2">New</h3>

          {/* Static Title & Description */}
          {/* <div className="bg-white rounded-[10px] shadow p-4 mb-3">
            <h4 className="font-semibold text-xs">
              Ticket Created to {ticket?.manufacturer || "N/A"}
            </h4>
            <p className="text-xs text-gray-500">{ticket?.description}</p>
          </div> */}
          <div className="h-[100vh] overflow-y-auto custom-scroll">
            <div className="bg-white rounded-[10px] shadow p-4 mb-3 w-full">
              {/* Title */}
              <h4 className="font-semibold text-[13px] text-[#212529] mb-1">
                Ticket Created to {ticket?.manufacturer || "N/A"}
              </h4>

              {/* Description */}
              <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
                {ticket?.description || "No description available."}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-[12px] text-gray-500">
                <div className="flex items-center gap-0.5">
                  <img
                    src="/clock.png"
                    alt=""
                    className="w-[13px] h-[13px] object-cover"
                  />
                  <span>{getTimeAgo(ticket?.created_at)}</span>
                </div>

                {/* Priority Badge */}
                <div className="flex gap-0.5 items-center">
                  <img
                    src="/priority.png"
                    alt=""
                    className="w-[13px] h-[13px] object-cover"
                  />
                  <span
                    className={`text-[11px] px-2 py-[2px] rounded-md font-medium capitalize ${
                      ticket?.priority?.toLowerCase() === "high"
                        ? "bg-red-100 text-red-600"
                        : ticket?.priority?.toLowerCase() === "medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : ticket?.priority?.toLowerCase() === "low"
                        ? "bg-cyan-100 text-cyan-600"
                        : ticket?.priority?.toLowerCase() === "critical"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {ticket?.priority || "N/A"}
                  </span>
                </div>

                {/* Profile Avatar */}
                <img
                  src={ticket?.user?.company?.profile_pic || "/person.jpg"}
                  alt="User"
                  className="w-6 h-6 rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Draggable Photo */}
          {/* {ticket?.pic_status === 0 && ticket?.photo && !pictureTicket && (
            <img
              src={`${baseURL}/${ticket.photo}`}
              alt="ticket"
              className="mt-2 w-full h-20 object-contain rounded cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, ticket)}
            />
          )} */}
        </div>

        <div className="border-r border-[#CECECE]/40 px-4 pl-4 md:pl-0">
          <>
            <h3 className="font-bold text-[#282D37] md:text-xs mb-2 mt-2">
              Documents
            </h3>
            <div className="h-[100vh] overflow-y-auto custom-scroll">
              {/* basic info */}
              <div className="bg-white rounded-[10px] shadow p-4 mb-3 w-full">
                {/* Title */}
                <h4 className="font-semibold text-[13px] text-[#212529] mb-1">
                  Basic Information
                </h4>
                <p className="text-[12px] text-gray-500 line-clamp-2">
                  Plant Name: {ticket?.plant_name || "N/A"}
                </p>
                {/* Description */}
                <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
                  Category: {ticket?.category || "N/A"}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-[12px] text-gray-500">
                  <div className="flex items-center gap-0.5">
                    <img
                      src="/clock.png"
                      alt=""
                      className="w-[13px] h-[13px] object-cover"
                    />
                    <span>{getTimeAgo(ticket?.created_at)}</span>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex gap-0.5 items-center">
                    <img
                      src="/priority.png"
                      alt=""
                      className="w-[13px] h-[13px] object-cover"
                    />
                    <span
                      className={`text-[11px] px-2 py-[2px] rounded-md font-medium capitalize ${
                        ticket?.priority?.toLowerCase() === "high"
                          ? "bg-red-100 text-red-600"
                          : ticket?.priority?.toLowerCase() === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : ticket?.priority?.toLowerCase() === "low"
                          ? "bg-cyan-100 text-cyan-600"
                          : ticket?.priority?.toLowerCase() === "critical"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {ticket?.priority || "N/A"}
                    </span>
                  </div>

                  {/* Profile Avatar */}
                  <img
                    src={ticket?.user?.company?.profile_pic || "/person.jpg"}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </div>
              </div>
              {/* equipment info */}
              <div className="bg-white rounded-[10px] shadow p-4 mb-3 w-full">
                {/* Title */}
                <h4 className="font-semibold text-[13px] text-[#212529] mb-1">
                  Equipment Info
                </h4>
                <p className="text-[12px] text-gray-500 line-clamp-2">
                  Equipment: {ticket?.equipment || "N/A"}
                </p>
                {/* Description */}
                <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
                  Model :{ticket?.model_number || "N/A"}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-[12px] text-gray-500">
                  <div className="flex items-center gap-0.5">
                    <img
                      src="/clock.png"
                      alt=""
                      className="w-[13px] h-[13px] object-cover"
                    />
                    <span>{getTimeAgo(ticket?.created_at)}</span>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex gap-0.5 items-center">
                    <img
                      src="/priority.png"
                      alt=""
                      className="w-[13px] h-[13px] object-cover"
                    />
                    <span
                      className={`text-[11px] px-2 py-[2px] rounded-md font-medium capitalize ${
                        ticket?.priority?.toLowerCase() === "high"
                          ? "bg-red-100 text-red-600"
                          : ticket?.priority?.toLowerCase() === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : ticket?.priority?.toLowerCase() === "low"
                          ? "bg-cyan-100 text-cyan-600"
                          : ticket?.priority?.toLowerCase() === "critical"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {ticket?.priority || "N/A"}
                    </span>
                  </div>

                  {/* Profile Avatar */}
                  <img
                    src={ticket?.user?.company?.profile_pic || "/person.jpg"}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </div>
              </div>

              {/* service info */}
              <div className="bg-white rounded-[10px] shadow p-4 mb-3 w-full">
                {/* Title */}
                <h4 className="font-semibold text-[13px] text-[#212529] mb-1">
                  Service Information
                </h4>
                <p className="text-[12px] text-gray-500  line-clamp-2">
                  Provider: {ticket?.service_provider || "N/A"}
                </p>
                {/* Description */}
                <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
                  Manufacturer :{ticket?.manufacturer || "N/A"}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-[12px] text-gray-500">
                  <div className="flex items-center gap-0.5">
                    <img
                      src="/clock.png"
                      alt=""
                      className="w-[13px] h-[13px] object-cover"
                    />
                    <span>{getTimeAgo(ticket?.created_at)}</span>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex gap-0.5 items-center">
                    <img
                      src="/priority.png"
                      alt=""
                      className="w-[13px] h-[13px] object-cover"
                    />
                    <span
                      className={`text-[11px] px-2 py-[2px] rounded-md font-medium capitalize ${
                        ticket?.priority?.toLowerCase() === "high"
                          ? "bg-red-100 text-red-600"
                          : ticket?.priority?.toLowerCase() === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : ticket?.priority?.toLowerCase() === "low"
                          ? "bg-cyan-100 text-cyan-600"
                          : ticket?.priority?.toLowerCase() === "critical"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {ticket?.priority || "N/A"}
                    </span>
                  </div>

                  {/* Profile Avatar */}
                  <img
                    src={ticket?.user?.company?.profile_pic || "/person.jpg"}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </div>
              </div>

              {/* support info */}
              <div className="bg-white rounded-[10px] shadow p-4 mb-3 w-full">
                {/* Title */}
                <h4 className="font-semibold text-[13px] text-[#212529] mb-1">
                  Support
                </h4>
                <p className="text-[12px] text-gray-500  line-clamp-2">
                  Installation Support:{" "}
                  {ticket?.need_product_installation_support
                    ? ticket.need_product_installation_support
                        .charAt(0)
                        .toUpperCase() +
                      ticket.need_product_installation_support.slice(1)
                    : "N/A"}
                </p>
                {/* Description */}
                <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
                  Implementation Support :
                  {ticket?.need_service_implementation_support
                    ? ticket.need_service_implementation_support
                        .charAt(0)
                        .toUpperCase() +
                      ticket.need_service_implementation_support.slice(1)
                    : "N/A"}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-[12px] text-gray-500">
                  <div className="flex items-center gap-0.5">
                    <img
                      src="/clock.png"
                      alt=""
                      className="w-[13px] h-[13px] object-cover"
                    />
                    <span>{getTimeAgo(ticket?.created_at)}</span>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex gap-0.5 items-center">
                    <img
                      src="/priority.png"
                      alt=""
                      className="w-[13px] h-[13px] object-cover"
                    />
                    <span
                      className={`text-[11px] px-2 py-[2px] rounded-md font-medium capitalize ${
                        ticket?.priority?.toLowerCase() === "high"
                          ? "bg-red-100 text-red-600"
                          : ticket?.priority?.toLowerCase() === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : ticket?.priority?.toLowerCase() === "low"
                          ? "bg-cyan-100 text-cyan-600"
                          : ticket?.priority?.toLowerCase() === "critical"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {ticket?.priority || "N/A"}
                    </span>
                  </div>

                  {/* Profile Avatar */}
                  <img
                    src={ticket?.user?.company?.profile_pic || "/person.jpg"}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </div>
              </div>

              <div>
                {ticket?.documents && ticket?.documents.length > 0 ? (
                  ticket?.documents.map((doc, i) => {
                    const documentUrl = `${baseURL}/${doc.upload_documents}`;
                    return (
                      <div
                        key={i}
                        className="bg-white rounded-xl mb-3 shadow p-4 min-h-20 flex flex-col"
                      >
                        <button
                          onClick={() => {
                            setSelectedDocument(documentUrl);
                            setShowPreview(true);
                          }}
                          className="text-blue-600 underline mb-4 text-sm truncate"
                        >
                          {doc.upload_documents.split("/").pop()}
                        </button>
                        <div className="flex items-center justify-between text-[12px] text-gray-500">
                          <div className="flex items-center gap-0.5">
                            <img
                              src="/clock.png"
                              alt=""
                              className="w-[13px] h-[13px] object-cover"
                            />
                            <span>{getTimeAgo(ticket?.created_at)}</span>
                          </div>

                          {/* Profile Avatar */}
                          <img
                            src={
                              ticket?.user?.company?.profile_pic ||
                              "/person.jpg"
                            }
                            alt="User"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-sm">No document uploaded</p>
                )}
              </div>
            </div>
            {/* Popup Modal */}
            {showPreview && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-white w-[90%] md:w-[70%] h-[80vh] rounded-xl shadow-lg relative">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="absolute top-1 right-2 text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>

                  <iframe
                    src={selectedDocument}
                    title="Document Preview"
                    className="w-full h-full rounded-b-xl"
                  />
                </div>
              </div>
            )}
          </>
        </div>

        {/* Calling Column */}
        <div className="border-[#CECECE]/40 border-r pr-4 pl-4 md:pl-0">
          <h3 className="font-bold text-[#282D37] md:text-xs mb-2 mt-2">
            {/* {ticket?.response_mode?.toLowerCase() === "chat" && "Chat"}
            {ticket?.response_mode?.toLowerCase() === "video" && "Video Call"}
            {!ticket?.response_mode && "Calling"} */}
            Communication
          </h3>
          {/* <div className="bg-white rounded-xl shadow p-6 h-20"></div> */}
          <div className="h-[100vh] overflow-y-auto custom-scroll">
            {ticket?.chats?.map((chat) => (
              <div
                key={chat.id}
                className="bg-white rounded-[10px] shadow p-4 mb-3 w-full"
                onClick={onClick}
              >
                {/* Title */}
                <h4 className="font-semibold flex items-center gap-1 text-[13px] text-[#212529] mb-1">
                  <img
                    src="/chaticon.png"
                    alt=""
                    className="w-[11px] h-[11px]"
                  />
                  Chat
                </h4>
                <p className="text-[12px] text-gray-500 mb-2 line-clamp-2">
                  <p className="text-gray-700">{chat?.message}</p>
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-[12px] text-gray-500">
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <img
                      src="/calender.png"
                      alt=""
                      className="w-[11px] h-[11px]"
                    />
                    <span className="text-[12px] text-gray-500">
                      {new Date(chat.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Profile Avatar */}
                  <img
                    src={
                      chat?.sender_user?.company?.profile_pic || "/person.jpg"
                    }
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pictures Column */}
        <div className="pr-4 pl-4 md:pl-0 mb-2">
          <h3 className="font-bold text-[#282D37] md:text-xs mb-2 mt-2">
            Pictures
          </h3>
          {/* <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="min-h-[200px] bg-white rounded-xl shadow p-4 flex items-center justify-center"
          >
            {pictureTicket && pictureTicket.photo ? (
              <img
                src={`${baseURL}/${pictureTicket.photo}`}
                alt="dropped"
                className="w-20 h-20 object-cover rounded"
              />
            ) : (
              <p className="text-gray-400 text-xs">Drag photos here</p>
            )}
          </div> */}
          <div className="h-[100vh] overflow-y-auto custom-scroll">
            {ticket.images && ticket.images.length > 0 ? (
              ticket.images.map((img, i) => (
                <>
                  <div
                    key={i}
                    className="min-h-[110px] bg-white rounded-xl shadow p-4 mb-2 flex flex-col"
                  >
                    <div className="flex items-center justify-center">
                      <img
                        src={`${baseURL}/${img.photo}`}
                        alt={`ticket-${i}`}
                        className="w-20 h-20 mb-2 object-cover rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[12px] text-gray-500">
                      <div className="flex items-center gap-0.5">
                        <img
                          src="/clock.png"
                          alt=""
                          className="w-[13px] h-[13px] object-cover"
                        />
                        <span>{getTimeAgo(img?.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <img
                          src="/calender.png"
                          alt=""
                          className="w-[11px] h-[11px]"
                        />
                        <span className="text-[12px] text-gray-500">
                          {new Date(img.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                            }
                          )}
                        </span>
                      </div>

                      {/* Profile Avatar */}
                      <img
                        src={
                          ticket?.user?.company?.profile_pic || "/person.jpg"
                        }
                        alt="User"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    </div>
                  </div>
                </>
              ))
            ) : (
              <p className="text-gray-400">No image available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatModal = ({ open, onClose, ticketId, user }) => {
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch chats when modal opens and ticketId changes
  useEffect(() => {
    if (open && ticketId) {
      handleViewChats(ticketId);
    }
  }, [open, ticketId]);

  const handleViewChats = async (id) => {
    try {
      setLoadingChats(true);
      const res = await http.get(`/chats/ticket/${id}`);
      if (res.data.status) {
        setChats(res.data.data);
        console.log("respose data:-", res.data.data);
      } else {
        setChats([]);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
      setChats([]);
    } finally {
      setLoadingChats(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      if (!message.trim()) return;
      await http.post("/chats", {
        user_id: user.id,
        ticket_id: ticketId,
        sender: user.id,
        receiver: null,
        message: message,
        date_time: new Date().toISOString().slice(0, 19).replace("T", " "),
      });

      // Swal.fire({
      //   icon: "success",
      //   title: "Message Sent",
      //   text: "Your message has been sent successfully.",
      //   timer: 2000,
      //   showConfirmButton: false,
      // });
      setMessage("");
      handleViewChats(ticketId);
    } catch (err) {
      // Swal.fire({
      //   icon: "error",
      //   title: "Error",
      //   text:
      //     err.response.data.message ||
      //     err.response.data.error ||
      //     "Failed to send message. Please try again.",
      // });
      console.error("Error sending message:", err);
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#fff",
          borderRadius: 4,
          width: 500,
          maxWidth: "95%",
          boxShadow: 24,
          outline: "none",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2 className="text-[16px] font-semibold m-0">Communication</h2>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <IconButton color="primary" size="small">
              <Videocam />
            </IconButton>
            <IconButton color="primary" size="small">
              <Call />
            </IconButton> */}
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </Box>

        {/* Chat Body */}
        <Box
          sx={{
            backgroundColor: "#F5F7FB",
            maxHeight: "450px",
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {loadingChats ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={30} />
            </Box>
          ) : chats.length > 0 ? (
            chats.map((chat) => {
              const isSender = chat.sender === user.id;
              const senderName = chat.sender_user?.full_name || "Unknown";
              return (
                <Box
                  key={chat.id}
                  sx={{
                    display: "flex",
                    justifyContent: isSender ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: 1,
                  }}
                >
                  {!isSender && (
                    <Avatar
                      src={chat.sender_user?.company?.profile_pic} // Set a default image URL if the profile_pic is null.}
                      sx={{ width: 30, height: 30 }}
                    />
                  )}
                  <Box
                    sx={{
                      maxWidth: "70%",
                      bgcolor: isSender ? "#1976d2" : "#E5E7EB",
                      color: isSender ? "#fff" : "#111827",
                      borderRadius: 2,
                      borderBottomRightRadius: isSender ? 0 : 8,
                      borderBottomLeftRadius: !isSender ? 0 : 8,
                      p: 1.5,

                      // ✅ Add these 3 lines:
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <Box sx={{ fontSize: 12, fontWeight: 500, mb: 0.5 }}>
                      {isSender ? "You" : senderName}
                    </Box>
                    <Box sx={{ fontSize: 14 }}>{chat.message}</Box>
                    <Box
                      sx={{
                        fontSize: 11,
                        textAlign: "right",
                        color: isSender ? "#d1d5db" : "#6b7280",
                        mt: 0.5,
                      }}
                    >
                      {new Date(chat.date_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Box>
                  </Box>
                  {isSender && (
                    <Avatar
                      src={chat.sender_user?.company?.profile_pic}
                      sx={{ width: 30, height: 30 }}
                    />
                  )}
                </Box>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4 m-0">
              No chats found.
            </p>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: "#F5F7FB",

            p: 2,
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              position: "relative",
              bgcolor: "#fff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              px: 1.5,
              py: 0.5,
              boxShadow: "0 0 2px rgba(0,0,0,0.1)",
            }}
          >
            <input
              type="text"
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "14px",
                background: "transparent",
              }}
            />
            <IconButton
              onClick={handleSend}
              size="small"
              sx={{
                bgcolor: "#D1F2E5",
                color: "#1E8E5F",
                p: "6px",
                borderRadius: "8px",
                "&:hover": { bgcolor: "#BFF0D8" },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{ width: 18, height: 18 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75l16.5 7.5-16.5 7.5L7.5 12l-3.75-8.25z"
                />
              </svg>
            </IconButton>
          </Box>
        </Box>
        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            p: 2,
            borderTop: "1px solid #e5e7eb",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "10px",

              px: 3,
              bgcolor: "#007bff",
              "&:hover": { bgcolor: "#006ae6" },
            }}
            onClick={onClose}
          >
            Add Card
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
