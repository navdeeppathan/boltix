import React, { useEffect, useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import http from "../service/http";
import { baseURL } from "../service/api";
import { CircularProgress } from "@mui/material";
import { RotatingLines } from "react-loader-spinner";

const ApprovedTicketTable = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [expandedRow, setExpandedRow] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("userData"));
  const user_id = user?.id;
  // Fetch user's tickets on mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await http.get(
          `/tickets/user/${user_id}?query=${query}`,
        );
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
    // Handle ticket row click (e.g., navigate to details page)
    console.log("Ticket clicked:", id);

    if (location.pathname.includes("manager")) {
      navigate(`/manager/dashboard/ticket-details/${id}`);
      return;
    }
    navigate(`/dashboard/ticket-details/${id}`);
  };

  const hasManufacturer = tickets?.some(
    (ticket) =>
      ticket.manufacturer_user !== null &&
      ticket.manufacturer_user !== undefined,
  );

  const hasServiceProvider = tickets?.some(
    (ticket) =>
      ticket.service_user !== null && ticket.service_user !== undefined,
  );

  return (
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
                  Manufacturer Supplier Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[200px]">
                  Manufacturer / Service Provider
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap min-w-[120px]">
                  Status
                </th>
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
                tickets
                  .sort((a, b) => b.id - a.id)
                  .filter((ticket) => ticket.stage == 1)
                  .map((ticket, index) => (
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
                            {ticket?.user?.company?.profile_pic ? (
                              <img
                                src={ticket?.user?.company?.profile_pic} // if path stored like "uploads/tickets/filename.jpg"
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
                      <td className="px-4 py-2 whitespace-nowrap">
                        {hasManufacturer && ticket.manufacturer_user?.full_name}
                        {hasServiceProvider && ticket.service_user?.full_name}
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
                              ticket.description
                                ?.split(" ")
                                .slice(0, 10)
                                .join(" ") + "...",
                          }}
                        />
                      </td>

                      {/* <td className="px-4 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status || "N/A"}
                      </span>
                    </td> */}
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {new Date(ticket.issue_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText size={16} />
                          <span>{ticket.documents.length ? 1 : 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
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
                        {ticket.stage === 3 && (
                          <button
                            disabled
                            className="px-3 py-2 bg-[#FFF4E0] text-[#A67C00] h-[32px] flex items-center justify-center text-xs font-bold rounded-[8px]"
                          >
                            Returned
                          </button>
                        )}

                        {ticket.stage === 4 && (
                          <button
                            disabled
                            className="px-3 py-2 bg-[#E9F6E9] text-[#1E824C] h-[32px] flex items-center justify-center text-xs font-bold rounded-[8px]"
                          >
                            Closed
                          </button>
                        )}

                        {ticket.stage === 0 && (
                          <button
                            disabled
                            className="px-3 py-2 bg-[#FDE0DF] text-[#DC6A64] h-[32px] flex items-center justify-center text-xs font-bold rounded-[8px]"
                          >
                            Pending
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
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
    </div>
  );
};

export default ApprovedTicketTable;
