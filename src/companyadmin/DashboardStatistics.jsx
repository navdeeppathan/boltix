import React, { use, useEffect, useState } from "react";

import { Users, UserCheck, Ticket } from "lucide-react";

import http from "../service/http";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
const DashboardStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const user = JSON.parse(localStorage.getItem("userData"));
  const user_id = user?.id;
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await http.get(
          `/admin-dashboard/dashboard-stats/${user_id}`,
        );
        const data = await response.data;
        console.log(data);
        // setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  });
  return (
    <div className="space-y-4">
      <DashboardStats />
      <UsersChart parentId={user_id} />
      <TicketChart parentId={user_id} />
    </div>
  );
};

export default DashboardStatistics;

function DashboardStats() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const user = JSON.parse(localStorage.getItem("userData"));
  const user_id = user?.id;

  const fetchStats = async () => {
    const res = await http.get(`/admin-dashboard/dashboard-stats/${user_id}`); // parent_id
    setStats(res.data.data);
  };

  const cards = [
    {
      title: "Total Users",
      value: stats.total_users,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: stats.active_users,
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      title: "Total Tickets",
      value: stats.total_tickets,
      icon: Ticket,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="bg-gray-100 hover:shadow-md border border-gray-200 rounded-xl p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <h2 className="text-2xl font-bold mt-1">{card.value || 0}</h2>
            </div>

            <div className={`${card.color} p-3 rounded-lg text-white`}>
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const TicketChart = ({ parentId }) => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});
  const [topMonths, setTopMonths] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await http.get(
        `/admin-dashboard/dashboard-stats/${parentId}`,
      );
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

const UsersChart = ({ parentId }) => {
  const [data, setData] = useState([]);
  const [topMonths, setTopMonths] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await http.get(`/users-chart-stats/${parentId}`);

        const monthly = res.data.data.monthly_users || [];

        const top = res.data.data.top_user_months || [];

        setTopMonths(top);

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
            users: found ? found.total : 0,
          };
        });

        setData(chartData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [parentId]);

  return (
    <div className="bg-gray-100 rounded-xl border border-gray-200 hover:shadow p-6">
      <h2 className="font-semibold mb-4">Users Dynamics Per Month</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="users"
            stroke="#000"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Top User Months */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
        {topMonths.map((m, i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-lg py-4 border border-gray-100"
          >
            <p className="text-gray-400 text-sm">{m.month}</p>

            <p className="text-xl font-bold">{m.users}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
