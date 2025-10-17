// Header.jsx
import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import CreateTicketModal from "../auth/CreateTicketModal";
import { useNavigate } from "react-router-dom";
import http from "../service/http";

const Header = ({ setIsOpen, title }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="flex justify-between items-center mb-6 p-4 shadow  bg-white sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-200"
          onClick={() => setIsOpen(true)}
        >
          <FaBars className="text-xl" />
        </button>
        <h2 className="text-2xl text-[#212529] md:text-[24px] font-semibold">
          {title}
        </h2>
      </div>
      <div className="flex gap-2 items-center flex-wrap justify-end">
        {/* <button className="px-3 py-2 text-[#212529] md:text-[16px]  font-medium rounded-lg text-sm">
          Notifications
        </button> */}
        <NotificationsButton />
        <button
          onClick={() => navigate("/dashboard/plant-profile")}
          className=" px-3 text-[#212529] md:text-[16px]  font-medium  py-2 rounded-lg text-sm"
        >
          Profile
        </button>
        <button
          // onClick={handleOpen}
          onClick={() => navigate("/dashboard/create-ticket")}
          className="bg-[#0088FF] md:w-[126px] md:h-[35px]  md:text-[16px]  font-medium  text-[#FFFFFF] px-3 py-2 md:px-0 md:py-0 rounded-lg text-sm"
        >
          Create Ticket
        </button>
        <CreateTicketModal open={open} handleClose={handleClose} />
      </div>
    </div>
  );
};

const NotificationsButton = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await http.get(`/notifications/user/${user.id}`);
        console.log("response:-", response.data);
        setNotifications(response.data.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Check if there are any notifications (you can filter unread here if needed)
  const hasNotifications = notifications.length > 0;

  return (
    <button
      onClick={() => navigate("/dashboard/notifications")}
      className="relative px-3 py-2 text-[#212529] md:text-[16px] hover:text-[#0088FF] font-medium rounded-lg text-sm"
    >
      Notifications
      {hasNotifications && (
        <span className="absolute top-1 right-1 block w-2 h-2 rounded-full bg-orange-500" />
      )}
    </button>
  );
};

export default Header;
