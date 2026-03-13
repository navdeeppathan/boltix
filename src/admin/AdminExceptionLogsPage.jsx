import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import http from "../service/http";

const AdminExceptionLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // ================= FETCH LOGS =================
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await http.get("/exception-logs");
      setLogs(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch exception logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // ================= SEARCH =================
  const filteredLogs = logs.filter(
    (log) =>
      log.error_msg?.toLowerCase().includes(search.toLowerCase()) ||
      log.activity?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()),
  );

  // ================= PAGINATION =================
  const totalEntries = filteredLogs.length;
  const totalPages = Math.ceil(totalEntries / entries);
  const startIndex = (currentPage - 1) * entries;
  const endIndex = Math.min(startIndex + entries, totalEntries);
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entries]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const truncateText = (text, limit = 120) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 bg-[#3b3553]">
          <h1 className="text-xl font-semibold text-white">Exception Logs</h1>
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
          <table className="w-full min-w-[1100px]">
            <thead className="bg-[#3b3553]">
              <tr>
                {[
                  "S.N.",
                  "Date & Time",
                  "User ID",
                  "Activity",
                  "Action",
                  "Error Message",
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center">
                    No logs found
                  </td>
                </tr>
              ) : (
                currentLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-3 text-sm">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm">{log.date_time}</td>
                    <td className="px-4 py-3 text-sm">
                      {log.user_id ?? "Guest"}
                    </td>
                    <td className="px-4 py-3 text-sm">{log.activity}</td>
                    <td className="px-4 py-3 text-sm">{log.action}</td>
                    {/* <td className="px-4 py-3 text-sm text-red-600">
                      {log.error_msg}
                    </td> */}
                    <td className="px-4 py-3 text-sm text-red-600">
                      <div className="relative group max-w-md cursor-pointer">
                        {/* Truncated text */}
                        <span>{truncateText(log.error_msg, 30)}</span>

                        {/* Tooltip */}
                        <div className="absolute left-0 top-full z-20 mt-2 hidden w-[420px] rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-800 shadow-lg group-hover:block">
                          <div className="font-semibold text-red-600 mb-1">
                            Full Error Message
                          </div>
                          <div className="whitespace-pre-wrap break-words">
                            {log.error_msg}
                          </div>
                        </div>
                      </div>
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

export default AdminExceptionLogsPage;
