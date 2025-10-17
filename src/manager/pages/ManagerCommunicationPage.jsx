import { useEffect, useState } from "react";
import axios from "axios";

import { CircularProgress } from "@mui/material";
import http from "../../service/http";
import { RotatingLines } from "react-loader-spinner";

const ManagerCommunicationPage = () => {
  const userId = JSON.parse(localStorage.getItem("userData"))?.id;

  // if (loading)
  //   return (
  //     <div className="flex items-center justify-center ">
  //       <>
  //         <CircularProgress size={20} color="inherit" />
  //         Loadin...
  //       </>
  //     </div>
  //   );
  return (
    <>
      <TicketChat />
    </>
  );
};

function TicketChat() {
  const [tickets, setTickets] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingChats, setLoadingChats] = useState(false);
  const user = JSON.parse(localStorage.getItem("userData"));

  // Replace with the current logged-in user ID

  // Fetch all tickets
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await http.get(`/tickets`); // Your ticket list API
      if (res.data.status && Array.isArray(res.data.data)) {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  // Fetch chats for a ticket when clicked
  const handleViewChats = async (ticketId) => {
    try {
      setSelectedTicketId(ticketId);
      setLoadingChats(true);
      const res = await http.get(`/chats/ticket/${ticketId}`);
      if (res.data.status) {
        setChats(res.data.data); // Chats for the selected ticket
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

  return (
    <div className=" space-y-6">
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>

      {/* Ticket Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loadingTickets ? (
          <div className="flex items-center justify-center ">
            <>
              {/* <CircularProgress size={20} color="inherit" /> */}
              <RotatingLines
                strokeColor="#1E1E1E"
                strokeWidth="5"
                animationDuration="0.75"
                width="20"
                visible={true}
              />
            </>
          </div>
        ) : tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`bg-white shadow-md rounded-xl p-4 border cursor-pointer flex flex-col justify-between ${
                selectedTicketId === ticket.id
                  ? "border-blue-500"
                  : "border-gray-200"
              }`}
              onClick={() => handleViewChats(ticket.id)}
            >
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {ticket.ticket_title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {ticket.description || "No description available."}
                </p>
              </div>

              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-all">
                View Chats
              </button>
            </div>
          ))
        )}
      </div>

      {/* Chat Section */}
      {selectedTicketId && (
        <div className="p-6 bg-[#F9F9F9] rounded-xl shadow-md mt-6 max-h-[500px] overflow-y-auto chat-scroll">
          <h2 className="text-xl font-semibold mb-4">Chats</h2>

          {loadingChats ? (
            <p>Loading chats...</p>
          ) : chats.length > 0 ? (
            <div className="space-y-4">
              {chats.map((chat) => {
                const isSender = chat.sender === user.id;
                const senderName = chat.sender_user?.full_name || "Unknown";

                return (
                  <div
                    key={chat.id}
                    className={`flex ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                        isSender
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">
                        {isSender ? "You" : senderName}
                      </p>
                      <p className="text-sm">{chat.message}</p>
                      <p
                        className={`text-xs ${
                          isSender ? "text-gray-300" : "text-gray-600"
                        } mt-1 text-right`}
                      >
                        {new Date(chat.date_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No chats found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ManagerCommunicationPage;
