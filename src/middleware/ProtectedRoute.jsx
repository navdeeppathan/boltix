// src/middleware/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const asCompany = localStorage.getItem("asCompany");
  const asOEMSupervisor = localStorage.getItem("asOEMSupervisor");
  const asTechnician = localStorage.getItem("asTechnician");
  const asPlantSupervisor = localStorage.getItem("asPlantSupervisor");
  const asAdmin = localStorage.getItem("asAdmin");
  const asCompantAdmin = localStorage.getItem("asCompantAdmin");

  // Redirect if no user logged in
  if (
    !asCompany &&
    !asOEMSupervisor &&
    !asTechnician &&
    !asPlantSupervisor &&
    !asAdmin &&
    !asCompantAdmin
  ) {
    return <Navigate to="/" replace />;
  }

  // Role-based protection
  if (role === "company" && !asCompany) {
    return <Navigate to="/" replace />;
  }

  if (role === "oemsupervisor" && !asOEMSupervisor) {
    return <Navigate to="/" replace />;
  }

  if (role === "technician" && !asTechnician) {
    return <Navigate to="/" replace />;
  }

  if (role === "plantSupervisor" && !asPlantSupervisor) {
    return <Navigate to="/" replace />;
  }

  if (role === "admin" && !asAdmin) {
    return <Navigate to="/" replace />;
  }

  if (role === "companyadmin" && !asCompantAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
