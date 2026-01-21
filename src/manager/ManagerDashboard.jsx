import React, { useEffect, useState } from "react";

import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { FaSignOutAlt } from "react-icons/fa";
import ManagerSidebar from "./utils/ManagerSidebar";
import ManagerHeader from "./utils/ManagerHeader";
import CommunicationPage from "../pages/CommunicationPage";
import NotificationsPage from "../pages/NotificationsPage";
import TicketCreation from "../pages/TicketCreation";
import PlantProfile from "../pages/PlantProfile";
import TicketDetails from "../pages/TicketDetails";
import ManagerDashboardPage from "./pages/ManagerDashboardPage";
import TicketTable from "../pages/TicketTable";
import ManagerTicketTable from "./pages/ManagerTicketTable";
import ManagerCommunicationPage from "./pages/ManagerCommunicationPage";
import http from "../service/http";
import { CircularProgress } from "@mui/material";
import ManagerNotifications from "./pages/ManagerNotifications";
import ManagerProfile from "./pages/ManagerProfile";
import ManagerTicketListUpStages from "./pages/ManagerTicketListUpStages";
import { RotatingLines } from "react-loader-spinner";
import ManagerUsers from "./pages/ManagerUsers";
import CreateUsers from "./pages/CreateUsers";
import ManagerTicketDetails from "./pages/ManagerTicketDetails";
import { Create } from "@mui/icons-material";
import CreateProduct from "./pages/CreateProduct";
import ManageProducts from "./pages/ManageProducts";
import EditProduct from "./pages/EditProduct";

const UserCard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  if (!userData)
    return (
      <>
        <div>
          <CircularProgress size={20} color="inherit" />
          Loading...
        </div>
      </>
    );

  return (
    <div className="bg-[#F9F9F9] rounded-2xl shadow p-4 w-full mx-auto mb-6 flex flex-col items-center">
      <p className="text-sm text-[#212529] text-[16px] font-bold mb-4 self-start">
        {userData.company?.designation || "N/A"}
      </p>

      <img
        src={userData.company?.profile_pic || "/person.jpg"}
        alt="user"
        className="w-16 h-16 rounded-full mb-2 object-cover"
      />

      <p className="text-sm text-[16px] font-bold text-[#212529]">
        {userData.full_name || "User not available"}
      </p>

      <p className="text-sm text-[#666] text-[14px] mt-1">
        {userData.company?.company_name || "Company name not available"}
      </p>

      {/* <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        className="mt-10 px-4 py-2 bg-[#D9D9D9]/20 rounded-[30px] flex items-center text-[16px] font-semibold justify-center gap-2 text-[#212529] hover:bg-gray-200 transition text-sm"
      >
        <FaSignOutAlt className="text-gray-600" /> Logout
      </button> */}
      <button
        onClick={() => {
          setLoading(true);
          localStorage.clear();
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }}
        disabled={loading}
        className="mt-10 px-4 py-2 bg-[#D9D9D9]/20 rounded-[30px] flex items-center justify-center gap-2 text-[16px] font-semibold text-[#212529] hover:bg-gray-200 transition text-sm h-[44px]" // 👈 fixed height added
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <div className="flex items-center justify-center w-[20px] h-[20px]">
                <RotatingLines
                  strokeColor="#1E1E1E"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="20"
                  visible={true}
                />
              </div>
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <FaSignOutAlt className="text-gray-600" />
              <span>Logout</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};

const ManagerDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("Dashboard");
  const user = JSON.parse(localStorage.getItem("userData"));
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("create-ticket")) setTitle("Create Ticket");
    else if (path.includes("tickets")) setTitle("My Tickets");
    else if (path.includes("communication")) setTitle("Communication");
    else if (path.includes("notifications")) setTitle("Notifications");
    else if (path.includes("profile")) setTitle("Profile");
    else if (path.includes("ticket-details")) setTitle("Tickets Details");
    else if (path.includes("ticket-stages")) setTitle("Ticket Stages");
    else if (path.includes("users-list")) setTitle("Users");
    else if (path.includes("add-users")) setTitle("Add Users");
    else if (path.includes("manage-products")) setTitle("Manage Products");
    else if (path.includes("add-products")) setTitle("Create Product");
    else if (path.includes("edit-products")) setTitle("Edit Product");
    else setTitle("Dashboard");
  }, [location]);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await http.get(`/chats`);
        console.log("responisve:-", response.data);
        setMessages(response.data.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="flex h-screen bg-[#FFFFFF] overflow-hidden">
      {/* Sidebar Drawer */}
      <ManagerSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 flex flex-col">
        <ManagerHeader title={title} setIsOpen={setIsOpen} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Main Content (80%) */}
            <div className="w-full lg:w-[80%]">
              <Routes>
                <Route path="/" element={<Navigate to="home" replace />} />
                <Route path="home" element={<ManagerDashboardPage />} />
                <Route path="tickets" element={<ManagerTicketTable />} />
                <Route
                  path="communication"
                  element={<ManagerCommunicationPage />}
                />
                <Route
                  path="notifications"
                  element={<ManagerNotifications />}
                />

                <Route path="create-ticket" element={<TicketCreation />} />
                <Route path="profile" element={<ManagerProfile />} />
                <Route path="ticket-details/:id" element={<TicketDetails />} />
                <Route
                  path="ticket/ticket-details/:id"
                  element={<ManagerTicketDetails />}
                />

                <Route
                  path="ticket-stages"
                  element={<ManagerTicketListUpStages />}
                />
                <Route path="users-list" element={<ManagerUsers />} />
                <Route path="add-users" element={<CreateUsers />} />
                <Route path="add-products" element={<CreateProduct />} />
                <Route path="manage-products" element={<ManageProducts />} />
                <Route path="edit-products/:id" element={<EditProduct />} />

                <Route path="*" element={<Navigate to="home" replace />} />
              </Routes>
            </div>

            {/* Right: User Info & Messages (20%) */}
            <div className="w-full lg:w-[20%] space-y-6">
              <UserCard />
              {/* <div className="bg-[#F9F9F9] rounded-xl shadow-sm p-4">
                <h4 className="font-semibold text-[#212529] mb-3">
                  Recent Messages
                </h4>
               
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      
                      <RotatingLines
                        strokeColor="#1E1E1E"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="20"
                        visible={true}
                      />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-gray-500">No messages</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="bg-white rounded-lg p-3 shadow-sm text-sm text-[#333]"
                      >
                        <p>{msg.ticket.ticket_number}</p>
                        <div className="flex items-center gap-2 mb-1">
                          <img src="/sany.png" alt="icon" className="w-4 h-4" />
                          <span className="font-semibold text-[#D8232A]">
                            {msg.sender_user.full_name}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#555] mb-2 leading-snug">
                          {msg.message}
                        </p>
                        <div className="flex justify-between text-[11px] text-[#9D9D9D]">
                          <span>
                            {new Date(msg.date_time).toLocaleTimeString()}
                          </span>
                          
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
