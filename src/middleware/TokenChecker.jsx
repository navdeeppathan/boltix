import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

const TokenChecker = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // 🚨 No token, force redirect
      navigate("/");
      return;
    }
  }, []);

  return null;
};

export default TokenChecker;
