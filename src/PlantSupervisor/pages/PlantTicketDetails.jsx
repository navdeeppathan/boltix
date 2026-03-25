import React, { useEffect, useRef, useState } from "react";
import {
  FaCamera,
  FaCheck,
  FaClipboardList,
  FaCommentAlt,
  FaFileAlt,
  FaPhone,
  FaRegFileImage,
  FaTimes,
  FaUserFriends,
  FaVideo,
} from "react-icons/fa";
import http from "../../service/http";
import { baseURL } from "../../service/api";
import Select from "react-select";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import Swal from "sweetalert2";
import { Videocam, Call, Close } from "@mui/icons-material";
import { RotatingLines } from "react-loader-spinner";
import {
  AlertTriangle,
  BriefcaseBusinessIcon,
  Check,
  CheckCheck,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../../utils/CustomScroll.css";
import TicketHistoryPopup from "../../utils/TicketHistoryPopup";

export default function PlantTicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("userData"));

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await http.get(`/tickets/${id}`);
      if (response.data.status) {
        setTicket(response.data.data);
        console.log("Ticket Details:", response.data.data);
      }
    } catch (err) {
      console.error("Error fetching ticket details", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

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

  const [updatingId2, setUpdatingId2] = useState(null);
  const [updatingId3, setUpdatingId3] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
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
      if (!description && showEditor) {
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
      fetchTicketDetails();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RotatingLines
          strokeColor="#1E1E1E"
          strokeWidth="5"
          animationDuration="0.75"
          width="20"
          visible={true}
        />
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row mb-4 sm:items-center sm:justify-between bg-[#F9F9F9] rounded-[10px] border border-[#F9F9F9] px-4 py-3 sm:py-2 shadow-sm gap-3 sm:gap-0">
          {/* Left side: Logo + Title */}
          <div className="flex items-center gap-3">
            {/* <img
              src={ticket?.photo ? `${baseURL}/${ticket.photo}` : ""}
              alt="Ticket Logo"
              className="w-10 h-10 rounded-full object-contain"
            /> */}
            <Avatar
              src={ticket?.photo ? `${baseURL}/${ticket.photo}` : undefined}
              alt=""
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#0f766e",
                fontSize: 14,
              }}
            >
              {!ticket?.photo &&
                (ticket?.plant_name ? (
                  ticket?.plant_name.charAt(0).toUpperCase()
                ) : (
                  <BriefcaseBusinessIcon fontSize="small" />
                ))}
            </Avatar>
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 break-words">
                {ticket?.plant_name || "Unknown Plant"}
              </h3>
              <p className="text-[12px] text-gray-500">
                ({ticket?.department || "Department"})
              </p>
            </div>
          </div>

          {/* Right side: Buttons */}
          {/* <div className="flex flex-wrap justify-end sm:justify-start items-center gap-2">
            
            {ticket?.stage === 0 && (
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                
                <button
                  onClick={() => handleApprove(ticket?.id, 1)}
                  disabled={updatingId2 === ticket?.id}
                  className={`flex items-center justify-center gap-2 px-4 py-[6px] text-[13px] font-medium rounded-[8px] transition-all h-[32px] w-full sm:w-auto ${
                    updatingId2 === ticket.id
                      ? "bg-[#1E1E1E] text-white opacity-90 cursor-not-allowed"
                      : "bg-[#1E1E1E] hover:bg-[#333] text-white"
                  }`}
                >
                  {updatingId2 === ticket?.id ? (
                    <RotatingLines
                      strokeColor="#fff"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="18"
                      visible={true}
                    />
                  ) : (
                    <>
                      <FaCheck size={12} />
                      Approve
                    </>
                  )}
                </button>

              
                <button
                  onClick={() => handleApprove(ticket?.id, 2)}
                  disabled={updatingId3 === ticket?.id}
                  className="flex items-center justify-center gap-1 px-4 py-[6px] bg-red-600 hover:bg-red-700 text-white text-[13px] font-medium rounded-[8px] h-[32px] w-full sm:w-auto"
                >
                  {updatingId3 === ticket?.id ? (
                    <RotatingLines
                      strokeColor="#fff"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="18"
                      visible={true}
                    />
                  ) : (
                    <>
                      <FaTimes size={12} />
                      Cancel
                    </>
                  )}
                </button>
              </div>
            )}

            
            {ticket?.stage === 1 && (
              <button
                disabled
                className="px-3 py-[6px] bg-[#00C8B3] text-white h-[32px] flex items-center justify-center gap-1 text-xs font-semibold rounded-[8px] w-full sm:w-auto"
              >
                <img
                  src="/checkmarkwhite.png"
                  alt=""
                  className="w-[18px] h-[18px] object-cover"
                />
                Approved
              </button>
            )}

            {ticket?.stage === 2 && (
              <button
                disabled
                className="px-3 py-2 bg-[#FDE0DF] text-[#DC6A64] h-[32px] flex items-center justify-center text-xs font-bold rounded-[8px] w-full sm:w-auto"
              >
                Cancelled
              </button>
            )}

           
            <AssignTicketModal ticket={ticket} />
          </div> */}
          <div className="flex flex-wrap justify-end sm:justify-start items-center gap-2">
            {/* Stage 0 or 3: Approve / Reject / Return */}
            {(ticket?.stage === 0 || ticket?.stage === 3) && (
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {/* Approve Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openActionModal(ticket.id, 1, "Approve");
                  }}
                  disabled={updatingId2 === ticket.id}
                  className={`flex items-center justify-center px-3 py-2 h-[32px] text-xs font-bold rounded-[8px] w-full sm:w-auto transition-all ${
                    updatingId2 === ticket.id
                      ? "bg-[#0088FF] opacity-70 cursor-not-allowed text-white"
                      : "bg-[#0088FF] hover:bg-green-700 text-white"
                  }`}
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

                {/* Reject Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openActionModal(ticket.id, 2, "Reject");
                  }}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 h-[32px] flex items-center justify-center text-xs text-white font-bold rounded-[8px] w-full sm:w-auto"
                >
                  Reject
                </button>

                {/* Return Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openActionModal(ticket.id, 3, "Return");
                  }}
                  className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 h-[32px] flex items-center justify-center text-xs text-white font-bold rounded-[8px] w-full sm:w-auto"
                >
                  Return
                </button>
              </div>
            )}

            {/* Stage 1: Approved */}
            {ticket?.stage === 1 && (
              <button
                disabled
                className="px-3 py-[6px] bg-[#00C8B3] text-white h-[32px] flex items-center justify-center gap-1 text-xs font-semibold rounded-[8px] w-full sm:w-auto"
              >
                <img
                  src="/checkmarkwhite.png"
                  alt=""
                  className="w-[18px] h-[18px] object-cover"
                />
                Approved
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

            {ticket?.stage === 4 && (
              <button
                disabled
                className="px-3 py-[6px] bg-[#00C8B3] text-white h-[32px] flex items-center justify-center gap-1 text-xs font-semibold rounded-[8px] w-full sm:w-auto"
              >
                <img
                  src="/checkmarkwhite.png"
                  alt=""
                  className="w-[18px] h-[18px] object-cover"
                />
                Completed
              </button>
            )}

            {/* Stage 2: Rejected */}
            {ticket?.stage === 2 && (
              <button
                disabled
                className="px-3 py-2 bg-[#FDE0DF] text-[#DC6A64] h-[32px] flex items-center justify-center text-xs font-bold rounded-[8px] w-full sm:w-auto"
              >
                Rejected
              </button>
            )}

            {/* Assign Modal */}
            {/* <AssignTicketModal ticket={ticket} /> */}
          </div>
        </div>

        <AssignedTechnicianCard ticket={ticket} />

        <div className="bg-[#F9F9F9] rounded-[10px] shadow-sm border border-[#F9F9F9] p-5 flex flex-col gap-4">
          {/* Header Section */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#EDEDED] rounded-full px-2 py-[2px] text-gray-600 text-[11px]">
                <div className="flex  items-center gap-1 text-[11px] font-medium px-1 py-[2px] rounded-full text-gray-600">
                  <FileText size={16} />
                  <span>{ticket.documents.length ? 1 : 0}</span>
                </div>
              </div>
              <span
                className={`text-[11px] font-medium px-2 py-[2px] rounded-full ${getPriorityColor(
                  ticket.priority?.priority_name,
                )}`}
              >
                {ticket.priority?.priority_name || "N/A"}
              </span>
              {/* <span
                className={`text-[11px] font-medium px-2 py-[2px] rounded-full ${getStatusColor(
                  ticket?.status
                )}`}
              >
                {ticket?.status?.charAt(0).toUpperCase() +
                  ticket?.status?.slice(1)}
              </span> */}
            </div>
          </div>

          {/* Service Required */}
          <div className=" ">
            <p className="text-[13px] font-semibold text-gray-800">
              Basic Information:
            </p>
            <p className="text-[13px] text-gray-700">
              <span className="text-black font-medium">Ticket Number:</span>{" "}
              {ticket?.ticket_number || "N/A"}
            </p>
            <p className="text-[13px] text-gray-700">
              <span className="text-black font-medium">Ticket Title:</span>{" "}
              {ticket?.ticket_title || "N/A"}
            </p>
            <p className="text-[13px] text-gray-700">
              <span className="text-black font-medium">Category:</span>{" "}
              {ticket?.category || "N/A"}
            </p>
            <p className="text-[13px] text-gray-700">
              <span className="text-black font-medium">Priority:</span>{" "}
              {ticket?.priority.priority_name || "N/A"}
            </p>
            <p className="text-[13px] text-gray-700">
              <span className="text-black font-medium">Created By:</span>{" "}
              {ticket?.user.company?.company_name || "N/A"} (
              {ticket?.user.company.designation || "N/A"})
            </p>
            <p className="text-[13px] text-gray-700 flex items-center gap-2">
              <span className="text-black font-medium">Status:</span>

              <span
                className={`px-2 py-[2px] rounded-full text-[11px] font-semibold
                ${
                  ticket?.user.isOnline == 1
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {ticket?.user.isOnline == 1 ? "Active" : "Offline"}
              </span>
            </p>
          </div>

          {/* Issue Reported + Info Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-end gap-3">
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-gray-800">
                Description:
              </p>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                {(
                  <div
                    dangerouslySetInnerHTML={{
                      __html: ticket.description,
                    }}
                  />
                ) || ``}
              </p>
            </div>

            {/* Inline Info Boxes */}
            <div className="flex flex-row gap-2 sm:ml-4 shrink-0">
              <div className="text-[12px] text-gray-700 bg-white rounded-md border border-gray-200 p-2 w-[110px]">
                <p className="font-bold text-gray-600">Category:</p>
                <p>
                  {ticket?.category
                    ?.replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
              </div>

              <div className="text-[12px] text-gray-700 bg-white rounded-md border border-gray-200 p-2 w-[110px]">
                <p className="font-bold text-gray-600">Date:</p>
                <p>
                  {new Date(ticket?.issue_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-[12px] text-gray-700 bg-white rounded-md border border-gray-200 p-2 w-[100px]">
                <p className="font-bold text-gray-600">Time:</p>
                <p>
                  {ticket?.issue_time
                    ? new Date(
                        `1970-01-01T${ticket.issue_time}Z`,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <TicketRemarksTab ticketId={ticket.id} />
        </div>

        <div className="mt-6">
          {/* <TicketHistoryPopup approvals={ticket.approvals} /> */}

          <TicketOverview
            ticket={ticket}
            fetchTicketDetails={fetchTicketDetails}
          />
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl shadow-lg relative">
            {/* Title */}
            <h2 className="text-lg font-bold mb-3 text-gray-800 text-center sm:text-left">
              {modalTitle} Ticket
            </h2>

            {/* Optional Description Toggle */}
            <div className="mb-3">
              {!showEditor ? (
                <button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition"
                  onClick={() => setShowEditor(true)}
                >
                  + Add Description (Optional)
                </button>
              ) : (
                <button
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 transition"
                  onClick={() => {
                    setShowEditor(false);
                    setDescription("");
                  }}
                >
                  Remove Description
                </button>
              )}
            </div>

            {/* Editor (only if shown) */}
            {showEditor && (
              <div className="w-full mb-4">
                <Editor
                  style={{
                    height: "180px",
                    border: "1px solid #D9D4C6",
                  }}
                  value={description}
                  onTextChange={(e) => setDescription(e.htmlValue)}
                />
              </div>
            )}

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
                disabled={updatingId2 !== null}
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
}

const AssignedTechnicianCard = ({ ticket }) => {
  const [assignedTicket, setAssignedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ticket?.id) return;

    const fetchAssignedTicket = async () => {
      try {
        setLoading(true);
        const response = await http.get(
          `/assigned-tickets/ticket/${ticket.id}`,
        );
        if (response.data?.data?.length > 0) {
          setAssignedTicket(response.data.data[0]);
          // ✅ first assigned ticket
        }
      } catch (err) {
        console.error("Error fetching assigned ticket:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTicket();
  }, [ticket]);

  if (loading) {
    return (
      <div className="bg-[#FDFDFB] p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center h-[100px]">
        <RotatingLines
          strokeColor="#000000"
          strokeWidth="5"
          animationDuration="0.75"
          width="20"
          visible={true}
        />
      </div>
    );
  }

  if (!assignedTicket) return null;
  console.log(assignedTicket);

  const assignedTo = assignedTicket.assigned_to;
  const assignedBy = assignedTicket.assigned_by;

  return (
    <div className="bg-[#FAF9F6] mb-4 p-4 rounded-2xl shadow-sm border border-gray-100 w-full">
      <p className="text-xs font-bold text-[#212529] mb-1">Assigned to:</p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left section */}
        <div>
          <p className="font-bold text-xs">
            {assignedTo?.role_id === 4 ? "Technician" : "Manager"}
          </p>
          <p className="text-xs font-medium">
            <span className="font-bold">{assignedTo?.full_name || "N/A"} </span>
            <span
              className={`${
                assignedTo?.availability ? "text-green-600" : "text-red-500"
              } cursor-pointer hover:underline`}
            >
              ({assignedTo?.availability === 1 ? "Available" : "Unavailable"})
            </span>
            ,{" "}
            <span className="text-[#212529] font-medium text-xs">
              His Open Tickets (0)
            </span>
          </p>

          <p className="text-[#212529] font-medium text-xs mt-1">
            <span className="font-bold">Assignment Notes:</span>{" "}
            {assignedTicket.assignment_notes || "No notes"}
          </p>

          <p className="text-[#212529] font-medium text-xs">
            <span className="font-bold">Reference File:</span>{" "}
            {assignedTicket.reference_file &&
            assignedTicket.reference_file !== "null" ? (
              <a
                href={`${baseURL}/${assignedTicket.reference_file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#086fb7] hover:underline"
              >
                View File
              </a>
            ) : (
              "No file"
            )}
          </p>

          <p className="text-[#212529] text-xs font-medium flex items-center gap-1 mt-1">
            <span className="font-bold">Response Time:</span>(
            {assignedTicket.status === 1 ? (
              <CheckCheck size={14} className="text-green-600" /> // double tick
            ) : (
              <Check size={14} className="text-green-600" /> // single tick
            )}
            ){assignedTicket.response_hours}h {assignedTicket.response_minutes}m
          </p>
        </div>

        {/* Right section - Status */}
        {/* <div className="flex justify-end">
          {assignedTicket.status === 0 ? (
            <span className="bg-yellow-400/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1">
              <AlertTriangle size={14} /> Pending
            </span>
          ) : assignedTicket.status === 1 ? (
            <span className="bg-[#0088FF] text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1">
              <img
                src="/checkmarkwhite.png"
                alt=""
                className="w-[18px] h-[18px] object-cover"
              />
              Accepted
            </span>
          ) : (
            <span className="bg-gray-400/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1">
              Unknown
            </span>
          )}
        </div> */}
      </div>
    </div>
  );
};

const AssignTicketModal = ({ ticket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("userData"));

  //  Single formData object
  const [formData, setFormData] = useState({
    assign_by: user.id, // replace with logged-in user ID
    assign_to: null,
    expected_completion_date: "",
    assignment_notes: "",
    reference_file: null,
    response_hours: null,
    response_minutes: null,
    ticket_id: ticket?.id || "",
  });

  const [designations, setDesignations] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const handleDesignationChange = (selectedOption) => {
    setSelectedDesignation(selectedOption);
  };
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!user || !selectedDesignation) return; // avoid unnecessary calls

    const fetchUsers = async () => {
      try {
        const response = await http.post(`/users/bydesignation`, {
          parent_id: user.id,
          designation: selectedDesignation,
        });
        const mappedUsers = response.data.data.map((user) => ({
          value: user.id,
          label: user.full_name,
          status: user.availability || "Available", // for blue badge
          ot: `OT/${user.ot_count || 0}`, // for gray tag
        }));
        setUsers(mappedUsers);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, [selectedDesignation]);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const res = await http.get("/designations");
        const formatted = res.data.data.map((item) => ({
          value: item.name,
          label: item.name,
        }));
        setDesignations(formatted);
      } catch (err) {
        console.error("Failed to load designations:", err);
      }
    };
    fetchDesignations();
  }, []);

  const handleAssign = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle file upload + preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, reference_file: file }));

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const personOptions = [
    { value: 1, label: "John Doe" },
    { value: 2, label: "Jane Smith" },
    { value: 3, label: "Rohit Sharma" },
  ];

  const hourOptions = [
    { value: 1, label: "1 Hour" },
    { value: 2, label: "2 Hours" },
    { value: 3, label: "3 Hours" },
  ];

  const minuteOptions = [
    { value: 30, label: "30 Minutes" },
    { value: 60, label: "1 Hour" },
  ];

  // Handle select changes (for react-select)
  const handleSelectChange = (field, option) => {
    setFormData((prev) => ({
      ...prev,
      [field]: option ? option.value : "",
    }));
  };

  const [assignedTicket, setAssignedTicket] = useState(null);

  const fetchAssignedTicket = async () => {
    if (!ticket?.id) return;
    try {
      const response = await http.get(`/assigned-tickets/ticket/${ticket.id}`);
      const assigned = response.data?.data?.[0];
      if (assigned) setAssignedTicket(assigned);
      else setAssignedTicket(null);
    } catch (err) {
      console.error("Error fetching assigned ticket:", err);
    }
  };

  //Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assign_to) {
      toast.error("Please select a person to assign the ticket.");
      return;
    }
    if (!formData.expected_completion_date) {
      toast.error("Please select an expected completion date.");
      return;
    }
    if (!formData.response_hours) {
      toast.error("Please select response hours.");
      return;
    }
    if (!formData.response_minutes) {
      toast.error("Please select response minutes.");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });

      const res = await http.post("/assigned-tickets", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Ticket assigned successfully!");
      fetchAssignedTicket();
      closeModal();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response.data.error ||
          "Failed to assign ticket. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedTicket();
  }, [ticket?.id]);

  return (
    <>
      {assignedTicket ? (
        // Ticket already assigned
        <button
          disabled
          className="flex items-center gap-1 bg-[#00C3D0] text-white text-[13px] font-medium px-4 py-[6px] rounded-md transition-all cursor-default"
        >
          <img
            src="/assigned.png"
            alt=""
            className="w-[18px] h-[18px] object-cover"
          />
          Ticket Assigned
        </button>
      ) : (
        // Assign button (only shown if ticket not yet assigned)
        <button
          onClick={handleAssign}
          className={`flex items-center gap-1 ${
            ticket?.stage === 2
              ? "hidden"
              : ticket?.stage === 1
                ? "bg-[#1E1E1E]"
                : "bg-[#8C8C8C]"
          } hover:bg-[#D6D6D6] text-white text-[13px] font-medium px-4 py-[6px] rounded-md transition-all`}
        >
          <img
            src="/assigned.png"
            alt=""
            className="w-[18px] h-[18px] object-cover"
          />
          Assign Ticket
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[#FFFFFF] w-[400px] p-5 rounded-[20px] shadow-lg relative">
            <h2 className="text-[24px] text-[#212529] font-semibold mb-4">
              Assigned Ticket
            </h2>

            {/* Assign To */}
            <label className="text-[16px] font-semibold mb-1">Assign To</label>
            <Select
              options={designations}
              placeholder="Select role"
              value={designations.find((d) => d.value === selectedDesignation)}
              onChange={handleDesignationChange}
              className="mb-3"
              components={{ IndicatorSeparator: () => null }}
            />

            {/* Select Person */}
            <label className="text-[16px] font-semibold mb-1">
              Select Person
            </label>
            <Select
              options={users}
              placeholder="Select available person"
              onChange={(option) => handleSelectChange("assign_to", option)}
              className="mb-3"
              components={{ IndicatorSeparator: () => null }}
              formatOptionLabel={(option) => (
                <div className="flex items-center justify-between w-full">
                  {/* Left: Name */}
                  <span className="text-[#212529] text-[15px] font-medium">
                    {option.label}
                  </span>

                  {/* Right: Status Badges */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-white text-[12px] font-semibold px-2 py-[2px] rounded-full ${
                        option.status === 1 ? "bg-[#00C0E8]" : "bg-[#AC7F5E]"
                      }`}
                    >
                      {option.status === 1
                        ? "Available"
                        : "On Leave" || "Available"}
                    </span>
                    <span className="bg-[#FAF9F6] text-[#212529] text-[12px] font-medium px-2 py-[2px] rounded-full">
                      {option.ot || "OT/2"}
                    </span>
                  </div>
                </div>
              )}
            />

            {/* Date */}
            <label className="text-[16px] font-semibold">
              Expected Completion Date
            </label>
            <input
              type="date"
              name="expected_completion_date"
              value={formData.expected_completion_date}
              onChange={handleChange}
              className="w-full border border-[#D9D4C6] rounded-md px-3 py-2 mb-3"
            />

            {/* Notes */}
            <label className="text-[16px] font-semibold">
              Assignment Notes
            </label>
            <textarea
              name="assignment_notes"
              value={formData.assignment_notes}
              onChange={handleChange}
              className="w-full border border-[#D9D4C6] rounded-md px-3 py-2 mb-3"
              rows="2"
            ></textarea>

            {/* File Upload */}
            <label className="text-[16px] font-semibold">
              Upload Reference File (Optional)
            </label>
            <div className="relative w-full border border-[#D9D4C6] rounded-md px-3 py-2 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-[30px] h-[30px] object-cover rounded"
                  />
                ) : (
                  <div className="w-[30px] h-[30px] border border-gray-300 rounded flex items-center justify-center text-gray-400">
                    <FaRegFileImage size={16} />
                  </div>
                )}
                <span className="text-gray-500 text-[14px]">
                  {formData.reference_file
                    ? formData.reference_file.name
                    : "Upload Reference File"}
                </span>
              </div>
              <label
                htmlFor="fileInput"
                className="cursor-pointer text-gray-500 hover:text-black"
              >
                <FaRegFileImage size={18} />
              </label>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Response Time */}
            <label className="text-[16px] font-semibold">
              Set Response Time
            </label>
            <div className="flex gap-2 mb-4">
              <Select
                options={hourOptions}
                placeholder="Select hour"
                onChange={(option) =>
                  handleSelectChange("response_hours", option)
                }
                className="w-1/2"
                components={{ IndicatorSeparator: () => null }}
              />
              <Select
                options={minuteOptions}
                placeholder="Select minute"
                onChange={(option) =>
                  handleSelectChange("response_minutes", option)
                }
                className="w-1/2"
                components={{ IndicatorSeparator: () => null }}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 h-[32px] flex items-center justify-center text-sm bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 h-[32px] flex items-center justify-center text-sm bg-blue-500 text-white rounded-md disabled:opacity-60"
              >
                {loading ? (
                  <RotatingLines
                    strokeColor="#fff"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="20"
                    visible={true}
                  />
                ) : (
                  "Assign"
                )}
              </button>
            </div>

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const TicketOverview = ({ ticket, fetchTicketDetails }) => {
  console.log("tickects:-", ticket);
  const [open, setOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("userData"));
  const [openChat, setOpenChat] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  // Fetch managers when modal opens
  useEffect(() => {
    if (open) {
      const fetchManagers = async () => {
        try {
          const res = await http.get("/users/managers", {
            params: payload, // <-- pass as query params
          });
          setManagers(res.data.data || []);
        } catch (err) {
          console.error("Error fetching managers:", err);
        }
      };
      fetchManagers();
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      await http.post("/chats", {
        user_id: user.id,
        ticket_id: ticket.id,
        sender: user.id,
        receiver: selectedManager.id,
        message: message,
        date_time: new Date().toISOString().slice(0, 19).replace("T", " "),
      });

      Swal.fire({
        icon: "success",
        title: "Message Sent",
        text: "Your message has been sent successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      setMessage("");
      setSelectedManager(null);
      setOpen(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response.data.message ||
          err.response.data.error ||
          "Failed to send message. Please try again.",
      });
      console.error("Error sending message:", err);
    }
  };

  const handleCloseChat = (refresh = false) => {
    setOpenChat(false);
    setSelectedTicketId(null);
    if (refresh) fetchTickets();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 bg-[#FFFFFF] min-h-screen ">
        {/* Left Main Section - 80% */}
        <div className="w-full  bg-[#F9F9F9] rounded-xl shadow-sm ">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
            <h2 className="text-base md:text-[16px] text-[#212529] font-bold">
              Activity Board
            </h2>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2 md:mt-0">
              {/* Document Icon */}
              {/* <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#707578] text-white hover:opacity-90 transition">
                <FaFileAlt size={16} />
              </button> */}
              {/* <UploadTicketDoc
                ticketId={ticket?.id}
                fetchTickets={fetchTicketDetails}
              /> */}
              {/* Chat Icon */}
              {/* {ticket?.response_mode?.toLowerCase() === "chat" && (
                <button
                  // onClick={() => setOpen(true)}
                  onClick={() => {
                    setSelectedTicketId(ticket?.id);
                    setOpenChat(true);
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#8FCAA1] text-white hover:opacity-90 transition"
                >
                  <FaCommentAlt size={16} />
                </button>
              )} */}

              <ChatModal
                open={openChat}
                onClose={(refresh) => handleCloseChat(refresh)}
                ticketId={selectedTicketId}
                user={user}
              />

              {/* Video + Call pill */}
              {/* <div className="flex items-center bg-[#09A7EA] rounded-full overflow-hidden">
                {ticket?.response_mode?.toLowerCase() === "video" && (
                  <button className="px-3 py-2 text-white flex items-center hover:bg-[#0c9dd9] transition">
                    <FaVideo size={15} />
                  </button>
                )}
                <div className="w-px bg-white h-5"></div>
                {ticket?.response_mode?.toLowerCase() === "call" && (
                  <button className="px-3 py-2 text-white flex items-center hover:bg-[#0c9dd9] transition">
                    <FaPhone size={15} />
                  </button>
                )}
              </div> */}

              {/* Take Photo */}
              {/* <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0A84FF] hover:bg-[#007AFF] text-white text-[13px] sm:text-[14px] font-medium rounded-full transition-all duration-200 w-full sm:w-auto">
                <FaCamera className="text-[14px]" />
                Take Photo/Upload
              </button> */}
              {/* <UploadTicketImage
                ticketId={ticket?.id}
                fetchTickets={fetchTicketDetails}
              /> */}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#CECECE]/40 py-2 flex gap-6 text-sm"></div>

          {/* Ticket Board */}
          <TicketBoard
            ticket={ticket}
            onClick={() => {
              setSelectedTicketId(ticket?.id);
              setOpenChat(true);
            }}
          />
        </div>
      </div>

      {/* MUI Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {!selectedManager ? (
            <>
              <Typography variant="h6" mb={2}>
                Select a Manager
              </Typography>
              <div className="space-y-2">
                {managers.map((manager) => (
                  <div key={manager.id} className="space-y-2">
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setSelectedManager(manager)}
                    >
                      {manager.full_name}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <Typography variant="h6" mb={2}>
                Message to {selectedManager.name}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-3 space-x-2">
                <Button
                  variant="outlined"
                  onClick={() => setSelectedManager(null)}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!message.trim()}
                >
                  Send
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

const UploadTicketImage = ({ ticketId, fetchTickets }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Open file picker (camera or gallery)
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Upload selected file
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("ticket_id", ticketId);
      formData.append("photo", file);

      const res = await http.post("/ticket-images/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (fetchTickets) await fetchTickets();

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleButtonClick}
        disabled={loading}
        className={`flex items-center justify-center gap-2 px-4 py-2 bg-[#0A84FF] hover:bg-[#007AFF] text-white text-[13px] sm:text-[14px] font-medium rounded-full transition-all duration-200 w-full sm:w-auto ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        <FaCamera className="text-[14px]" />
        {loading ? "Uploading..." : "Upload Photo"}
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        capture="environment" // opens camera on mobile
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

const UploadTicketDoc = ({ ticketId, fetchTickets }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Trigger hidden file input
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("ticket_id", ticketId);
      formData.append("upload_documents", file);

      // Post to Laravel API
      await http.post("/ticket-docs/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (fetchTickets) await fetchTickets();
      toast.success("📄 Document uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleButtonClick}
        disabled={loading}
        className={`w-9 h-9 flex items-center justify-center rounded-full bg-[#707578] text-white hover:opacity-90 transition ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        <FaFileAlt size={16} />
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv" // document formats
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

const TicketBoard = ({ ticket, onClick }) => {
  const [showPreview, setShowPreview] = useState(false);

  const documentUrl = ticket?.upload_documents
    ? `${baseURL}/${ticket?.upload_documents}`
    : null;

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return "N/A";
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return created.toLocaleDateString();
  };
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

  const [selectedDocument, setSelectedDocument] = useState(null);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* New Column */}
        <div className="md:border-r md:min-h-screen md:border-[#CECECE]/40 px-4">
          <h3 className="font-bold text-[#282D37] md:text-xs mb-2 mt-2">New</h3>

          {/* Static Title & Description */}
          <div className="h-[100vh] overflow-y-auto custom-scroll">
            <div className="bg-white rounded-[10px] shadow p-2 mb-3 w-full">
              {/* Title */}
              <h4 className="font-semibold text-[13px] text-[#212529] mb-1">
                Ticket Created to {ticket?.manufacturer || "N/A"}
              </h4>

              {/* Description */}
              <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      ticket.description?.split(" ").slice(0, 10).join(" ") +
                      "...",
                  }}
                />
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-[12px] text-gray-500">
                <div className="flex items-center gap-0.5">
                  <img
                    src="/clock.png"
                    alt=""
                    className="w-[13px] h-[13px] object-cover"
                  />
                  <span>{getTimeAgo(ticket?.created_at)}</span>
                </div>

                {/* Priority Badge */}
                <div className="flex gap-0.5 items-center">
                  <img
                    src="/priority.png"
                    alt=""
                    className="w-[13px] h-[13px] object-cover"
                  />
                  <span
                    className={`text-[11px] px-2 py-[2px] rounded-md font-medium capitalize ${getPriorityColor(
                      ticket.priority?.priority_name,
                    )}`}
                  >
                    {ticket.priority?.priority_name || "N/A"}
                  </span>
                </div>

                {/* Profile Avatar */}
                <img
                  src={ticket?.user?.company?.profile_pic || "/person.jpg"}
                  alt="User"
                  className="w-6 h-6 rounded-full object-cover"
                />
              </div>
            </div>

            <div className="bg-white rounded-[10px] shadow p-2 mb-3 w-full">
              {/* Title */}
              <h4 className="font-semibold text-[13px] text-[#212529] mb-1">
                SLA
              </h4>

              {/* Description */}
              <p className="text-[12px] text-gray-500  line-clamp-2">
                Complexity:&nbsp;
                <span className="font-semibold">
                  {ticket?.complexity?.priority_name || "N/A"}
                </span>
              </p>
              <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
                Response Time:&nbsp;
                <span className="font-semibold">
                  {ticket?.complexity?.days || "N/A"} days
                </span>
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-[12px] text-gray-500">
                <div className="flex items-center gap-0.5">
                  <img
                    src="/clock.png"
                    alt=""
                    className="w-[13px] h-[13px] object-cover"
                  />
                  <span>{getTimeAgo(ticket?.created_at)}</span>
                </div>

                {/* Priority Badge */}
                <div className="flex gap-0.5 items-center">
                  <img
                    src="/priority.png"
                    alt=""
                    className="w-[13px] h-[13px] object-cover"
                  />
                  <span
                    className={`text-[11px] px-2 py-[2px] rounded-md font-medium capitalize ${getPriorityColor(
                      ticket.complexity?.priority_name,
                    )}`}
                  >
                    {ticket.complexity?.priority_name || "N/A"}
                  </span>
                </div>

                {/* Profile Avatar */}
                <img
                  src={ticket?.user?.company?.profile_pic || "/person.jpg"}
                  alt="User"
                  className="w-6 h-6 rounded-full object-cover"
                />
              </div>
            </div>

            {ticket?.activities?.length > 0
              ? ticket?.activities.map((activity, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-[10px] shadow p-2 mb-3 w-full"
                  >
                    {/* Title */}
                    <h4 className="font-semibold text-[13px] text-[#212529] ">
                      {activity.title || "Activity"}
                    </h4>

                    {/* User Name */}
                    <span className="text-[13px] text-[#212529]  font-medium text-[#333]">
                      {activity?.user?.full_name || "Unknown User"}
                    </span>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-[12px] text-gray-500">
                      {/* Time */}
                      <div className="flex items-center gap-0.5">
                        <img
                          src="/clock.png"
                          alt="Clock"
                          className="w-[13px] h-[13px] object-cover"
                        />
                        <span>{getTimeAgo(activity?.created_at)}</span>
                      </div>

                      {/* User Info */}
                      <div className="flex items-center gap-2">
                        {/* User Avatar */}
                        <img
                          src={
                            activity?.user?.company?.profile_pic ||
                            "/person.jpg"
                          }
                          alt="User"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))
              : ""}
          </div>

          {/* Draggable Photo */}
          {/* {ticket?.pic_status === 0 && ticket?.photo && !pictureTicket && (
            <img
              src={`${baseURL}/${ticket.photo}`}
              alt="ticket"
              className="mt-2 w-full h-20 object-cover rounded cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, ticket)}
            />
          )} */}
        </div>

        <div className="border-r border-[#CECECE]/40 px-4 pl-4 md:pl-0">
          <>
            <h3 className="font-bold text-[#282D37] md:text-xs mb-2 mt-2">
              Documents
            </h3>

            <div className="h-[100vh] overflow-y-auto custom-scroll">
              {/* basic info */}
              <div className="bg-white rounded-[10px] shadow p-2 mb-3 w-full">
                {/* Title */}
                <h4 className="font-semibold text-[13px] text-[#212529] mb-1">
                  Basic Information
                </h4>
                <p className="text-[12px] text-gray-500 line-clamp-2">
                  Plant Name: {ticket?.plant_name || "N/A"}
                </p>
                {/* Description */}
                <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
                  Category: {ticket?.category || "N/A"}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-[12px] text-gray-500">
                  <div className="flex items-center gap-0.5">
                    <img
                      src="/clock.png"
                      alt=""
                      className="w-[13px] h-[13px] object-cover"
                    />
                    <span>{getTimeAgo(ticket?.created_at)}</span>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex gap-0.5 items-center">
                    <img
                      src="/priority.png"
                      alt=""
                      className="w-[13px] h-[13px] object-cover"
                    />
                    <span
                      className={`text-[11px] px-2 py-[2px] rounded-md font-medium capitalize ${getPriorityColor(
                        ticket.priority?.priority_name,
                      )}`}
                    >
                      {ticket.priority?.priority_name || "N/A"}
                    </span>
                  </div>

                  {/* Profile Avatar */}
                  <img
                    src={ticket?.user?.company?.profile_pic || "/person.jpg"}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </div>
              </div>

              {/* equipment info */}
              {ticket?.category == "Machine Breakdown" && (
                <div className="bg-white rounded-[10px] shadow p-2 mb-3 w-full">
                  {/* Title */}
                  <h4 className="font-semibold text-[13px] text-[#212529] mb-1">
                    Equipment Info
                  </h4>
                  <p className="text-[12px] text-gray-500 line-clamp-2">
                    Equipment: {ticket?.equipment || "N/A"}
                  </p>
                  {/* Description */}
                  <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
                    Model :{ticket?.model_number || "N/A"}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[12px] text-gray-500">
                    <div className="flex items-center gap-0.5">
                      <img
                        src="/clock.png"
                        alt=""
                        className="w-[13px] h-[13px] object-cover"
                      />
                      <span>{getTimeAgo(ticket?.created_at)}</span>
                    </div>

                    {/* Priority Badge */}
                    <div className="flex gap-0.5 items-center">
                      <img
                        src="/priority.png"
                        alt=""
                        className="w-[13px] h-[13px] object-cover"
                      />
                      <span
                        className={`text-[11px] px-2 py-[2px] rounded-md font-medium capitalize ${getPriorityColor(
                          ticket.priority?.priority_name,
                        )}`}
                      >
                        {ticket.priority?.priority_name || "N/A"}
                      </span>
                    </div>

                    {/* Profile Avatar */}
                    <img
                      src={ticket?.user?.company?.profile_pic || "/person.jpg"}
                      alt="User"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* service info */}
              {ticket?.category == "Service Breakdown" && (
                <div className="bg-white rounded-[10px] shadow p-2 mb-3 w-full">
                  {/* Title */}
                  <h4 className="font-semibold text-[13px] text-[#212529] mb-1">
                    Service Information
                  </h4>
                  <p className="text-[12px] text-gray-500  line-clamp-2">
                    Provider: {ticket?.service_provider || "N/A"}
                  </p>
                  {/* Description */}
                  <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
                    Manufacturer :{ticket?.manufacturer || "N/A"}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[12px] text-gray-500">
                    <div className="flex items-center gap-0.5">
                      <img
                        src="/clock.png"
                        alt=""
                        className="w-[13px] h-[13px] object-cover"
                      />
                      <span>{getTimeAgo(ticket?.created_at)}</span>
                    </div>

                    {/* Priority Badge */}
                    <div className="flex gap-0.5 items-center">
                      <img
                        src="/priority.png"
                        alt=""
                        className="w-[13px] h-[13px] object-cover"
                      />
                      <span
                        className={`text-[11px] px-2 py-[2px] rounded-md font-medium capitalize ${getPriorityColor(
                          ticket.priority?.priority_name,
                        )}`}
                      >
                        {ticket.priority?.priority_name || "N/A"}
                      </span>
                    </div>

                    {/* Profile Avatar */}
                    <img
                      src={ticket?.user?.company?.profile_pic || "/person.jpg"}
                      alt="User"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* support info */}
              <div className="bg-white rounded-[10px] shadow p-2 mb-3 w-full">
                {/* Title */}
                <h4 className="font-semibold text-[13px] text-[#212529] mb-1">
                  Support
                </h4>
                <p className="text-[12px] text-gray-500  line-clamp-2">
                  Installation Support:{" "}
                  {ticket?.need_product_installation_support
                    ? ticket.need_product_installation_support
                        .charAt(0)
                        .toUpperCase() +
                      ticket.need_product_installation_support.slice(1)
                    : "N/A"}
                </p>
                {/* Description */}
                <p className="text-[12px] text-gray-500 mb-3 line-clamp-2">
                  Implementation Support :
                  {ticket?.need_service_implementation_support
                    ? ticket.need_service_implementation_support
                        .charAt(0)
                        .toUpperCase() +
                      ticket.need_service_implementation_support.slice(1)
                    : "N/A"}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-[12px] text-gray-500">
                  <div className="flex items-center gap-0.5">
                    <img
                      src="/clock.png"
                      alt=""
                      className="w-[13px] h-[13px] object-cover"
                    />
                    <span>{getTimeAgo(ticket?.created_at)}</span>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex gap-0.5 items-center">
                    <img
                      src="/priority.png"
                      alt=""
                      className="w-[13px] h-[13px] object-cover"
                    />
                    <span
                      className={`text-[11px] px-2 py-[2px] rounded-md font-medium capitalize ${getPriorityColor(
                        ticket.priority?.priority_name,
                      )}`}
                    >
                      {ticket.priority?.priority_name || "N/A"}
                    </span>
                  </div>

                  {/* Profile Avatar */}
                  <img
                    src={ticket?.user?.company?.profile_pic || "/person.jpg"}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </div>
              </div>

              <div>
                {ticket?.documents && ticket?.documents.length > 0 ? (
                  ticket?.documents.map((doc, i) => {
                    const documentUrl = `${baseURL}/${doc.upload_documents}`;
                    return (
                      <div
                        key={i}
                        className="bg-white rounded-xl mb-3 shadow p-2 min-h-20 flex flex-col"
                      >
                        <button
                          onClick={() => {
                            setSelectedDocument(documentUrl);
                            setShowPreview(true);
                          }}
                          className="text-blue-600 underline mb-4 text-sm truncate"
                        >
                          {doc.upload_documents.split("/").pop()}
                        </button>
                        <div className="flex items-center justify-between text-[12px] text-gray-500">
                          <div className="flex items-center gap-0.5">
                            <img
                              src="/clock.png"
                              alt=""
                              className="w-[13px] h-[13px] object-cover"
                            />
                            <span>{getTimeAgo(ticket?.created_at)}</span>
                          </div>

                          {/* Profile Avatar */}
                          <img
                            src={
                              ticket?.user?.company?.profile_pic ||
                              "/person.jpg"
                            }
                            alt="User"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-sm">No document uploaded</p>
                )}
              </div>
            </div>
            {/* Popup Modal */}
            {showPreview && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-white w-[90%] md:w-[70%] h-[80vh] rounded-xl shadow-lg relative">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="absolute top-1 right-2 text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>

                  <iframe
                    src={selectedDocument}
                    title="Document Preview"
                    className="w-full h-full rounded-b-xl"
                  />
                </div>
              </div>
            )}
          </>
        </div>

        {/* Calling Column */}
        <div className="border-[#CECECE]/40 border-r pr-4 pl-4 md:pl-0">
          <h3 className="font-bold text-[#282D37] md:text-xs mb-2 mt-2">
            {/* {ticket?.response_mode?.toLowerCase() === "chat" && "Chat"}
            {ticket?.response_mode?.toLowerCase() === "video" && "Video Call"}
            {!ticket?.response_mode && "Calling"} */}
            Communication
          </h3>
          {/* <div className="bg-white rounded-xl shadow p-6 h-20"></div> */}
          <div className="h-[100vh] overflow-y-auto custom-scroll">
            {ticket?.chats?.map((chat) => (
              <div
                key={chat.id}
                className="bg-white rounded-[10px] shadow p-2 mb-3 w-full"
                onClick={onClick}
              >
                {/* Title */}
                <h4 className="font-semibold flex items-center gap-1 text-[13px] text-[#212529] mb-1">
                  <img
                    src="/chaticon.png"
                    alt=""
                    className="w-[11px] h-[11px]"
                  />
                  Chat
                </h4>
                <p className="text-[12px] text-gray-500 mb-2 line-clamp-2">
                  <p className="text-gray-700">{chat?.message}</p>
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-[12px] text-gray-500">
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <img
                      src="/calender.png"
                      alt=""
                      className="w-[11px] h-[11px]"
                    />
                    <span className="text-[12px] text-gray-500">
                      {new Date(chat.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Profile Avatar */}
                  <img
                    src={
                      chat?.sender_user?.company?.profile_pic || "/person.jpg"
                    }
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pictures Column */}
        <div className="pr-4 pl-4 md:pl-0 mb-2">
          <h3 className="font-bold text-[#282D37] md:text-xs mb-2 mt-2">
            Pictures
          </h3>
          {/* <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="min-h-[200px] bg-white rounded-xl shadow p-4 flex items-center justify-center"
                  >
                    {pictureTicket && pictureTicket.photo ? (
                      <img
                        src={`${baseURL}/${pictureTicket.photo}`}
                        alt="dropped"
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <p className="text-gray-400 text-xs">Drag photos here</p>
                    )}
                  </div> */}
          <div className="h-[100vh] overflow-y-auto custom-scroll">
            {ticket.images && ticket.images.length > 0 ? (
              ticket.images.map((img, i) => (
                <>
                  <div
                    key={i}
                    className="min-h-[110px] bg-white rounded-xl shadow p-2 mb-2 flex flex-col"
                  >
                    <div className="flex items-center justify-center">
                      <img
                        src={`${baseURL}/${img.photo}`}
                        alt={`ticket-${i}`}
                        className="w-20 h-20 mb-2 object-cover rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[12px] text-gray-500">
                      <div className="flex items-center gap-0.5">
                        <img
                          src="/clock.png"
                          alt=""
                          className="w-[13px] h-[13px] object-cover"
                        />
                        <span>{getTimeAgo(img?.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <img
                          src="/calender.png"
                          alt=""
                          className="w-[11px] h-[11px]"
                        />
                        <span className="text-[12px] text-gray-500">
                          {new Date(img.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                            },
                          )}
                        </span>
                      </div>

                      {/* Profile Avatar */}
                      <img
                        src={
                          ticket?.user?.company?.profile_pic || "/person.jpg"
                        }
                        alt="User"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    </div>
                  </div>
                </>
              ))
            ) : (
              <p className="text-gray-400">No image available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatModal = ({ open, onClose, ticketId, user }) => {
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch chats when modal opens and ticketId changes
  useEffect(() => {
    if (open && ticketId) {
      handleViewChats(ticketId);
    }
  }, [open, ticketId]);

  const handleViewChats = async (id) => {
    try {
      setLoadingChats(true);
      const res = await http.get(`/chats/ticket/${id}`);
      if (res.data.status) {
        setChats(res.data.data);
        console.log("respose data:-", res.data.data);
      } else {
        setChats([]);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
      setChats([]);
    } finally {
      setLoadingChats(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      if (!message.trim()) return;
      await http.post("/chats", {
        user_id: user.id,
        ticket_id: ticketId,
        sender: user.id,
        receiver: null,
        message: message,
        date_time: new Date().toISOString().slice(0, 19).replace("T", " "),
      });

      // Swal.fire({
      //   icon: "success",
      //   title: "Message Sent",
      //   text: "Your message has been sent successfully.",
      //   timer: 2000,
      //   showConfirmButton: false,
      // });
      setMessage("");
      handleViewChats(ticketId);
    } catch (err) {
      // Swal.fire({
      //   icon: "error",
      //   title: "Error",
      //   text:
      //     err.response.data.message ||
      //     err.response.data.error ||
      //     "Failed to send message. Please try again.",
      // });
      console.error("Error sending message:", err);
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#fff",
          borderRadius: 4,
          width: 500,
          maxWidth: "95%",
          boxShadow: 24,
          outline: "none",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2 className="text-[16px] font-semibold m-0">Communication</h2>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <IconButton color="primary" size="small">
              <Videocam />
            </IconButton>
            <IconButton color="primary" size="small">
              <Call />
            </IconButton> */}
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </Box>

        {/* Chat Body */}
        <Box
          sx={{
            backgroundColor: "#F5F7FB",
            maxHeight: "450px",
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {loadingChats ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={30} />
            </Box>
          ) : chats.length > 0 ? (
            chats.map((chat) => {
              const isSender = chat.sender === user.id;
              const senderName = chat.sender_user?.full_name || "Unknown";
              return (
                <Box
                  key={chat.id}
                  sx={{
                    display: "flex",
                    justifyContent: isSender ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: 1,
                  }}
                >
                  {!isSender && (
                    <Avatar
                      src={chat.sender_user?.company?.profile_pic} // Set a default image URL if the profile_pic is null.}
                      sx={{ width: 30, height: 30 }}
                    />
                  )}
                  <Box
                    sx={{
                      maxWidth: "70%",
                      bgcolor: isSender ? "#1976d2" : "#E5E7EB",
                      color: isSender ? "#fff" : "#111827",
                      borderRadius: 2,
                      borderBottomRightRadius: isSender ? 0 : 8,
                      borderBottomLeftRadius: !isSender ? 0 : 8,
                      p: 1.5,

                      // ✅ Add these 3 lines:
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <Box sx={{ fontSize: 12, fontWeight: 500, mb: 0.5 }}>
                      {isSender ? "You" : senderName}
                    </Box>
                    <Box sx={{ fontSize: 14 }}>{chat.message}</Box>
                    <Box
                      sx={{
                        fontSize: 11,
                        textAlign: "right",
                        color: isSender ? "#d1d5db" : "#6b7280",
                        mt: 0.5,
                      }}
                    >
                      {new Date(chat.date_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Box>
                  </Box>
                  {isSender && (
                    <Avatar
                      src={chat.sender_user?.company?.profile_pic}
                      sx={{ width: 30, height: 30 }}
                    />
                  )}
                </Box>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4 m-0">
              No chats found.
            </p>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: "#F5F7FB",

            p: 2,
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              position: "relative",
              bgcolor: "#fff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              px: 1.5,
              py: 0.5,
              boxShadow: "0 0 2px rgba(0,0,0,0.1)",
            }}
          >
            <input
              type="text"
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "14px",
                background: "transparent",
              }}
            />
            <IconButton
              onClick={handleSend}
              size="small"
              sx={{
                bgcolor: "#D1F2E5",
                color: "#1E8E5F",
                p: "6px",
                borderRadius: "8px",
                "&:hover": { bgcolor: "#BFF0D8" },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{ width: 18, height: 18 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75l16.5 7.5-16.5 7.5L7.5 12l-3.75-8.25z"
                />
              </svg>
            </IconButton>
          </Box>
        </Box>
        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            p: 2,
            borderTop: "1px solid #e5e7eb",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "10px",

              px: 3,
              bgcolor: "#007bff",
              "&:hover": { bgcolor: "#006ae6" },
            }}
            onClick={onClose}
          >
            Add Card
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const TicketRemarksTab = ({ ticketId }) => {
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const user = JSON.parse(localStorage.getItem("userData"));

  /* ================= FETCH ================= */
  const fetchRemarks = async () => {
    if (!ticketId) return;

    setLoading(true);
    try {
      const res = await http.get(`/tickets/${ticketId}/remarks`);
      if (res.data.status) setRemarks(res.data.data);
    } catch {
      toast.error("Failed to load remarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemarks();
  }, [ticketId]);

  /* ================= ADD ================= */
  const addRemark = async () => {
    if (!text.trim()) return;

    try {
      const res = await http.post("/ticket-remarks", {
        ticket_id: ticketId,
        user_id: user?.id,
        description: text,
      });

      if (res.data.status) {
        setText("");
        fetchRemarks();
      }
    } catch {
      toast.error("Failed to add remark");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 mt-4 max-h-[400px] overflow-y-auto">
      {/* TITLE */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Remarks</h3>
      </div>

      {/* ADD BOX */}
      <div className="flex gap-2 mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write remark..."
          rows={2}
          className="flex-1 border rounded-lg px-3 py-2"
        />

        <button
          onClick={addRemark}
          className="bg-[#0088FF] h-10 text-white px-5 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="flex justify-center py-4">
          <RotatingLines width="20" />
        </div>
      ) : remarks.length === 0 ? (
        <div className="text-gray-500 text-sm">No remarks yet</div>
      ) : (
        <div className="space-y-3">
          {remarks.map((r) => (
            <div
              key={r.id}
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
            >
              <div className="flex justify-between text-sm mb-1">
                <div className="font-medium">{r.user?.full_name || "User"}</div>
                <div className="text-gray-500">
                  {new Date(r.created_at).toLocaleString()}
                </div>
              </div>

              <div className="text-gray-700 text-sm">{r.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
