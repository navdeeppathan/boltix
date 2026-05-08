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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import http from "../../service/http";
import { baseURL } from "../../service/api";
import TicketTable from "../../pages/TicketTable";
import Select from "react-select";
import ManagerTicketTable from "./ManagerTicketTable";
import { useNavigate } from "react-router-dom";
const ManagerDashboardPage = () => {
  return (
    <div className="bg-[#FFFFFF] space-y-6">
      <DashboardStatus />
      {/* <TicketOverview /> */}
    </div>
  );
};

export default ManagerDashboardPage;

const DashboardStatus = () => {
  const navigate = useNavigate();
  // const stats = [
  //   {
  //     label: "New Inquiries",
  //     value: 3,
  //     icon: "/message.png",
  //     color: "bg-[#DC2776]",
  //   },
  //   {
  //     label: "In Progress Inquiries",
  //     value: 2,
  //     icon: "/h2.png",
  //     color: "bg-[#9532E9]",
  //   },
  //   {
  //     label: "Priority Inquiries",
  //     value: 1,
  //     icon: "/h3.png",
  //     color: "bg-[#EA2179]",
  //   },
  //   {
  //     label: "Completed Inquiries",
  //     value: 15,
  //     icon: "/file.png",
  //     color: "bg-[#2466EB]",
  //   },
  //   {
  //     label: "Products & Categories",
  //     value: 30,
  //     icon: "/setting.png",
  //     color: "bg-[#E11279]",
  //     button: "Manage Products",
  //     wide: true, // 👈 mark this one as wide
  //   },
  // ];

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
        const res = await http.get(`/oem/tickets/summary/${user.parent_id}`); // Laravel endpoint
        if (res.data.status) {
          const d = res.data.data;
          const user = JSON.parse(localStorage.getItem("userData")); // example
          const isManager = user?.role_id === 2;

          setStats([
            {
              label: "New Tickets",
              value: d.new,
              icon: "/message.png",
              color: "bg-[#DC2776]",
              bg: "bg-pink-50",
              link: "/manager/dashboard/tickets?query=new",
            },
            {
              label: "Open Tickets",
              value: d.open,
              icon: "/h2.png",
              color: "bg-[#9532E9]",
              bg: "bg-indigo-50",
            },
            {
              label: "Not Acknowledged Tickets",
              value: d.not_acknowledged,
              icon: "/h2.png",
              color: "bg-[#9532E9]",
              bg: "bg-amber-50",
            },
            {
              label: "Total Tickets",
              value: d.total,
              icon: "/h3.png",
              color: "bg-[#EA2179]",
              bg: "bg-slate-100",
              link: "/manager/dashboard/tickets",
            },
            {
              label: "Closed Tickets",
              value: d.closed,
              icon: "/file.png",
              color: "bg-[#2466EB]",
              bg: "bg-emerald-50",
              link: "/manager/dashboard/tickets?query=completed",
            },
            // {
            //   label: "Products & Categories",
            //   value: d.products_categories,
            //   icon: "/setting.png",
            //   color: "bg-[#E11279]",
            //   bg: "bg-blue-50",
            //   button: isManager ? "Manage Products" : "View Products",
            //   wide: true,
            //   link: "/manager/dashboard/manage-products",
            // },
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
        <div className="grid grid-cols-1 sm:grid-cols-3  gap-3 sm:gap-4">
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
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-lg text-[#000000] font-medium leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* <ManagerTicketTable /> */}
      <TicketChart parentId={user?.parent_id} />
    </div>
  );
};

const TicketChart = ({ parentId }) => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [topMonths, setTopMonths] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await http.get(`/dashboard/dashboard-stats-oem/${parentId}`);
      const monthly = res.data.data.monthly_tickets;
      setTopMonths(res.data.data.top_ticket_months);

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const chartData = months.map((m, i) => {
        const found = monthly.find((x) => x.month === i + 1);
        return {
          name: m,
          tickets: found ? found.total : 0,
        };
      });

      setData(chartData);
      setStats(res.data.data);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 rounded-xl border border-gray-200 hover:shadow p-6">
      <h2 className="font-semibold mb-4">Ticket Dynamics Per Month</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="tickets"
            stroke="#000"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Bottom Stats */}
      {/* Top Ticket Months */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
        {topMonths.map((m, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-lg py-4 border border-gray-100"
          >
            <p className="text-gray-400 text-sm">{m.month}</p>
            <p className="text-xl font-bold">{m.tickets}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
