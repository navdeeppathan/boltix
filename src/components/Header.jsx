// Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaBell } from "react-icons/fa";
import CreateTicketModal from "../auth/CreateTicketModal";
import { useNavigate } from "react-router-dom";
import http from "../service/http";
import { toast } from "react-toastify";

import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Header = ({ setIsOpen, title }) => {
  const location = useLocation();
  const id = location.pathname.split("/").pop();

  // check if user is on ticket details page
  const isTicketDetailsPage = location.pathname.includes(
    "/dashboard/ticket-details",
  );

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleSubmitToOEM = async () => {
    try {
      setLoadingSubmit(true);

      await http.post(`/tickets/update-isSubmit/${id}`, {
        isSubmit: 1,
      });

      Swal.fire({
        icon: "success",
        title: "Submitted",
        text: "Ticket submitted to OEM successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response.data.message ||
          error.response.data.error ||
          "Failed to submit ticket to OEM.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketStage, setTicketStage] = useState(null);

  useEffect(() => {
    if (!isTicketDetailsPage) return;

    const fetchTicketStatus = async () => {
      try {
        const response = await http.get(`/tickets/${id}`);
        const ticket = response.data.data;

        if (ticket?.isSubmit == 1) {
          setIsSubmitted(true); // mark as submitted
        }
        // ✅ Store ticket stage
        setTicketStage(ticket?.stage);
      } catch (err) {
        console.error("Error fetching ticket:", err);
      }
    };

    fetchTicketStatus();
  }, [id, isTicketDetailsPage]);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const userdata = JSON.parse(localStorage.getItem("userData"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keep it as is or calculate based on your logic

  const intervalRef = useRef(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await http.get(`/users/profile/${userdata?.id}`);
      if (response.data.status) {
        const userData2 = response.data.data;
        console.log(userData2);
        setUser(userData2);

        // Stop interval when company.progress reaches 100
        if (userData2?.company?.progress === 100 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          console.log("Progress 100% — interval stopped");
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userdata?.id) return;

    // Fetch immediately once
    fetchUser();

    // Set interval to fetch every 5 seconds
    intervalRef.current = setInterval(fetchUser, 5000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userdata?.id]);

  // useEffect(() => {
  //   if (!userdata?.id) return;

  //   // Fetch immediately once
  //   fetchUser();

  //   // Set interval to fetch every 5 seconds
  //   const interval = setInterval(() => {
  //     fetchUser();
  //   }, 5000); // 5000 ms = 5 seconds

  //   // Cleanup on unmount
  //   return () => clearInterval(interval);
  // }, [userdata?.id]);

  const handleClick = () => {
    if (user?.company?.progress === 100) {
      navigate("/dashboard/create-ticket");
    } else {
      toast.error("Please complete your profile to create a ticket.");
    }
  };
  const disableSubmitOEM = loadingSubmit || isSubmitted || ticketStage !== 1;

  const isDisabled = user?.company?.progress !== 100;
  return (
    <div className="flex justify-between items-center mb-6 p-4 shadow  bg-[#e9e9e9] sticky top-0 z-30">
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
        <div className="relative inline-block group">
          <button
            onClick={() => navigate("/dashboard/plant-profile")}
            className={`px-3 text-[#212529] md:text-[16px] font-medium py-2 rounded-lg text-sm 
      cursor-pointer hover:text-blue-500 transition duration-200 ease-in-out`}
          >
            Profile
          </button>

          {isDisabled && (
            <span className="absolute top-2 right-1 h-2 w-2 bg-blue-500 rounded-full"></span>
          )}

          {isDisabled && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-max 
      bg-black text-white text-xs rounded py-1 px-2 
      opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
            >
              Complete your profile before creating a ticket
            </div>
          )}
        </div>

        {/* <button
          // onClick={handleOpen}
          onClick={() => navigate("/dashboard/create-ticket")}
          className="bg-[#0088FF] md:w-[126px] md:h-[35px]  md:text-[16px]  font-medium  text-[#FFFFFF] px-3 py-2 md:px-0 md:py-0 rounded-lg text-sm"
        >
          Create Ticket
        </button> */}
        {/* <button
          onClick={handleClick}
          className={`${
            isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#0088FF] hover:bg-[#0070D1]"
          } md:w-[126px] md:h-[35px] cursor-pointer md:text-[16px] font-medium text-[#FFFFFF] px-3 py-2 md:px-0 md:py-0 rounded-lg text-sm transition`}
        >
          Create Ticket
        </button> */}
        {isTicketDetailsPage ? (
          /* Submit to OEM Button */
          <button
            onClick={handleSubmitToOEM}
            disabled={disableSubmitOEM}
            className={`${
              disableSubmitOEM
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } md:w-[160px] md:h-[35px] text-white font-medium rounded-lg text-sm transition`}
          >
            {isSubmitted ? "Already Submitted" : "Submit to OEM"}
          </button>
        ) : (
          /* Create Ticket Button */
          <button
            onClick={handleClick}
            disabled={isDisabled}
            className={`${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0088FF] hover:bg-[#0070D1]"
            } md:w-auto md:h-[35px] cursor-pointer md:text-[16px] font-medium text-white px-3 py-2 rounded-lg text-sm transition`}
          >
            Create Ticket
          </button>
        )}

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
      className="relative cursor-pointer px-3 py-2 text-[#212529] md:text-[16px] hover:text-[#0088FF] font-medium rounded-lg text-sm"
    >
      <FaBell className="text-xl" />

      {hasNotifications && (
        <span className="absolute top-1 right-1 block w-2 h-2 rounded-full bg-orange-500" />
      )}
    </button>
  );
};

export default Header;
