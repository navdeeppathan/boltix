import { useEffect, useRef, useState } from "react";

const TicketHistoryPopup = ({ approvals }) => {
  console.log("approvals", approvals);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine message alignment (chat-like)
  const determineSides = (approvals) => {
    if (!approvals || approvals.length === 0) return [];

    let sides = [];
    let lastUserId = null;
    let currentSide = "left"; // start left

    approvals.forEach((a, i) => {
      if (a.user?.id !== lastUserId && lastUserId !== null) {
        currentSide = currentSide === "left" ? "right" : "left";
      }
      sides.push(currentSide);
      lastUserId = a.user?.id;
    });

    return sides;
  };

  const messageSides = determineSides(approvals);

  return (
    <div className="relative" ref={popupRef}>
      {/* History Button */}
      <div className="flex justify-end mb-1">
        <button
          onClick={() => {
            setShowPopup(!showPopup);
          }}
          className="flex items-center gap-1 text-sm text-[#282D37] cursor-pointer hover:underline hover:text-[#0088FF] transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-[#282D37] hover:text-[#0088FF] transition-all duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          History
        </button>
      </div>

      {/* Popup Box */}
      {showPopup && (
        <div className="absolute right-0 mt-2 w-[380px]  max-h-[420px] bg-white shadow-2xl rounded-2xl border border-gray-200 p-4 z-50">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-3">
            <h3 className="text-base font-semibold text-[#212529]">
              Approval History
            </h3>
            <button
              onClick={() => setShowPopup(false)}
              className="text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}

          <div className="space-y-4 max-h-[340px] overflow-y-auto px-1 custom-scroll ">
            {/* {approvals?.length ? (
              approvals.map((approval, index) => {
                const side = messageSides[index];
                const isRight = side === "right";
                const userName = approval.user?.full_name || "User";
                const userImage = approval.user?.company?.profile_pic || null;
                const initials = userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={approval.id}
                    className={`flex ${
                      isRight ? "justify-end" : "justify-start"
                    }`}
                  >
                    
                    {!isRight && (
                      <div className="flex flex-col items-center mr-2">
                        {userImage ? (
                          <img
                            src={userImage}
                            alt={userName}
                            className="w-8 h-8 rounded-full object-cover border border-gray-300"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                            {initials}
                          </div>
                        )}
                      </div>
                    )}

                    
                    <div
                      className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm relative ${
                        isRight
                          ? "bg-[#D9FDD3] text-gray-800 rounded-tr-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                      }`}
                    >
                    
                      <div className="font-semibold text-xs mb-1 text-[#128C7E]">
                        {userName}
                      </div>

                      
                      <div
                        className="text-[13px] leading-snug break-words"
                        dangerouslySetInnerHTML={{
                          __html: approval.description || "",
                        }}
                      />

                      
                      <div className="text-[10px] mt-3 flex justify-end items-center gap-1">
                        <span
                          className={`font-medium ${
                            approval.action_label?.toLowerCase() === "approved"
                              ? "text-[#0088FF]"
                              : approval.action_label?.toLowerCase() ===
                                "rejected"
                              ? "text-[#FF0000]"
                              : approval.action_label?.toLowerCase() ===
                                "returned"
                              ? "text-[#EAB308]"
                              : "text-gray-500"
                          }`}
                        >
                          {approval.action_label}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">
                          {new Date(approval.created_at).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    
                    {isRight && (
                      <div className="flex flex-col items-center ml-2">
                        {userImage ? (
                          <img
                            src={userImage}
                            alt={userName}
                            className="w-8 h-8 rounded-full object-cover border border-gray-300"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#D9FDD3] flex items-center justify-center text-xs font-semibold text-[#128C7E]">
                            {initials}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No history found
              </p>
            )} */}
            {approvals?.length ? (
              approvals
                .filter(
                  (a) =>
                    !["Approved", "Return", "Returned"].includes(a.action_label)
                )
                .map((approval, index) => {
                  const side = messageSides[index];
                  const isRight = side === "right";
                  const userName = approval.user?.full_name || "User";
                  const userImage = approval.user?.company?.profile_pic || null;
                  const initials = userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <div
                      key={approval.id}
                      className={`flex ${
                        isRight ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Left Avatar */}
                      {!isRight && (
                        <div className="flex flex-col items-center mr-2">
                          {userImage ? (
                            <img
                              src={userImage}
                              alt={userName}
                              className="w-8 h-8 rounded-full object-cover border border-gray-300"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                              {initials}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm relative ${
                          isRight
                            ? "bg-[#D9FDD3] text-gray-800 rounded-tr-none"
                            : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                        }`}
                      >
                        <div className="font-semibold text-xs mb-1 text-[#128C7E]">
                          {userName}
                        </div>

                        <div
                          className="text-[13px] leading-snug break-words"
                          dangerouslySetInnerHTML={{
                            __html: approval.description || "",
                          }}
                        />

                        <div className="text-[10px] mt-3 flex justify-end items-center gap-1">
                          <span
                            className={`font-medium ${
                              approval.action_label?.toLowerCase() ===
                              "approved"
                                ? "text-[#0088FF]"
                                : approval.action_label?.toLowerCase() ===
                                  "rejected"
                                ? "text-[#FF0000]"
                                : approval.action_label?.toLowerCase() ===
                                  "returned"
                                ? "text-[#EAB308]"
                                : "text-gray-500"
                            }`}
                          >
                            {approval.action_label}
                          </span>

                          <span className="text-gray-400">•</span>

                          <span className="text-gray-500">
                            {new Date(approval.created_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Right Avatar */}
                      {isRight && (
                        <div className="flex flex-col items-center ml-2">
                          {userImage ? (
                            <img
                              src={userImage}
                              alt={userName}
                              className="w-8 h-8 rounded-full object-cover border border-gray-300"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#D9FDD3] flex items-center justify-center text-xs font-semibold text-[#128C7E]">
                              {initials}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No history found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketHistoryPopup;
