import React, { useEffect, useState } from "react";

import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { FaSignOutAlt } from "react-icons/fa";

import { CircularProgress } from "@mui/material";

import { RotatingLines } from "react-loader-spinner";

import PlantSidebar from "../utility/PlantSidebar";
import PlantHeader from "../utility/PlantHeader";
import PlantDashboardPage from "./PlantDashboardPage";
import PlantTicketTable from "./PlantTicketTable";
import PlantCommunicationPage from "./PlantCommunicationPage";
import PlantNotifications from "./PlantNotifications";
import PlantSupervisorProfile from "./PlantSupervisorProfile";
import PlantTicketDetails from "./PlantTicketDetails";
import PlantUsers from "./PlantUsers";
import PlantCreateUsers from "./PlantCreateUsers";
import http from "../../service/http";
import PlantTicketTableApproved from "./PlantTicketTableApproved";
import ProductList from "./ProductList";
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";
import ChangePasswordCard from "../../utils/ChangePasswordCard";

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

      <button
        onClick={() => {
          setLoading(true);
          localStorage.clear();
          setTimeout(() => {
            navigate("/login");
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

const PlantDashboard = () => {
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
    else if (path.includes("ticket-details")) setTitle("My Tickets");
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
      <PlantSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PlantHeader title={title} setIsOpen={setIsOpen} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Main Content (80%) */}
            <div
              className={`w-full ${location.pathname.includes("profile") && "lg:w-[75%]"}`}
            >
              <Routes>
                <Route path="/" element={<Navigate to="home" replace />} />
                <Route path="home" element={<PlantDashboardPage />} />
                <Route path="tickets" element={<PlantTicketTable />} />
                <Route
                  path="tickets-approved"
                  element={<PlantTicketTableApproved />}
                />

                <Route
                  path="communication"
                  element={<PlantCommunicationPage />}
                />
                <Route path="notifications" element={<PlantNotifications />} />

                {/* <Route path="create-ticket" element={<TicketCreation />} /> */}
                <Route path="profile" element={<PlantSupervisorProfile />} />
                <Route
                  path="ticket-details/:id"
                  element={<PlantTicketDetails />}
                />

                <Route path="users-list" element={<PlantUsers />} />
                <Route path="add-users" element={<PlantCreateUsers />} />

                <Route path="plant-products" element={<ProductList />} />
                <Route path="add-products" element={<CreateProduct />} />
                <Route path="edit-products/:id" element={<EditProduct />} />

                <Route path="*" element={<Navigate to="home" replace />} />
              </Routes>
            </div>

            {/* Right: User Info & Messages (20%) */}
            {location.pathname.includes("profile") && (
              <div className="w-full lg:w-[25%] space-y-6">
                {/* <UserCard /> */}
                {location.pathname.includes("profile") && (
                  <ChangePasswordCard />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlantDashboard;
