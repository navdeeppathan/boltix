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
  FaBoxes,
  FaUsers,
} from "react-icons/fa";
const ManagerSidebar = ({ isOpen, setIsOpen }) => {
  const linkClasses =
    "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition";
  const activeClasses = "bg-white text-black font-semibold shadow";

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
            to="/manager/dashboard/home"
            end
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaTachometerAlt /> Dashboard
          </NavLink>
          <NavLink
            to="/manager/dashboard/tickets"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaTicketAlt /> My Tickets
          </NavLink>
          {/* <NavLink
            to="/manager/dashboard/communication"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaComments /> Communication
          </NavLink> */}
          <NavLink
            to="/manager/dashboard/notifications"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaBell /> Notifications
          </NavLink>

          <NavLink
            to="/manager/dashboard/manage-products"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaBoxes />
            Manage Products
          </NavLink>

          <NavLink
            to="/manager/dashboard/users-list"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaUsers /> Users
          </NavLink>

          <NavLink
            to="/manager/dashboard/profile"
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeClasses}` : linkClasses
            }
            onClick={() => setIsOpen(false)}
          >
            <FaUserCog /> Profile & Settings
          </NavLink>
        </nav>
        {/* <div className="p-4 border-t border-gray-700">
          <div className="flex flex-col items-center text-center">
            <img
              src="https://i.pravatar.cc/100"
              alt="user"
              className="w-16 h-16 rounded-full mb-2"
            />
            <p className="text-sm">User name</p>
          </div>
          <button className="mt-4 w-full bg-gray-600 py-2 rounded-lg flex items-center justify-center gap-2">
            <FaSignOutAlt /> Logout
          </button>
        </div> */}
        {/* <UserCard /> */}
      </aside>
    </>
  );
};

export default ManagerSidebar;

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
