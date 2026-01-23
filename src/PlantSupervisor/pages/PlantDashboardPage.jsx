// DashboardPage.jsx
import React, { useEffect, useState } from "react";

import http from "../../service/http";

import Select from "react-select";

import { useNavigate } from "react-router-dom";
import PlantTicketTable from "./PlantTicketTable";
const PlantDashboardPage = () => {
  return (
    <div className="bg-[#FFFFFF] space-y-6">
      <DashboardStatus />
      {/* <TicketOverview /> */}
    </div>
  );
};

export default PlantDashboardPage;

const DashboardStatus = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userData"));

  const options = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await http.get("/tickets/summary", {
          params: { parent_id: user.id },
        });
        if (res.data.status) {
          const d = res.data.data;
          const user = JSON.parse(localStorage.getItem("userData")); // example
          const isManager = user?.role_id === 2;

          setStats([
            {
              label: "New Tickets",
              value: d.new_inquiries,
              icon: "/message.png",
              color: "bg-[#DC2776]",
              bg: "bg-pink-50",
              link: "/plant-supervisor/dashboard/tickets",
            },
            {
              label: "Open Tickets",
              value: d.in_progress_inquiries,
              icon: "/h2.png",
              color: "bg-[#9532E9]",
              bg: "bg-indigo-50",
              link: "/plant-supervisor/dashboard/tickets-approved",
            },
            {
              label: "Pending Tickets",
              value: d.pending,
              icon: "/h3.png",
              color: "bg-[#EA2179]",
              bg: "bg-amber-50",
              link: "/plant-supervisor/dashboard/tickets",
            },

            {
              label: "Completed Tickets",
              value: d.completed_inquiries,
              icon: "/file.png",
              color: "bg-[#2466EB]",
              bg: "bg-emerald-50",
              // link: "/plant-supervisor/dashboard/tickets",
            },
            {
              label: "Total Tickets",
              value: d.total_tickets,
              icon: "/h2.png",
              color: "bg-[#9532E9]",
              bg: "bg-slate-100",
              // link: "/plant-supervisor/dashboard/tickets",
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
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
          {stats.map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.link)}
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
                  <button
                    onClick={() =>
                      navigate("/manager/dashboard/manage-products")
                    }
                    className="text-[11px] sm:text-[12px] font-medium text-[#207EB1] border border-[#D5E5EF] bg-[#F8FBFC] px-3 py-2 rounded-lg hover:bg-[#E8F4FA] transition"
                  >
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

      <PlantTicketTable />
    </div>
  );
};
