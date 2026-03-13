import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import http from "../service/http";

const AdminActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activityFilter, setActivityFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const user = JSON.parse(localStorage.getItem("userData"));

  // ================= FETCH LOGS =================
  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);

      const res = await http.get("/activity-logs", {
        params: {
          parent_id: user?.id,
          page: page,
        },
      });

      const pagination = res.data.data;

      setLogs(pagination.data || []);
      setCurrentPage(pagination.current_page);
      setLastPage(pagination.last_page);
      setTotal(pagination.total);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = () => {
    fetchLogs(1);
  };

  const handleCancel = () => {
    setActivityFilter("");
    setActionFilter("");
    setUserFilter("");
    setDateFilter("");
    setSearch("");
    fetchLogs(1);
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  // ================= SEARCH =================
  const filteredLogs = logs.filter((log) => {
    const activityMatch = activityFilter
      ? log.activity?.toLowerCase().includes(activityFilter.toLowerCase())
      : true;

    const actionMatch = actionFilter
      ? log.action?.toLowerCase().includes(actionFilter.toLowerCase())
      : true;

    const userMatch = userFilter
      ? log.user?.full_name?.toLowerCase().includes(userFilter.toLowerCase())
      : true;

    const dateMatch = dateFilter
      ? new Date(log.created_at).toISOString().slice(0, 10) === dateFilter
      : true;

    const searchMatch = search
      ? log.activity?.toLowerCase().includes(search.toLowerCase()) ||
        log.action?.toLowerCase().includes(search.toLowerCase()) ||
        log.description?.toLowerCase().includes(search.toLowerCase())
      : true;

    return (
      activityMatch && actionMatch && userMatch && dateMatch && searchMatch
    );
  });

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
      {/* HEADER */}
      <div className="px-6 py-4 bg-[#3b3553] rounded-t-lg">
        <h1 className="text-xl font-semibold text-white">Activity Logs</h1>
      </div>

      {/* SEARCH */}
      <div className="p-4 bg-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
        <input
          type="text"
          placeholder="Filter Activity"
          value={activityFilter}
          onChange={(e) => setActivityFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        />

        <input
          type="text"
          placeholder="Filter Action"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        />

        <input
          type="text"
          placeholder="Filter User"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        />

        {/* SEARCH BUTTON */}
        <button
          onClick={handleSearch}
          className="bg-[#3b3553] text-white px-4 py-2 rounded-md text-sm hover:bg-[#2c2840]"
        >
          Search
        </button>

        {/* CANCEL BUTTON */}
        <button
          onClick={handleCancel}
          className="bg-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[#3b3553] text-white text-sm sticky top-0">
            <tr>
              <th className="px-3 py-3 w-12 text-left">#</th>
              <th className="px-3 py-3 w-44 text-left">Date & Time</th>
              <th className="px-3 py-3 w-40 text-left hidden sm:table-cell">
                User
              </th>
              <th className="px-3 py-3 w-36 text-left">Activity</th>
              <th className="px-3 py-3 w-40 text-left hidden md:table-cell">
                Action
              </th>
              <th className="px-3 py-3 text-left">Description</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center">
                  No logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-3 py-3">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>

                  <td className="px-3 py-3 truncate hidden sm:table-cell">
                    {log.user?.full_name ?? "System"}
                  </td>

                  <td className="px-3 py-3 truncate">{log.activity}</td>

                  <td className="px-3 py-3 truncate hidden md:table-cell">
                    {log.action}
                  </td>

                  <td className="px-3 py-3">
                    <div className="max-w-[420px] truncate">
                      {log.description}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {lastPage > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t bg-white">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {lastPage} • Total {total} records
          </div>

          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => fetchLogs(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(lastPage)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchLogs(i + 1)}
                className={`px-3 py-1 border rounded-md text-sm ${
                  currentPage === i + 1 ? "bg-purple-600 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => fetchLogs(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivityLogsPage;
