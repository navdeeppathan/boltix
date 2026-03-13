import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Folders,
  Edit,
  Cookie,
  MessageSquare,
  Settings,
  ChevronDown,
  LogOut,
  MessageCircle,
  LogOutIcon,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

// Sidebar Component
const Sidebar = ({ isOpen, setIsOpen, activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userData"));
  const menuItems = [
    {
      id: "home",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard/home",
    },
    {
      id: "logs",
      label: "Logs",
      icon: LogOutIcon,
      path: "/admin/dashboard/logs",
    },
    // {
    //   id: "categories",
    //   label: "Categories",
    //   icon: Folders,
    //   path: "/dashboard/categories",
    // },
    // {
    //   id: "edit",
    //   label: "Edit Categories",
    //   icon: Edit,
    //   path: "/dashboard/edit-categories",
    // },
    // {
    //   id: "cookies",
    //   label: "All Cookies",
    //   icon: Cookie,
    //   path: "/dashboard/cookies",
    // },
    // {
    //   id: "contacts",
    //   label: "Contacts Queries",
    //   icon: MessageSquare,
    //   path: "/dashboard/contacts",
    // },
    // {
    //   id: "feedbacks",
    //   label: "All Feedbacks",
    //   icon: MessageCircle,
    //   path: "/dashboard/feedbacks",
    // },
    // {
    //   id: "work-category",
    //   label: "All Work Categories",
    //   icon: MessageSquare,
    //   path: "/dashboard/work-category",
    // },
    // {
    //   id: "products",
    //   label: "All Products",
    //   icon: MessageSquare,
    //   path: "/dashboard/products",
    // },
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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
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

              {/* <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
                  A
                </div>
                <span className="text-lg font-semibold">Admin Panel</span>
              </div> */}
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
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-semibold">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.full_name}</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
              {/* <ChevronDown size={16} className="text-gray-400" /> */}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
