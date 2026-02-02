import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import http from "../../service/http";
import { RotatingLines } from "react-loader-spinner";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import Swal from "sweetalert2";

const PlantUsers = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1>Users</h1>
        <button
          onClick={() => navigate("/plant-supervisor/dashboard/add-users")}
          className="flex items-center justify-center p-2 rounded-lg bg-[#0088FF] text-white cursor-pointer"
        >
          Add User
        </button>
      </div>
      <div>
        <UserTable />
      </div>
    </div>
  );
};

export default PlantUsers;

const UserTable = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("userData"));
  const user_id = user?.id;

  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openTicketModal = (userId) => {
    setSelectedUserId(userId);
    setDescription("");
    setShowModal(true);
  };

  const createTicket = async () => {
    if (!description.trim()) {
      alert("Please enter description");
      return;
    }

    try {
      setSubmitting(true);

      const response = await http.post("/admin/tickets", {
        user_id: selectedUserId,
        provider_id: user_id,
        remarks: description,
      });

      if (response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Ticket created successfully",
          showConfirmButton: true,
        });
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title:
          error.response.data.message ||
          error.response.data.error ||
          "Failed to create ticket",
        showConfirmButton: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await http.get(`/users/by-parent/${user_id}`);
        if (response.data.status && Array.isArray(response.data.data)) {
          setTickets(response.data.data);
          console.log("Tickets:", response.data.data);
        } else {
          console.error("Unexpected API structure", response.data);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl lg:max-w-5xl  bg-gray-50">
      {/* Table View (Always visible on desktop, toggleable on mobile) */}
      <div className={`w-full bg-white rounded-lg shadow overflow-hidden`}>
        <div
          className="overflow-x-auto overflow-y-auto max-h-screen relative scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          style={{
            scrollbarWidth: "thin", // Firefox
          }}
        >
          <style>
            {`
      /* Chrome, Edge, Safari */
      ::-webkit-scrollbar {
        width: 3px;
        height: 2px;
      }
      ::-webkit-scrollbar-track {
        background: #f3f4f6; /* Tailwind gray-100 */
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #9ca3af; /* Tailwind gray-400 */
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: #6b7280; /* Tailwind gray-500 */
      }
    `}
          </style>

          <table className="w-full min-w-max">
            <thead className="sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-200 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[50px]">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[200px]">
                  Full Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[150px]">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[200px]">
                  Designation
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[280px]">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[100px]">
                  Mobile No.
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[100px]">
                  Action
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    <div className="inline-flex items-center justify-center">
                      <RotatingLines
                        strokeColor="#1E1E1E"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="20"
                        visible={true}
                      />
                    </div>
                  </td>
                </tr>
              ) : tickets.length > 0 ? (
                tickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    onClick={() => handleTicketClick(ticket?.id)}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {ticket?.company?.profile_pic ? (
                            <img
                              src={ticket?.company?.profile_pic} // if path stored like "uploads/tickets/filename.jpg"
                              alt="Ticket"
                              className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {ticket.logo || "T"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                            {ticket.full_name || "N/A"}
                          </div>
                          {/* <div className="text-xs text-gray-500 whitespace-nowrap">
                            ({ticket.location})
                          </div> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-medium text-gray-900 whitespace-nowrap`}
                      >
                        {ticket?.company?.company_name || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {ticket?.company?.designation || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {ticket?.email || "N/A"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-gray-900 rounded-full text-xs font-medium whitespace-nowrap `}
                      >
                        {ticket?.mobile_number || "N/A"}
                      </span>
                    </td>
                    {/* <td className="px-4 py-4">
                      {ticket?.is_active == 0 ? (
                        ticket?.admin_tickets?.length == 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent row click
                              openTicketModal(ticket.id);
                            }}
                            className="px-3 py-1 text-xs font-semibold text-white bg-black rounded hover:bg-gray-800"
                          >
                            Create Ticket
                          </button>
                        ) : (
                          <span className="inline-block px-3 py-1 text-red-900 bg-red-200 rounded-full text-xs font-medium whitespace-nowrap">
                            inactive
                          </span>
                        )
                      ) : (
                        <span className="inline-block px-3 py-1 text-green-900 bg-green-200 rounded-full text-xs font-medium whitespace-nowrap">
                          active
                        </span>
                      )}
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    No User found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Scroll indicator for mobile */}
        <div className="lg:hidden bg-gray-100 py-2 text-center text-xs text-gray-500">
          ← Swipe to see more columns →
        </div>
      </div>

      {/* Card View (Only on mobile when selected) */}
      <div
        className={`${
          viewMode === "table" ? "hidden" : "block lg:hidden"
        } space-y-4`}
      >
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {ticket.supplierIcon ? (
                      <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-white text-xl">⚠</span>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {ticket.logo}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {ticket.supplier}
                    </div>
                    <div className="text-xs text-gray-500">
                      ({ticket.location})
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-500 ml-2">
                  #{ticket.id}
                </span>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium `}
                >
                  {ticket.priority?.priority_name}
                </span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium`}
                >
                  {ticket.status}
                </span>
                <span className={`inline-block text-xs font-medium `}>
                  {ticket.category}
                </span>
              </div>

              {/* Collapsible Content */}
              <button
                onClick={() =>
                  setExpandedRow(expandedRow === ticket.id ? null : ticket.id)
                }
                className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-2"
              >
                <span>Details</span>
                {expandedRow === ticket.id ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {expandedRow === ticket.id && (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <div>
                    <div className="text-xs font-medium text-gray-500">
                      Service / Equipment
                    </div>
                    <div className="text-sm text-gray-900">
                      {ticket.service}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">
                      Issue Description
                    </div>
                    <div className="text-sm text-gray-900">{ticket.issue}</div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <div className="text-xs font-medium text-gray-500">
                        Created On
                      </div>
                      <div className="text-sm text-gray-900">{ticket.date}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText size={16} />
                      <span>{ticket.attachments}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md p-5 shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Create Admin Ticket</h2>

            <textarea
              rows="4"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded border"
              >
                Cancel
              </button>

              <button
                onClick={createTicket}
                disabled={submitting}
                className="px-4 py-2 text-sm rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
