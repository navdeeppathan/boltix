import React, { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import { RotatingLines } from "react-loader-spinner";
import http from "../service/http";

// Card component for each ticket
const PendingApprovalCard = ({ ticket }) => {
  const companyName = ticket?.user?.company?.company_name || "N/A";
  const ticketName = ticket?.ticket_title || "Untitled Ticket";
  const category = ticket?.category || "No category";
  const priority = ticket?.priority?.priority_name || "Normal";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl mx-auto">
      {/* Left: Ticket Info */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="bg-red-100 p-3 rounded-full">
          <img
            src={ticket?.user?.company?.profile_pic}
            alt=""
            className="w-[22px] h-[22px] rounded-full"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800 leading-tight">
            {ticketName}
          </p>
          <p className="text-sm text-gray-600 leading-tight">{category}</p>
          <p className="text-xs text-gray-500 mt-1">Priority: {priority}</p>
        </div>
      </div>

      {/* Middle: Timeline */}
      <div className="flex-1 flex flex-col items-center justify-center mt-4 sm:mt-0">
        <p className="text-sm text-gray-500 mb-2 font-medium">Ticket</p>

        {/* Wrapper keeps everything in one row & scrollable on small screens */}
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-center whitespace-nowrap min-w-[200px] sm:min-w-[300px] md:min-w-[400px] relative">
            {(() => {
              const approvalLevel = ticket?.user?.company?.approval_level || 0;
              const showStart = ticket?.stage === 1;

              const steps = [
                {
                  label: ticket?.user?.company?.company_name || "Company",
                  type: "company",
                  size: 6,
                },
                ...Array.from({ length: approvalLevel }, (_, i) => ({
                  label: `Level ${i + 1}`,
                  type: "level",
                  size: 5,
                })),
              ];

              if (showStart) {
                steps.push({ label: "Start", type: "start", size: 3 });
              }

              return steps.map((step, index, array) => (
                <React.Fragment key={index}>
                  {/* Step Circle */}
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`rounded-full flex items-center justify-center ${
                        step.type === "company" ? "border-4" : ""
                      }`}
                      style={{
                        width: `${step.size * 4}px`,
                        height: `${step.size * 4}px`,
                        backgroundColor:
                          step.type === "level" || step.type === "start"
                            ? "#1976D2"
                            : step.type === "company"
                            ? "#FFF"
                            : "#E0E0E0",
                        borderColor:
                          step.type === "company" ? "#1976D2" : "transparent",
                      }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-1">
                      {step.label}
                    </span>
                  </div>

                  {/* Dotted Line (except last item) */}
                  {index < array.length - 1 && (
                    <div className="flex-1 border-t border-dashed border-gray-300 mx-2 relative"></div>
                  )}
                </React.Fragment>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Right: SLA Info */}
      <div className="text-right min-w-[200px] mt-4 sm:mt-0">
        <p className="font-medium text-gray-800 text-sm">Ticket SLA</p>
        <p className="text-sm text-gray-600 leading-tight">
          Response within {ticket?.priority?.days} days
        </p>
      </div>
    </div>
  );
};

// Main Component
export default function PendingApproval() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("userData"));
  const user_id = user?.id;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await http.get(`/tickets/user/${user_id}`);
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

    if (user_id) fetchTickets();
  }, [user_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {tickets.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No pending approval tickets found.
        </p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket, i) => (
            <PendingApprovalCard key={i} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
