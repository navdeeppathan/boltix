// DashboardPage.jsx
import React, { useEffect, useState } from "react";
import {
  FaTicketAlt,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaClock,
  FaUsers,
  FaFileAlt,
  FaCommentAlt,
  FaVideo,
  FaPhone,
  FaSignOutAlt,
  FaCamera,
} from "react-icons/fa";
import http from "../../service/http";
import { baseURL } from "../../service/api";

import Select from "react-select";
import TechnicianTicketTable from "./TechnicianTicketTable";

const TechnicianDashboardPage = () => {
  return (
    <div className="bg-[#FFFFFF] space-y-6">
      <DashboardStatus />
      {/* <TicketOverview /> */}
    </div>
  );
};

export default TechnicianDashboardPage;

const DashboardStatus = () => {
  const options = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const [stats, setStats] = useState([]);

  const user = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await http.get(`/tickets/assigned-user/summary/${user.id}`); // Laravel endpoint
        if (res.data.status) {
          const d = res.data.data;

          setStats([
            {
              label: "New Tickets",
              value: d.new,
              icon: "/message.png",
              color: "bg-[#DC2776]",
              bg: "bg-pink-50",
            },
            {
              label: "Open Tickets",
              value: d.open,
              icon: "/h2.png",
              color: "bg-[#9532E9]",
              bg: "bg-indigo-50",
            },
            // {
            //   label: "Priority Inquiries",
            //   value: d.priority_inquiries,
            //   icon: "/h3.png",
            //   color: "bg-[#EA2179]",
            // },
            {
              label: "Closed Tickets",
              value: d.close,
              icon: "/file.png",
              color: "bg-[#2466EB]",
              bg: "bg-emerald-50",
            },
            {
              label: "Total Tickets",
              value: d.total,
              icon: "/h1.png",
              color: "bg-[#DC2776]",
              bg: "bg-slate-100",
            },
          ]);
        }
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full  bg-[#F9F9F9] rounded-[14px] p-4 sm:p-6 md:p-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-[16px] text-[#212529] font-bold">
            Current Status
          </h2>
          {/* <Select
            options={options}
            defaultValue={options[0]}
            className="w-[100px] sm:w-[120px] text-sm font-medium"
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: "#FFFFFF",
                borderRadius: "7.44px",
                minHeight: "32px",
                height: "32px",
                borderColor: state.isFocused ? "#207EB1" : "#E5E7EB",
                boxShadow: state.isFocused ? "0 0 0 1px #207EB1" : "none",
                "&:hover": {
                  borderColor: "#207EB1",
                },
              }),
              valueContainer: (base) => ({
                ...base,
                padding: "0 6px",
              }),
              indicatorsContainer: (base) => ({
                ...base,
                height: "32px",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: "0 4px",
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                fontSize: "14px",
                backgroundColor: isSelected
                  ? "#207EB1"
                  : isFocused
                  ? "#E8F4FA"
                  : "#fff",
                color: isSelected ? "#fff" : "#212529",
                cursor: "pointer",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "8px",
                zIndex: 50,
              }),
            }}
            components={{
              IndicatorSeparator: () => null, // remove divider line
            }}
          /> */}
        </div>

        {/* Responsive Grid of Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((item, i) => (
            <div
              key={i}
              className={`${item.bg} rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 flex flex-col items-start justify-between text-start min-h-[120px] sm:min-h-[150px] ${
                item.button ? "lg:col-span-2" : ""
              }`}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white mb-2 ${item.color}`}
                >
                  <img
                    src={item.icon}
                    alt=""
                    className="w-[20px] h-[20px] sm:w-[25px] sm:h-[25px]"
                  />
                </div>
                {item.button && (
                  <button className="text-[11px] sm:text-[12px] font-medium text-[#207EB1] border border-[#D5E5EF] bg-[#F8FBFC] px-3 py-2 rounded-lg hover:bg-[#E8F4FA] transition">
                    {item.button}
                  </button>
                )}
              </div>

              {/* Value */}
              <p className="text-lg sm:text-xl md:text-2xl text-[#000000] font-semibold leading-tight">
                {item.value}
              </p>

              {/* Label */}
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-[14px] text-[#000000] font-medium leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <TechnicianTicketTable />
    </div>
  );
};
