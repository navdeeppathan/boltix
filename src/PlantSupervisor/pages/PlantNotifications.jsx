import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import http from "../../service/http";
import { RotatingLines } from "react-loader-spinner";
// your axios instance

const PlantNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));
  const [tickets, setTickets] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await http.get("/notifications/manager");
        setNotifications(response.data.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchTickets();
    }
  }, [user?.id]);

  const fetchTickets = async () => {
    try {
      setLoadingNotifications(true);
      const res = await http.get(`/tickets/parent/${user.id}`);
      console.log("resnotify:-", res.data);
      if (res.data.status && Array.isArray(res.data.data)) {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAsRead = async (id) => {
    if (!id) return;
    try {
      const response = await http.patch(`/notifications/${id}/read`);
      if (response.data.status) {
        // Update local state to mark notification as read
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="space-y-3">
      {/* {loading ? (
        <div className="flex justify-center py-4">
          
          <RotatingLines
            strokeColor="#1E1E1E"
            strokeWidth="5"
            animationDuration="0.75"
            width="20"
            visible={true}
          />
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications</p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white rounded-lg p-3 shadow-sm text-sm text-[#333] flex justify-between items-center ${
              notif.is_read ? "opacity-70" : "bg-[#FFF4E5]"
            }`}
          >
            <p className="text-[12px] text-[#555] mb-1">{notif.message}</p>
            <div className="flex justify-between items-center text-[11px] text-[#9D9D9D] gap-3">
              <span>{new Date(notif.created_at).toLocaleString()}</span>
              <button
                className="text-[#007BFF] hover:underline"
                onClick={() => markAsRead(notif.id)}
              >
                View
              </button>
            </div>
          </div>
        ))
      )} */}

      <TicketNotifications user={user} />
    </div>
  );
};

export default PlantNotifications;

// your axios instance

const TicketNotifications = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await http.get(`/tickets/parent/${user.id}`);
      console.log("resnotify:-", res.data);

      if (res.data.status && Array.isArray(res.data.data)) {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTickets();
    }
  }, [user?.id]);

  return (
    <div className="p-4">
      {loading && (
        <div className="flex justify-center py-4">
          {/* <CircularProgress size={20} color="inherit" /> */}
          <RotatingLines
            strokeColor="#1E1E1E"
            strokeWidth="5"
            animationDuration="0.75"
            width="20"
            visible={true}
          />
        </div>
      )}

      {!loading && tickets.length === 0 && (
        <p className="text-gray-500">No Notifications found.</p>
      )}

      {!loading &&
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="border border-gray-300 shadow-sm p-4 rounded-lg mb-4"
          >
            {/* Ticket Title */}
            <h2 className="font-medium text-base text-black">
              {ticket.category}
            </h2>
            <p className="text-xs font-normal text-gray-600 mb-2">
              Ticket Title: {ticket.ticket_title}
            </p>

            {/* Notifications */}
            <h3 className=" text-sm font-normal mt-2 text-blue-600">
              Notifications:
            </h3>

            {ticket.notifications?.length > 0 ? (
              ticket.notifications
                .sort((a, b) => b.id - a.id)
                .filter(
                  (note) => note.plant_supervisor == ticket.parent_user_id
                )
                .map((note) => (
                  <div
                    key={note.id}
                    className={`p-2 rounded my-2 border ${
                      note.is_read === 0
                        ? "bg-yellow-100 border-yellow-500"
                        : "bg-gray-100 border-gray-300"
                    }`}
                  >
                    {/* <p className="text-sm font-medium">{note.title}</p> */}
                    <p className="text-xs text-gray-700">{note.message}</p>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-400">No notifications</p>
            )}
          </div>
        ))}
    </div>
  );
};
