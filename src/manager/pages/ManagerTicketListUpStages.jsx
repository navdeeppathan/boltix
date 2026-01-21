import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

import { CircularProgress } from "@mui/material";
import http from "../../service/http";
import { RotatingLines } from "react-loader-spinner";

const statusOptions = [
  { value: "New", label: "New" },
  { value: "inProgress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const statusOptions2 = [
  { value: 0, label: "Panding" },
  { value: 1, label: "Approve" },
  { value: 2, label: "Cancle" },
];

const ManagerTicketListUpStages = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [updatingId2, setUpdatingId2] = useState(null); // To track which ticket is updating

  const user = JSON.parse(localStorage.getItem("userData"));
  // Fetch all tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await http.get("/tickets");
      setTickets(res.data.data || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch tickets.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update stage API
  const handleStageChange = async (ticketId, newStage) => {
    try {
      setUpdatingId(ticketId);
      await http.post(`/tickets/update-stage/${ticketId}`, {
        user_id: user.id,
        status: newStage.value, // send value from react-select
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Ticket stage updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      // Update local state without refetching all tickets
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId ? { ...t, status: newStage.value } : t
        )
      );
    } catch (err) {
      console.error("Error updating stage:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update ticket stage.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStageStatus = async (ticketId, newStage) => {
    try {
      setUpdatingId2(ticketId);

      // Call Laravel API
      await http.post(`/tickets/approve_status/${ticketId}`, {
        stage: newStage.value, // send stage as integer
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Ticket stage updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      // Update local state without refetching
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId ? { ...t, stage: newStage.value } : t
        )
      );
    } catch (err) {
      console.error("Error updating stage:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update ticket stage.",
      });
    } finally {
      setUpdatingId2(null);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
      {loading ? (
        <div className="flex justify-center items-center w-full h-60">
          {/* <CircularProgress /> */}
          <RotatingLines
            strokeColor="#1E1E1E"
            strokeWidth="5"
            animationDuration="0.75"
            width="20"
            visible={true}
          />
        </div>
      ) : tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-gray-100 shadow-md rounded-2xl p-4 border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-2">
              {ticket?.ticket_title || "Untitled Ticket"}
            </h3>
            <p className="text-gray-600 mb-3">
              {ticket.description
                ?.replace(/<[^>]+>/g, "") // remove HTML tags
                .split(" ")
                .slice(0, 10)
                .join(" ") + "..." || "No description provided."}
            </p>

            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <div className="flex items-center justify-between gap-4">
                <div className="w-40">
                  {updatingId === ticket.id ? (
                    // <CircularProgress size={20} />
                    <RotatingLines
                      strokeColor="#1E1E1E"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="20"
                      visible={true}
                    />
                  ) : (
                    <Select
                      options={statusOptions}
                      value={statusOptions.find(
                        (opt) => opt.value === ticket.status
                      )}
                      onChange={(selected) =>
                        handleStageChange(ticket.id, selected)
                      }
                      isSearchable={false}
                      components={{
                        IndicatorSeparator: () => null, // <-- removes vertical line
                      }}
                    />
                  )}
                </div>
                <div className="w-40">
                  {updatingId2 === ticket.id ? (
                    <RotatingLines
                      strokeColor="#1E1E1E"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="20"
                      visible={true}
                    />
                  ) : (
                    <Select
                      options={statusOptions2}
                      value={statusOptions2.find(
                        (opt) => opt.value === ticket.stage
                      )} // use stage
                      onChange={(selected) =>
                        handleStageStatus(ticket.id, selected)
                      }
                      isSearchable={false}
                      components={{
                        IndicatorSeparator: () => null, // remove vertical line
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManagerTicketListUpStages;
