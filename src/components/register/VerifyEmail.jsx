import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import http from "../../service/http";
import HeaderAdminLogin from "../../utils/HeaderAdminLogin";
import Footer from "../../utils/Footer";

const VerifyEmail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Redirect if user_id missing
  useEffect(() => {
    if (!state?.user_id) {
      navigate("/login");
    }
  }, [state, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      Swal.fire("Error", "Please enter OTP", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await http.post("/verify-email-otp", {
        user_id: state.user_id,
        otp,
      });

      if (res.data.status) {
        Swal.fire("Success", "Email verified successfully", "success");
        navigate("/login");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Invalid or expired OTP",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);

      const res = await http.post("/resend-email-otp", {
        user_id: state.user_id,
      });

      if (res.data.status) {
        Swal.fire("Success", "OTP resent to your email", "success");
        setCooldown(60); // 60 seconds cooldown
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to resend OTP",
        "error",
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <HeaderAdminLogin />
      <div className="min-h-screen mt-10 flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleVerify}
          className="bg-white p-6 rounded-xl shadow w-96"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Verify Email</h2>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            className="w-full border p-2 rounded mb-4 text-center tracking-widest"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded mb-3 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            disabled={resendLoading || cooldown > 0}
            onClick={handleResendOtp}
            className="w-full text-blue-600 text-sm disabled:opacity-50"
          >
            {cooldown > 0
              ? `Resend OTP in ${cooldown}s`
              : resendLoading
                ? "Resending..."
                : "Resend OTP"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default VerifyEmail;
