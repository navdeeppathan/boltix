import React, { useEffect, useState } from "react";

import { Route, Routes, Navigate } from "react-router-dom";

import { Create } from "@mui/icons-material";

import Sidebar from "./utils/AdminSidebar";
import Header from "./utils/AdminHeader";
import AdminDashboardPage from "./AdminDashboardPage";
import AdminTicketTable from "./AdminTicketTable";

export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  const [title, setTitle] = useState("Dashboard");

  const user = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    const titles = {
      home: "Dashboard",
      banners: "Banners Management",
      categories: "Categories Management",
      users: "Users Management",
      settings: "Settings",
    };
    setTitle(titles[activeMenu] || "Dashboard");
  }, [activeMenu]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title={title} setIsOpen={setIsOpen} user={user} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="home" replace />} />
            <Route path="home" element={<AdminDashboardPage />} />
            <Route path="tickets" element={<AdminTicketTable />} />

            <Route path="*" element={<Navigate to="home" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
