import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import http from "../service/http";
import { toast } from "react-toastify";
// your axios instance

const AdminTicketTable = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await http.get("/admin/tickets");
      console.log("response:-", res.data);

      if (res.data.status === "success") {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveTicket = async (id) => {
    try {
      await http.post(`/admin/tickets/${id}/approve`);
      fetchTickets();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const openRejectModal = (id) => {
    setSelectedTicketId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const rejectTicket = async () => {
    if (!rejectReason.trim()) return alert("Enter reject reason");

    try {
      await http.post(`/admin/tickets/${selectedTicketId}/reject`, {
        remarks: rejectReason,
      });
      setShowRejectModal(false);
      fetchTickets();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return map[status] || "";
  };

  const handleToggle = async (user) => {
    const newStatus = user.is_active ? 0 : 1;

    try {
      const res = await http.post(`/admin/update-is-active/${user.id}`, {
        is_active: newStatus,
      });

      window.location.reload();
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
    <div className="w-full bg-gray-50">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto max-h-screen scrollbar-thin">
          <table className="w-full min-w-max">
            <thead className="sticky top-0 bg-[#3b3553] text-white border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap min-w-[100px]">
                  S.No{" "}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap min-w-[100px]">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap min-w-[100px]">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap min-w-[100px]">
                  Provider
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap min-w-[100px]">
                  Remarks
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white whitespace-nowrap min-w-[100px]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    <RotatingLines width="20" strokeColor="#000" />
                  </td>
                </tr>
              ) : tickets.length ? (
                tickets.map((t, i) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{i + 1}</td>

                    <td className="px-4 py-3">
                      <div className="font-medium">{t.user?.full_name}</div>
                    </td>

                    <td className="px-4 py-3 text-sm">{t.user?.email}</td>

                    <td className="px-4 py-3 text-sm">
                      {t.provider?.full_name}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium`}
                      >
                        {t.remarks}
                      </span>
                    </td>

                    <td className="px-4 py-3 flex gap-2">
                      {/* {t.status === "pending" ? (
                        <>
                          <button
                            onClick={() => approveTicket(t.id)}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => openRejectModal(t.id)}
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">No action</span>
                      )} */}

                      <button
                        onClick={() => handleToggle(t.user)}
                        className={`relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full transition ${
                          t?.user.is_active ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                            t?.user.is_active
                              ? "translate-x-5"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg w-full max-w-md p-5">
            <h2 className="text-lg font-semibold mb-3">Reject Ticket</h2>

            <textarea
              rows="4"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter rejection reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={rejectTicket}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTicketTable;
