// src/components/Common/Layout.js
import React, { useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.js";
import SidePanel from "./Sidepanel.js";
import { useState } from "react";
import api from "../../api.js"

function Layout({ user, handleLogout }) {
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState("quick");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [logsRes] = await Promise.all([
        api.get("/logs/"),
      ]);
      // logsRes.data is expected to be an object: { success: true, data: [...] }
      setLogs(Array.isArray(logsRes.data.data) ? logsRes.data.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="max-w-7xl mx-auto p-6">
        <Outlet />
      </div>
      <SidePanel user={user} setShowSidePanel={setShowSidePanel} setActiveSideTab={setActiveSideTab} showSidePanel={showSidePanel} activeSideTab={activeSideTab} logs={logs} />
    </div>
  );
}

export default Layout;
