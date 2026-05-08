import React, { useEffect, useState, useMemo } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { CircularProgress } from "@mui/material";
import http from "../../service/http";
import { baseURL } from "../../service/api";
import { RotatingLines } from "react-loader-spinner";
import Swal from "sweetalert2";
import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { toast } from "react-toastify";

const TechnicianTicketTable = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [expandedRow, setExpandedRow] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("userData"));
  const user_id = user?.id;

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await http.get(`/tickets/assigned/${user_id}`);
      console.log("Tickets:", response.data.data);

      if (response.data.status && Array.isArray(response.data.data)) {
        setTickets(response.data.data);
      } else {
        console.error("Unexpected API structure", response.data);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPriorityColor = (priority) => {
    const priorityValue =
      typeof priority === "object" && priority !== null
        ? priority.priority_name
        : priority;

    switch (String(priorityValue || "").toLowerCase()) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-cyan-500 text-white";
      case "critical":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "bg-cyan-500 text-white";
      case "in progress":
        return "bg-orange-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getCategoryColor = (category) => {
    return category === "Service Breakdown" ? "text-red-500" : "text-blue-500";
  };

  const location = useLocation();
  const handleTicketClick = (id) => {
    console.log("Ticket clicked:", id);
    navigate(`/technician/dashboard/ticket/ticket-details/${id}`);
  };

  const [updatingId2, setUpdatingId2] = useState(null); // To track which ticket is updating

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalAction, setModalAction] = useState(null);
  const [modalStage, setModalStage] = useState(null);
  const [modalTicketId, setModalTicketId] = useState(null);
  const [description, setDescription] = useState("");

  const openActionModal = (ticketId, action, title) => {
    setModalTicketId(ticketId);
    setModalAction(action);
    setModalTitle(title);
    setDescription("");
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    await handleApprove(modalTicketId, modalAction, modalStage, description);
  };

  const handleApprove = async (ticketId, action, stage, description) => {
    try {
      setUpdatingId2(ticketId);
      if (!description) {
        toast.error("Please enter a description.");
        return;
      }

      await http.post(`/tickets/approve_status/${ticketId}`, {
        stage: action, // or you can map action → stage if needed
        action,
        description,
        user_id: user.id, // assuming you have logged-in user data
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Ticket ${modalTitle} successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });
      setShowModal(false);
      fetchTickets();
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

  // 👉 GROUP TICKETS BY user_id
  const groupedTickets = useMemo(() => {
    const groups = {};
    tickets.forEach((t) => {
      const uid = t.user_id || t.user?.id || "unknown";
      if (!groups[uid]) {
        groups[uid] = {
          userId: uid,
          userName: t.user?.name || t.user?.username || "Unknown User",
          companyName: t.user?.company?.company_name || "Unknown Company",
          tickets: [],
        };
      }
      groups[uid].tickets.push(t);
    });
    return Object.values(groups);
  }, [tickets]);

  return (
    <>
      <div className="w-full max-w-sm sm:max-w-3xl md:max-w-full  bg-gray-50">
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
                    Plant / Client Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[150px]">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[100px]">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[200px]">
                    Service / Equipment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[280px]">
                    Issue Description
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[120px]">
                    Created On
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[120px]">
                    Attachments
                  </th>
                  {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[120px]">
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
                ) : groupedTickets.length > 0 ? (
                  groupedTickets.map((group) => (
                    <React.Fragment key={group.userId}>
                      {/* Group header row (per user_id) */}
                      <tr className="bg-gray-100">
                        <td
                          colSpan="9"
                          className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700"
                        >
                          Company:{" "}
                          <span className="font-bold">
                            {group.companyName}
                          </span>{" "}
                        </td>
                      </tr>

                      {/* Rows for that user */}
                      {group.tickets.map((ticket, index) => (
                        <tr
                          key={ticket.id}
                          onClick={() => handleTicketClick(ticket?.id)}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {/* numbering within that user's group */}
                            {ticket?.ticket_number}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {ticket?.user?.company?.profile_pic ? (
                                  <img
                                    src={ticket?.user?.company?.profile_pic}
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
                                  {ticket.plant_name || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`text-sm font-medium whitespace-nowrap ${getCategoryColor(
                                ticket.category,
                              )}`}
                            >
                              {ticket.category || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(
                                ticket.priority?.priority_name,
                              )}`}
                            >
                              {ticket.priority?.priority_name || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {ticket.service || ticket.equipment || "N/A"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  (ticket.description || "")
                                    .split(" ")
                                    .slice(0, 25)
                                    .join(" ") + "...",
                              }}
                            />
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                            {ticket.issue_date
                              ? new Date(ticket.issue_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "N/A"}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FileText size={16} />
                              <span>
                                {ticket.documents?.length
                                  ? ticket.documents.length
                                  : 0}
                              </span>
                            </div>
                          </td>
                          {/* <td className="px-4 py-4">
                            {(ticket.stage === 0 || ticket.stage === 3) && (
                              <div className="flex gap-2">
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openActionModal(ticket.id, 1, "Approve");
                                  }}
                                  disabled={updatingId2 === ticket.id}
                                  className="px-3 py-2 bg-[#0088FF] h-[32px] flex items-center justify-center text-xs text-white font-bold rounded-[8px] hover:bg-green-700"
                                >
                                  {updatingId2 === ticket.id ? (
                                    <RotatingLines
                                      strokeColor="#fff"
                                      strokeWidth="5"
                                      animationDuration="0.75"
                                      width="20"
                                      visible={true}
                                    />
                                  ) : (
                                    "Approve"
                                  )}
                                </button>

                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openActionModal(ticket.id, 2, "Reject");
                                  }}
                                  className="px-3 py-2 bg-red-600 h-[32px] flex items-center justify-center text-xs text-white font-bold rounded-[8px] hover:bg-red-700"
                                >
                                  Reject
                                </button>

                               
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openActionModal(ticket.id, 3, "Return");
                                  }}
                                  className="px-3 py-2 bg-yellow-500 h-[32px] flex items-center justify-center text-xs text-white font-bold rounded-[8px] hover:bg-yellow-600"
                                >
                                  Return
                                </button>
                              </div>
                            )}

                            {ticket.stage === 1 && (
                              <button
                                disabled
                                className="px-3 py-2 bg-[#E9F6E9] text-[#1E824C] h-[32px] flex items-center justify-center text-xs font-bold rounded-[8px]"
                              >
                                Approved
                              </button>
                            )}

                            {ticket.stage === 2 && (
                              <button
                                disabled
                                className="px-3 py-2 bg-[#FDE0DF] text-[#DC6A64] h-[32px] flex items-center justify-center text-xs font-bold rounded-[8px]"
                              >
                                Rejected
                              </button>
                            )}
                          </td> */}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-500">
                      No tickets found.
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

        {/* Card View (Only on mobile when selected) – left as-is, not grouped */}
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
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      ticket.priority?.priority_name,
                    )}`}
                  >
                    {ticket.priority?.priority_name}
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      ticket.status,
                    )}`}
                  >
                    {ticket.status}
                  </span>
                  <span
                    className={`inline-block text-xs font-medium ${getCategoryColor(
                      ticket.category,
                    )}`}
                  >
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
                      <div className="text-sm text-gray-900">
                        {ticket.issue}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <div className="text-xs font-medium text-gray-500">
                          Created On
                        </div>
                        <div className="text-sm text-gray-900">
                          {ticket.date}
                        </div>
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
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/20  flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl shadow-lg relative">
            {/* Title */}
            <h2 className="text-lg font-bold mb-3 text-gray-800 text-center sm:text-left">
              {modalTitle} Ticket
            </h2>

            {/* Editor */}
            <div className="w-full">
              <Editor
                style={{
                  height: "180px",
                  border: "1px solid #D9D4C6",
                }}
                value={description}
                onTextChange={(e) => setDescription(e.htmlValue)}
              />
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 h-[38px] flex items-center justify-center text-gray-800 rounded-md transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#0088FF] text-white h-[38px] flex items-center justify-center rounded-md hover:bg-blue-600 transition"
                onClick={handleConfirmAction}
                disabled={!description || updatingId2 !== null}
              >
                {updatingId2 !== null ? (
                  <RotatingLines
                    strokeColor="#fff"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="20"
                    visible={true}
                  />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TechnicianTicketTable;
