// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaTicketAlt,
  FaComments,
  FaBell,
  FaUserCog,
  FaSignOutAlt,
  FaHourglass,
  FaChevronDown,
  FaUsers,
  FaClipboardList,
  FaFolderOpen,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaUndoAlt,
} from "react-icons/fa";
const Sidebar = ({ isOpen, setIsOpen }) => {
  const linkClasses =
    "flex items-center gap-3 p-2 text-sm rounded-lg hover:bg-gray-700 transition";
  const activeClasses = "bg-white text-sm text-black font-semibold shadow";

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const parentClasses =
    "flex items-center justify-between text-sm p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition";

  const childClasses =
    "flex items-center gap-2 p-2 text-sm bg-gray-700 rounded-lg text-xs hover:bg-gray-400 transition";

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-[#212529]/50 bg-opacity-40 z-40 lg:hidden transition ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#212529] text-[#FFFFFF] flex flex-col z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-center py-2">
          <img src="/logo.png" alt="" className="w-[126.99px] h-[75px]" />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-4">
          <NavLink
            to="/dashboard/home"
            end
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaTachometerAlt /> Dashboard
          </NavLink>

          {/* ================= Customers ================= */}
          <div>
            <div
              className={parentClasses}
              onClick={() => toggleMenu("tickets")}
            >
              <div className="flex items-center gap-3">
                <FaTicketAlt />
                <span>Tickets</span>
              </div>
              <FaChevronDown
                size={10}
                className={`transition-transform ${
                  openMenu === "tickets" ? "rotate-180" : ""
                }`}
              />
            </div>

            {openMenu === "tickets" && (
              <div className="mt-1 space-y-1">
                <NavLink
                  to="/dashboard/pending-tickets"
                  className={({ isActive }) =>
                    isActive ? `${childClasses} ${activeClasses}` : childClasses
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span className="px-6 ">
                    {/* <FaHourglassHalf className="text-yellow-400" /> */}
                    Pending For Approval
                  </span>
                </NavLink>
                <NavLink
                  to="/dashboard/approved-tickets"
                  className={({ isActive }) =>
                    isActive ? `${childClasses} ${activeClasses}` : childClasses
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span className="px-6 ">
                    {/* <FaHourglassHalf className="text-yellow-400" /> */}
                    Approved Tickets
                  </span>
                </NavLink>
                <NavLink
                  to="/dashboard/tickets"
                  className={({ isActive }) =>
                    isActive ? `${childClasses} ${activeClasses}` : childClasses
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span className="px-6 ">
                    {/* <FaFolderOpen className="text-blue-400" /> */}
                    All Open Tickets
                  </span>
                </NavLink>

                <NavLink
                  to="/dashboard/returned-tickets"
                  className={({ isActive }) =>
                    isActive ? `${childClasses} ${activeClasses}` : childClasses
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span className="px-6 ">
                    {/* <FaUndoAlt className="text-purple-400" /> */}
                    Returned Tickets
                  </span>
                </NavLink>

                <NavLink
                  to="/dashboard/closed-tickets"
                  className={({ isActive }) =>
                    isActive ? `${childClasses} ${activeClasses}` : childClasses
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span className="px-6 ">
                    {/* <FaCheckCircle className="text-green-400" /> */}
                    Closed Tickets
                  </span>
                </NavLink>

                <NavLink
                  to="/dashboard/rejected-tickets"
                  className={({ isActive }) =>
                    isActive ? `${childClasses} ${activeClasses}` : childClasses
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span className="px-6 ">
                    {/* <FaTimesCircle className="text-red-400" /> */}
                    Rejected Tickets
                  </span>
                </NavLink>
              </div>
            )}
          </div>

          {/* <NavLink
            to="/dashboard/tickets"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaTicketAlt /> Open Tickets
          </NavLink> */}

          {/* <NavLink
            to="/dashboard/pending-tickets"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaTicketAlt /> Pending For Approval
          </NavLink> */}
          {/* <NavLink
            to="/dashboard/closed-tickets"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaTicketAlt /> Closed Tickets
          </NavLink> */}

          {/* <NavLink
            to="/dashboard/rejected-tickets"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaTicketAlt /> Rejected Tickets
          </NavLink> */}

          {/* <NavLink
            to="/dashboard/returned-tickets"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaTicketAlt /> Returned Tickets
          </NavLink> */}

          <NavLink
            to="/dashboard/communication"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaComments /> Communication
          </NavLink>
          <NavLink
            to="/dashboard/notifications"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaBell /> Notifications
          </NavLink>
          <NavLink
            to="/dashboard/plant-profile"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaUserCog /> Profile & Settings
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

const UserCard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    console.log(storedData);
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  if (!userData) {
    return <div>Loading...</div>; // or return null to render nothing until data is loaded
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4 w-[90%] mx-auto mb-6 flex flex-col items-center">
      {/* Role / Designation */}
      <p className="text-sm text-[#212529] text-[16px] font-bold mb-4 self-start">
        {userData.company?.designation || "N/A"}
      </p>

      {/* Profile Image */}
      <img
        src="https://i.pravatar.cc/100"
        alt="user"
        className="w-16 h-16 rounded-full mb-2 object-cover"
      />

      {/* Email */}
      <p className="text-sm text-[16px] font-bold text-[#212529]">
        {userData.email || "User email not available"}
      </p>

      {/* Company Name */}
      <p className="text-sm text-[#666] text-[14px] mt-1">
        {userData.company?.company_name || "Company name not available"}
      </p>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        className="mt-10 px-4 py-2 bg-[#D9D9D9]/20 rounded-[30px] flex items-center text-[16px] font-semibold justify-center gap-2 text-[#212529] hover:bg-gray-200 transition text-sm"
      >
        <FaSignOutAlt className="text-gray-600" /> Logout
      </button>
    </div>
  );
};
