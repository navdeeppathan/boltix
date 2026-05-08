import React, { useEffect, useState } from "react";
import { Edit, Lock, Mail, Phone, User } from "lucide-react";
import http from "../service/http";
import { toast } from "react-toastify";

const AdminProfile = () => {
  const user = JSON.parse(localStorage.getItem("userData"));

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    designation: "Admin",
    department: "",
  });

  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const depRes = await http.get("/departments");

      setDepartments(
        depRes.data?.data.map((item) => ({
          label: item.name,
          value: item.name, // 👈 ID goes in value
        })),
      );
    } catch (error) {
      console.error("Error fetching departments", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const [passwordModal, setPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await http.get(`/users/profile/${user.id}`);
        const data = res.data.data;

        setForm({
          name: data.full_name,
          email: data.email,
          phone: data.mobile_number,
          company: data.company.company_name,
          designation: data.company.designation,
          department: data.department,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      const payload = {
        full_name: form.name,
        email: form.email,
        mobile_number: form.phone,
        company_name: form.company,
        department: form.department,
      };

      const res = await http.put(`/users/update-profile/${user.id}`, payload);

      if (res.data.status) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const changePassword = async () => {
    try {
      const payload = {
        user_id: user.id,
        current_password: currentPassword,
        new_password: newPassword,
      };

      const res = await http.post("/users/change-password", payload);

      if (res.data.status) {
        toast.success(res.data.message);
        setPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-black text-white rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={user?.company?.profile_pic || "/person.jpg"}
            className="w-16 h-16 rounded-full border-2 border-white object-cover"
          />

          <div>
            <h2 className="text-xl font-semibold">{form.name}</h2>
            <p className="text-gray-300 text-sm">{form.designation}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200"
        >
          <Edit size={16} />
          Edit Profile
        </button>
      </div>

      {/* Profile Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl hover:shadow border border-gray-300 p-6">
          <h3 className="font-semibold mb-4 text-lg">Personal Information</h3>

          <div className="space-y-4">
            <Input
              icon={<User size={16} />}
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              icon={<Mail size={16} />}
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              icon={<Phone size={16} />}
              label="Mobile Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-xl hover:shadow border border-gray-300 p-6">
          <h3 className="font-semibold mb-4 text-lg">Company Information</h3>

          <div className="space-y-4">
            <Input
              icon={<User size={16} />}
              label="Company Name"
              name="company"
              value={form.company}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              icon={<User size={16} />}
              label="Designation"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              disabled={true}
            />

            <div>
              <label className="text-sm text-gray-500">Department</label>

              <div
                className={`flex items-center border rounded-lg px-3 py-2 mt-1 gap-2 ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <User size={16} />

                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full outline-none bg-transparent"
                >
                  <option value="">Select Department</option>

                  {departments.map((department) => (
                    <option key={department.value} value={department.value}>
                      {department.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Change Password */}
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Lock size={18} />

              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-gray-500">
                  Change your account password
                </p>
              </div>

              <button
                onClick={() => setPasswordModal(true)}
                className="ml-auto bg-black text-white px-3 py-1 rounded"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">Change Password</h2>

            <input
              type="password"
              placeholder="Current Password"
              className="w-full border p-2 rounded"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-2 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPasswordModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={changePassword}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, icon, disabled, ...props }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>

    <div
      className={`flex items-center border rounded-lg px-3 py-2 mt-1 gap-2 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    >
      {icon}

      <input
        {...props}
        disabled={disabled}
        className="w-full outline-none bg-transparent"
      />
    </div>
  </div>
);

export default AdminProfile;
