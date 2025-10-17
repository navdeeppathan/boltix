import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import http from "../../service/http";
import { RotatingLines } from "react-loader-spinner";
// your axios instance

const ManagerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      {loading ? (
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
      )}
    </div>
  );
};

export default ManagerNotifications;
