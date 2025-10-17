// src/middleware/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const asCompany = localStorage.getItem("asCompany");
  const asManager = localStorage.getItem("asManager");
  // Redirect if no user logged in
  if (!asCompany && !asManager) {
    return <Navigate to="/" replace />;
  }

  // Role-based protection
  if (role === "company" && !asCompany) {
    return <Navigate to="/" replace />;
  }

  if (role === "manager" && !asManager) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
