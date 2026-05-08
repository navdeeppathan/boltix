// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTicketAlt,
  FaComments,
  FaBell,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { LogOut } from "lucide-react";
const TechnicianSidebar = ({ isOpen, setIsOpen }) => {
  const linkClasses =
    "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition";
  const activeClasses = "bg-white text-black font-semibold shadow";

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));

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
            to="/technician/dashboard/home"
            end
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaTachometerAlt /> Dashboard
          </NavLink>
          <NavLink
            to="/technician/dashboard/tickets"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaTicketAlt /> My Tickets
          </NavLink>
          <NavLink
            to="/technician/dashboard/communication"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaComments /> Communication
          </NavLink>
          <NavLink
            to="/technician/dashboard/notifications"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaBell /> Notifications
          </NavLink>

          <NavLink
            to="/technician/dashboard/profile"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaUserCog /> Profile & Settings
          </NavLink>
        </nav>
        {/* User Profile */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-semibold">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.full_name}</p>
              <p className="text-xs text-gray-400">{user.role?.display_name}</p>
            </div>
            {/* <ChevronDown size={16} className="text-gray-400" /> */}
            <div className="relative group">
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                className="p-2 text-white cursor-pointer hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <LogOut size={20} />
              </button>

              {/* Tooltip */}
              <span
                className="absolute left-1/2 -translate-x-1/2 top-10 whitespace-nowrap 
                            bg-gray-100 text-black text-xs px-2 py-1 rounded opacity-0 
                            group-hover:opacity-100 transition pointer-events-none"
              >
                Logout
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TechnicianSidebar;

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
          // window.location.reload();
          window.location.href = "/login";
        }}
        className="mt-10 px-4 py-2 bg-[#D9D9D9]/20 rounded-[30px] flex items-center text-[16px] font-semibold justify-center gap-2 text-[#212529] hover:bg-gray-200 transition text-sm"
      >
        <FaSignOutAlt className="text-gray-600" /> Logout
      </button>
    </div>
  );
};
