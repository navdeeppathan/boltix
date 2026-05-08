import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import DashboardPage from "./DashboardPage";
import CommunicationPage from "./CommunicationPage";
import NotificationsPage from "./NotificationsPage";

import TicketCreation from "./TicketCreation";
import TicketTable from "./TicketTable";
import { FaSignOutAlt } from "react-icons/fa";
import PlantProfile from "./PlantProfile";
import TicketDetails from "./TicketDetails";
import http from "../service/http";
import { CircularProgress } from "@mui/material";
import { RotatingLines } from "react-loader-spinner";
import { Pending } from "@mui/icons-material";
import PendingApproval from "./PendingApproval";
import PendingTicketTable from "./PendingTicketTable";
import ClosedTicketTable from "./ClosedTicketTable";
import ReturnedTicketTable from "./ReturnedTicketTable";
import RejectedTicketTable from "./RejectedTicketTable";
import EditTicket from "./EditTicket";
import ApprovedTicketTable from "./ApprovedTicketTable";
import ChangePasswordCard from "../utils/ChangePasswordCard";
import ProductList from "./ProductList";
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";

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

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="bg-[#e9e9e9] rounded-2xl shadow p-4 w-full mx-auto mb-6 flex flex-col items-center">
      <p className="text-sm text-[#212529] text-[16px] font-bold mb-4 self-start">
        {userData.company?.designation || "N/A"}
      </p>

      <img
        src={userData.company?.profile_pic || "/person.jpg"}
        alt="user"
        className="w-16 h-16 rounded-full mb-2 object-cover"
      />

      <p className="text-sm text-[16px] font-bold text-[#212529]">
        {userData.full_name || userData.company?.contact_name || "N/A"}
      </p>

      <p className="text-sm text-[#666] text-[14px] mt-1">
        {userData.company?.company_name || "Company name not available"}
      </p>

      <button
        onClick={async () => {
          await http.post("/users/signout", {
            user_id: userData?.id,
          });
          setLoading(true);
          localStorage.clear();

          navigate("/login");
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

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("Dashboard");
  const user = JSON.parse(localStorage.getItem("userData"));
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("create-ticket")) setTitle("Create Ticket");
    else if (path.includes("tickets")) setTitle("Tickets");
    else if (path.includes("communication")) setTitle("Communication");
    else if (path.includes("notifications")) setTitle("Notifications");
    else if (path.includes("profile")) setTitle("Profile");
    else if (path.includes("ticket-details")) setTitle("Ticket Details");
    else if (path.includes("pending-approval")) setTitle("Pending Approval");
    else setTitle("Dashboard");
  }, [location]);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await http.get(`/chats/receiver/${user.id}`);
  //       console.log("responisve:-", response.data);
  //       setMessages(response.data.data || []);
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchMessages();
  // }, []);

  const [ticket, setTicket] = useState(() =>
    JSON.parse(localStorage.getItem("activeTicket")),
  );

  const prevTicketId = useRef(ticket?.id);

  useEffect(() => {
    const fetchChats = async (ticketId) => {
      if (!ticketId) return;
      setLoading(true);
      try {
        const res = await http.get(`/chats/ticket/${ticketId}`);
        setMessages(res.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchChats(ticket?.id);

    // Set up interval to check localStorage
    const interval = setInterval(() => {
      const currentTicket = JSON.parse(localStorage.getItem("activeTicket"));
      if (currentTicket?.id !== prevTicketId.current) {
        prevTicketId.current = currentTicket?.id;
        setTicket(currentTicket);
        fetchChats(currentTicket?.id);
      }
    }, 500); // check every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-[#FFFFFF] overflow-hidden">
      {/* Sidebar Drawer */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} setIsOpen={setIsOpen} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Main Content (80%) */}
            <div
              className={`w-full ${location.pathname.includes("profile") && "lg:w-[75%]"}`}
            >
              <Routes>
                <Route path="/" element={<Navigate to="home" replace />} />
                <Route path="home" element={<DashboardPage />} />
                <Route path="tickets" element={<TicketTable />} />
                <Route path="communication" element={<CommunicationPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="edit/:id" element={<EditTicket />} />
                <Route path="create-ticket" element={<TicketCreation />} />
                <Route path="plant-profile" element={<PlantProfile />} />
                <Route path="ticket-details/:id" element={<TicketDetails />} />
                <Route path="pending-approval" element={<PendingApproval />} />
                <Route path="closed-tickets" element={<ClosedTicketTable />} />
                <Route
                  path="approved-tickets"
                  element={<ApprovedTicketTable />}
                />

                <Route
                  path="returned-tickets"
                  element={<ReturnedTicketTable />}
                />
                <Route
                  path="rejected-tickets"
                  element={<RejectedTicketTable />}
                />

                <Route
                  path="pending-tickets"
                  element={<PendingTicketTable />}
                />

                <Route path="manage-products" element={<ProductList />} />
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

export default Dashboard;
