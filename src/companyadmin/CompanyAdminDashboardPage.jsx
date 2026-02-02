import React, { useEffect, useState } from "react";
import http from "../service/http";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CompanyAdminDashboardPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const user_id = JSON.parse(localStorage.getItem("userData")).id;

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setListLoading(true);
      const res = await http.get(`/users/by-parent/${user_id}`);
      console.log("user:-", res.data.data);
      setUsers(res.data.data || []);
    } catch (error) {
      console.error(error);
      // toast.error("Failed to fetch users");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= SEARCH =================
  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  );

  // ================= PAGINATION =================
  const totalEntries = filteredUsers.length;
  const totalPages = Math.ceil(totalEntries / entries);
  const startIndex = (currentPage - 1) * entries;
  const endIndex = Math.min(startIndex + entries, totalEntries);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entries]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ================= TOGGLE =================
  const handleToggle = async (user) => {
    const newStatus = user.is_active ? 0 : 1;

    try {
      const res = await http.post(`/admin/update-is-active/${user.id}`, {
        is_active: newStatus,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, is_active: newStatus } : u,
        ),
      );

      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to update status",
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 flex items-center bg-[#212529]">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Users Management
            </h1>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => navigate("/company-admin/dashboard/users")}
              className="flex items-center justify-center p-2 rounded-lg bg-[#0088FF] text-white cursor-pointer"
            >
              Add User
            </button>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <span>Show</span>
            <select
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
              className="border rounded px-3 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span>Search:</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-3 py-1"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-[#212529]">
              <tr>
                {[
                  "S.N.",
                  "Full Name",
                  "Email",
                  "Mobile",
                  "Company",
                  "Designation",
                  "Verified",
                  "Department",
                  "Status",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left text-sm font-semibold text-white"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {listLoading ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-3 text-sm">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm">{user.full_name}</td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      {user.mobile_number || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.company?.company_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.company?.designation || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.email_verified_at ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.department || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {user.is_active ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-green-600 text-white">
                          Active
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-red-600 text-white">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
          </div>

          {totalPages > 1 && (
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-purple-600 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminDashboardPage;
