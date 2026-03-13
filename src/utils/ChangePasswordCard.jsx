import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import http from "../service/http";

const ChangePasswordCard = () => {
  const user = JSON.parse(localStorage.getItem("userData"));

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        user_id: user.id,
        current_password: form.current_password,
        new_password: form.new_password,
      };

      const res = await http.post("/users/change-password", payload);

      if (res.data.status) {
        toast.success(res.data.message);
        setForm({
          current_password: "",
          new_password: "",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F9F9F9] rounded-2xl shadow p-4 w-full mx-auto mb-6 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 text-[#212529]">
        Change Password
      </h3>

      <div className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="text-sm text-gray-600">Current Password</label>

          <div className="flex items-center  border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-white">
            <Lock size={16} className="text-gray-500 mr-2" />

            <input
              type={showCurrent ? "text" : "password"}
              name="current_password"
              value={form.current_password}
              onChange={handleChange}
              className="w-full outline-none"
              placeholder="Enter password"
            />

            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="text-gray-500"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm text-gray-600">New Password</label>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-white">
            <Lock size={16} className="text-gray-500 mr-2" />

            <input
              type={showNew ? "text" : "password"}
              name="new_password"
              value={form.new_password}
              onChange={handleChange}
              className="w-full  outline-none"
              placeholder="Enter password"
            />

            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="text-gray-500"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordCard;
