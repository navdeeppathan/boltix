import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const asCompany = localStorage.getItem("asCompany");

  if (asCompany) {
    // Redirect company users to their dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, show public page
  return children;
};

export default PublicRoute;
