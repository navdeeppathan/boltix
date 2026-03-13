import React, { useState, useEffect } from "react";
import { X, LayoutDashboard, Folders, LogOut, Users } from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBell,
  FaComments,
  FaProductHunt,
  FaTachometerAlt,
  FaTicketAlt,
  FaUserCog,
  FaUsersCog,
} from "react-icons/fa";

// Sidebar Component
const PlantSidebar = ({ isOpen, setIsOpen, activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userData"));
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/plant-supervisor/dashboard/home",
    },
    {
      id: "tickets",
      label: "Tickets for approval",
      icon: <FaTicketAlt />,
      path: "/plant-supervisor/dashboard/tickets",
    },

    {
      id: "approved-tickets",
      label: "Approved Tickets",
      icon: <FaComments />,
      path: "/plant-supervisor/dashboard/tickets-approved",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell />,
      path: "/plant-supervisor/dashboard/notifications",
    },
    {
      id: "manage-products",
      label: "Manage Products",
      icon: <FaProductHunt />,
      path: "/plant-supervisor/dashboard/plant-products",
    },
    {
      id: "profile",
      label: "Profile & Settings",
      icon: <FaUsersCog />,
      path: "/plant-supervisor/dashboard/profile",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#212529] text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <style>
          {`
          /* Sidebar Scrollbar */
          aside nav::-webkit-scrollbar {
            width: 4px;      /* thin */
          }

          aside nav::-webkit-scrollbar-track {
            background: transparent;
          }

          aside nav::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.20);
            border-radius: 10px;
          }

          aside nav::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.35);
          }

          /* Firefox */
          aside nav {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
          }

          `}
        </style>
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex  items-center gap-2">
              <div className="flex items-center justify-center py-2">
                <img src="/logo.png" alt="" className="w-[126.99px] h-[75px]" />
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                      className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? "bg-white text-black font-semibold shadow"
                          : "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default PlantSidebar;
