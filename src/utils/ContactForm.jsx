import React, { useState } from "react";
import { Phone, MapPin } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { RotatingLines } from "react-loader-spinner";
import http from "../service/http";
import Swal from "sweetalert2";

export default function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "US",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await http.post("/contact-us", {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone_number: form.phone,
        message: form.message,
      });

      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: response.data.message,
          confirmButtonColor: "#000",
        });
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          country: "US",
          phone: "",
          message: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong. Please try again later.",
          confirmButtonColor: "#000",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again later.",
        confirmButtonColor: "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-6xl mt-20 mx-auto px-6 py-16 bg-transparent">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Contact our team
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Have questions or need support? Reach out to our friendly team
            anytime — we're ready to assist you and ensure your experience is
            seamless.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-10">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 text-sm md:text-base"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block font-medium text-gray-800 mb-1">
                  First name
                </label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium text-gray-800 mb-1">
                  Last name
                </label>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-800 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-800 mb-1">
                Phone number
              </label>
              <div className="flex gap-2">
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-2 py-2 focus:ring-2 focus:ring-black"
                >
                  <option value="US">US</option>
                  <option value="IN">IN</option>
                  <option value="UK">UK</option>
                </select>
                <input
                  name="phone"
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-800 mb-1">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Leave us a message..."
                value={form.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[120px] focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-60 flex justify-center items-center gap-2"
              >
                {loading && (
                  <RotatingLines
                    strokeColor="#FFFFFF"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="20"
                    height={20} // explicitly fix height
                    visible={true}
                  />
                )}
                {loading ? "Sending..." : "Send message"}
              </button>
            </div>
          </form>

          {/* Right Contact Info */}
          <div className="space-y-10">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Call us
              </h3>
              <p className="text-gray-600 text-sm mb-4">Mon-Fri 8am to 5pm</p>
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                <Phone className="w-5 h-5 mr-2" /> +1 (555) 000-0000
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Visit us
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Chat to us in person at our HQ.
              </p>
              <button className="flex items-start text-gray-700 hover:text-gray-900">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" /> 100
                Smith Street, Collingwood VIC 3066
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
