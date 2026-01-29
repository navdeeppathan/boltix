import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const asCompany = localStorage.getItem("asCompany");
  const asOEMSupervisor = localStorage.getItem("asOEMSupervisor");
  const asTechnician = localStorage.getItem("asTechnician");
  const asPlantSupervisor = localStorage.getItem("asPlantSupervisor");
  const asAdmin = localStorage.getItem("asAdmin");

  if (asCompany) {
    // Redirect company users to their dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // if (asOEMSupervisor) {
  //   // Redirect OEM supervisor users to their dashboard
  //   return <Navigate to="/dashboard" replace />;
  // }

  // if (asTechnician) {
  //   // Redirect technician users to their dashboard
  //   return <Navigate to="/dashboard" replace />;
  // }

  // if (asPlantSupervisor) {
  //   // Redirect plant supervisor users to their dashboard
  //   return <Navigate to="/dashboard" replace />;
  // }

  // if (asAdmin) {
  //   // Redirect admin users to their dashboard
  //   return <Navigate to="/dashboard" replace />;
  // }

  // If not logged in, show public page
  return children;
};

export default PublicRoute;
