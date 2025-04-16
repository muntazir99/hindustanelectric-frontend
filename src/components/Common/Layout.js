// // src/components/Common/Layout.js
// import React, { useEffect, useState, useCallback } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import api from "../../api.js";
// import Sidebar from "./Sidebar.js";
// import SidePanel from "./Sidepanel.js"; // Import your custom Sidebar

// function Layout({ user, handleLogout }) {
//   const [showSidePanel, setShowSidePanel]=useState(false);
//   const [activeSideTab, setActiveSideTab] = useState("quick");
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // (Optional) If logs are needed by sidebar, fetching example:
//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const logsRes = await api.get("/logs/");
//       setLogs(Array.isArray(logsRes.data.data) ? logsRes.data.data : []);
//     } catch (error) {
//       console.error("Error fetching logs:", error);
//       if (error.response?.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (user) fetchData();
//   }, [user, fetchData]);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar user={user} handleLogout={handleLogout} />
//       <main className="flex-grow p-6">
//         <Outlet />
//       </main>
//       <SidePanel
//         user={user}
//         setShowSidePanel={setShowSidePanel}
//         setActiveSideTab={setActiveSideTab}
//         showSidePanel={showSidePanel}
//         activeSideTab={activeSideTab}
//         logs={logs}
//       />
//     </div>
//   );
// }

// export default Layout;


// src/components/Common/Layout.js
import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../../api.js";
import Sidebar from "./Sidebar.js";
import SidePanel from "./Sidepanel.js";

function Layout({ user, handleLogout }) {
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState("quick");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // (Optional) If logs are needed by the side panel:
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const logsRes = await api.get("/logs/");
      setLogs(Array.isArray(logsRes.data.data) ? logsRes.data.data : []);
    } catch (error) {
      console.error("Error fetching logs:", error);
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed Left Sidebar */}
      <Sidebar
        user={user}
        handleLogout={handleLogout}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Main content container; adjust margin-left based on sidebar width */}
      <main
        className="flex-grow p-6 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "4rem" : "16rem" }}
      >
        <Outlet />
      </main>

      {/* Right SidePanel remains as is */}
      <SidePanel
        user={user}
        setShowSidePanel={setShowSidePanel}
        setActiveSideTab={setActiveSideTab}
        showSidePanel={showSidePanel}
        activeSideTab={activeSideTab}
        logs={logs}
      />
    </div>
  );
}

export default Layout;
