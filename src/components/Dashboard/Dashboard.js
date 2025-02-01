// import React, { useEffect, useState, useCallback } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import api from "../../api.js";

// function Dashboard() {
//   // Main state
//   const [inventory, setInventory] = useState([]);
//   const [logs, setLogs] = useState([]);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   // For category dropdown in main grid
//   const [expandedCategories, setExpandedCategories] = useState({});
//   // State for side panel (holds recent activity & quick actions)
//   const [showSidePanel, setShowSidePanel] = useState(false);
//   const [activeSideTab, setActiveSideTab] = useState("quick"); // "quick" or "recent"

//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     try {
//       const decoded = jwtDecode(token);
//       setUser(decoded);
//     } catch (error) {
//       localStorage.removeItem("token");
//       navigate("/login");
//     }
//   }, [navigate]);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [inventoryRes, logsRes] = await Promise.all([
//         api.get("/inventory/"),
//         api.get("/logs/"),
//       ]);
//       setInventory(inventoryRes.data.data || []);
//       setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       if (error.response?.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (user) {
//       fetchData();
//     }
//   }, [user, fetchData]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   // Delete function for an inventory item (now requires name and company)
//   const handleDelete = async (name, company) => {
//     if (!window.confirm(`Are you sure you want to delete "${name}" from ${company}?`))
//       return;
//     try {
//       await api.delete("/inventory/delete", { data: { name, company } });
//       setInventory((prev) =>
//         prev.filter((item) => !(item.name === name && item.company === company))
//       );
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   // Extract unique non-empty categories from inventory items
//   const categories = Array.from(
//     new Set(inventory.map((item) => item.category).filter(Boolean))
//   );

//   // Toggle dropdown for a specific category in Categories section
//   const toggleExpand = (cat) => {
//     setExpandedCategories((prev) => ({
//       ...prev,
//       [cat]: !prev[cat],
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-200">
//         <p className="text-xl">Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen relative bg-gray-200 p-6">
//       {/* Title */}
//       <div
//         className="text-gray-800 text-4xl font-bold uppercase mb-4 tracking-wide text-center"
//         style={{ fontFamily: "Reospec" }}
//       >
//         HINDUSTAN ELECTRIC
//       </div>

//       {/* Navbar */}
//       <nav
//         className="py-4 px-6 w-full max-w-4xl mx-auto rounded-xl mb-8"
//         style={{
//           background: "#e0e0e0",
//           boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//         }}
//       >
//         <div className="flex justify-between items-center">
//           <h1 className="text-xl text-gray-800">Dashboard</h1>
//           <div className="flex space-x-4">
//             <NavLink to="/dashboard" className="hover:text-yellow-500 text-gray-800">
//               Home
//             </NavLink>
//             {user?.role === "admin" && (
//               <NavLink to="/create-user" className="hover:text-yellow-500 text-gray-800">
//                 Create User
//               </NavLink>
//             )}
//             <NavLink to="/inventory" className="hover:text-yellow-500 text-gray-800">
//               Inventory
//             </NavLink>
//             <NavLink to="/logs" className="hover:text-yellow-500 text-gray-800">
//               Logs
//             </NavLink>
//             <NavLink to="/calendar" className="hover:text-yellow-500 text-gray-800">
//               Calendar
//             </NavLink>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Main Grid: Inventory Summary & Categories */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
//         {/* Inventory Summary */}
//         <section
//           className="p-6 rounded-xl"
//           style={{
//             background: "#e0e0e0",
//             boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//           }}
//         >
//           <h2 className="text-xl text-gray-800 mb-4">Inventory Summary</h2>
//           <ul className="space-y-2">
//             {inventory.map((item, index) => (
//               <li
//                 key={index}
//                 className="flex justify-between items-center p-3 rounded-xl"
//                 style={{
//                   background: "#e0e0e0",
//                   boxShadow:
//                     "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//                 }}
//               >
//                 <div>
//                   <p className="font-semibold text-gray-800">
//                     {item.name}{" "}
//                     {item.company && (
//                       <span className="text-sm text-gray-600">
//                         ({item.company})
//                       </span>
//                     )}
//                     {item.category && (
//                       <span className="text-sm text-gray-600">
//                         {" "}
//                         - {item.category}
//                       </span>
//                     )}
//                   </p>
//                   <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <p className="text-lg font-bold text-gray-800">
//                     ₹
//                     {item.total_value
//                       ? item.total_value.toFixed(2)
//                       : (item.quantity * item.unit_price).toFixed(2)}
//                   </p>
//                   <button
//                     onClick={() => handleDelete(item.name, item.company)}
//                     className="text-red-500 hover:text-red-700 text-sm"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </section>

//         {/* Categories Section */}
//         <section
//           className="p-6 rounded-xl overflow-auto"
//           style={{
//             background: "#e0e0e0",
//             boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//           }}
//         >
//           <h2 className="text-xl text-gray-800 mb-4">Categories</h2>
//           {categories.length === 0 ? (
//             <p className="text-gray-600">No categories available</p>
//           ) : (
//             categories.map((cat, index) => (
//               <div
//                 key={index}
//                 className="mb-4 border border-white/30 rounded-xl p-3"
//               >
//                 <button
//                   className="w-full text-left font-semibold text-gray-800 focus:outline-none"
//                   onClick={() => toggleExpand(cat)}
//                 >
//                   {cat}
//                 </button>
//                 {expandedCategories[cat] && (
//                   <ul className="mt-2 space-y-1">
//                     {inventory
//                       .filter((item) => item.category === cat)
//                       .map((item, idx) => (
//                         <li
//                           key={idx}
//                           className="flex justify-between items-center border border-white/20 p-2 rounded-md"
//                         >
//                           <span className="text-gray-800">{item.name}</span>
//                           <span className="text-gray-800">
//                             Qty: {item.quantity}
//                           </span>
//                         </li>
//                       ))}
//                   </ul>
//                 )}
//               </div>
//             ))
//           )}
//         </section>
//       </div>

//       {/* Floating Button to Toggle Side Panel */}
//       <button
//         onClick={() => setShowSidePanel(!showSidePanel)}
//         className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all z-50"
//         style={{
//           boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//         }}
//       >
//         {showSidePanel ? "Close Panel" : "Open Panel"}
//       </button>

//       {/* Side Panel for Recent Activity & Quick Actions */}
//       {showSidePanel && (
//         <div
//           className="fixed top-20 right-8 w-80 h-[70%] rounded-xl p-4 overflow-auto z-40"
//           style={{
//             background: "#e0e0e0",
//             boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//           }}
//         >
//           <div className="flex justify-around mb-4">
//             <button
//               onClick={() => setActiveSideTab("recent")}
//               className={`px-3 py-1 rounded-md ${
//                 activeSideTab === "recent"
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-800"
//               }`}
//               style={{
//                 boxShadow:
//                   activeSideTab === "recent"
//                     ? "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//                     : "",
//               }}
//             >
//               Recent Activity
//             </button>
//             <button
//               onClick={() => setActiveSideTab("quick")}
//               className={`px-3 py-1 rounded-md ${
//                 activeSideTab === "quick"
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-800"
//               }`}
//               style={{
//                 boxShadow:
//                   activeSideTab === "quick"
//                     ? "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//                     : "",
//               }}
//             >
//               Quick Actions
//             </button>
//           </div>
//           {activeSideTab === "recent" && (
//             <div>
//               <h3 className="text-lg text-gray-800 mb-2">Recent Activity</h3>
//               <ul className="space-y-2">
//                 {logs.slice(0, 5).map((log, index) => {
//                   const quantityValue =
//                     log.quantity_added || log.quantity_sold || log.quantity;
//                   return (
//                     <li
//                       key={index}
//                       className="flex justify-between items-center p-2 rounded-md"
//                       style={{
//                         background: "#e0e0e0",
//                         boxShadow:
//                           "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//                       }}
//                     >
//                       <div>
//                         <p className="text-sm text-gray-800">{log.item_name}</p>
//                         <p className="text-xs text-gray-600">
//                           {new Date(log.timestamp).toLocaleDateString()}
//                         </p>
//                       </div>
//                       <p className="text-sm text-gray-800">
//                         {log.action} ({quantityValue})
//                       </p>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           )}
//           {activeSideTab === "quick" && (
//             <div>
//               <h3 className="text-lg text-gray-800 mb-2">Quick Actions</h3>
//               <div className="space-y-3">
//                 <button
//                   onClick={() => navigate("/inventory/add")}
//                   className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
//                   style={{
//                     boxShadow:
//                       "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//                   }}
//                 >
//                   Add Inventory
//                 </button>
//                 <button
//                   onClick={() => navigate("/logs/allot")}
//                   className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all"
//                   style={{
//                     boxShadow:
//                       "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//                   }}
//                 >
//                   Allot Items
//                 </button>
//                 {user?.role === "admin" && (
//                   <button
//                     onClick={() => navigate("/create-user")}
//                     className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-all"
//                     style={{
//                       boxShadow:
//                         "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//                     }}
//                   >
//                     Create User
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;


import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api.js";

function Dashboard() {
  // Main state
  const [inventory, setInventory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // For category dropdown in main grid
  const [expandedCategories, setExpandedCategories] = useState({});
  // State for side panel (holds recent activity & quick actions)
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState("quick"); // "quick" or "recent"

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [inventoryRes, logsRes] = await Promise.all([
        api.get("/inventory/"),
        api.get("/logs/"),
      ]);
      setInventory(inventoryRes.data.data || []);
      setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Delete function for an inventory item (now requires name and company)
  const handleDelete = async (name, company) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from ${company}?`))
      return;
    try {
      await api.delete("/inventory/delete", { data: { name, company } });
      setInventory((prev) =>
        prev.filter((item) => !(item.name === name && item.company === company))
      );
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Extract unique non-empty categories from inventory items
  const categories = Array.from(
    new Set(inventory.map((item) => item.category).filter(Boolean))
  );

  // Toggle dropdown for a specific category in Categories section
  const toggleExpand = (cat) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gray-200 p-6">
      {/* Title */}
      <div
        className="text-gray-800 text-4xl font-bold uppercase mb-4 tracking-wide text-center"
        style={{ fontFamily: "Reospec" }}
      >
        HINDUSTAN ELECTRIC
      </div>

      {/* Navbar */}
      <nav
        className="py-4 px-6 w-full max-w-4xl mx-auto rounded-xl mb-8"
        style={{
          background: "#e0e0e0",
          boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
        }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl text-gray-800">Dashboard</h1>
          <div className="flex space-x-4">
            <NavLink to="/dashboard" className="hover:text-yellow-500 text-gray-800">
              Home
            </NavLink>
            {user?.role === "admin" && (
              <NavLink to="/create-user" className="hover:text-yellow-500 text-gray-800">
                Create User
              </NavLink>
            )}
            <NavLink to="/inventory" className="hover:text-yellow-500 text-gray-800">
              Inventory
            </NavLink>
            <NavLink to="/logs" className="hover:text-yellow-500 text-gray-800">
              Logs
            </NavLink>
            <NavLink to="/calendar" className="hover:text-yellow-500 text-gray-800">
              Calendar
            </NavLink>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Grid: Inventory Summary & Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Inventory Summary */}
        <section
          className="p-6 rounded-xl"
          style={{
            background: "#e0e0e0",
            boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
          }}
        >
          <h2 className="text-xl text-gray-800 mb-4">Inventory Summary</h2>
          <ul className="space-y-2">
            {inventory.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 rounded-xl"
                style={{
                  background: "#e0e0e0",
                  boxShadow:
                    "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
                }}
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.name}{" "}
                    {item.company && (
                      <span className="text-sm text-gray-600">
                        ({item.company})
                      </span>
                    )}
                    {item.category && (
                      <span className="text-sm text-gray-600">
                        {" "} - {item.category}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-bold text-gray-800">
                    ₹
                    {item.total_value
                      ? item.total_value.toFixed(2)
                      : (item.quantity * item.unit_price).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleDelete(item.name, item.company)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Categories Section */}
        <section
          className="p-6 rounded-xl overflow-auto"
          style={{
            background: "#e0e0e0",
            boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
          }}
        >
          <h2 className="text-xl text-gray-800 mb-4">Categories</h2>
          {categories.length === 0 ? (
            <p className="text-gray-600">No categories available</p>
          ) : (
            categories.map((cat, index) => (
              <div
                key={index}
                className="mb-4 border border-white/30 rounded-xl p-3"
              >
                <button
                  className="w-full text-left font-semibold text-gray-800 focus:outline-none"
                  onClick={() => toggleExpand(cat)}
                >
                  {cat}
                </button>
                {expandedCategories[cat] && (
                  <ul className="mt-2 space-y-1">
                    {inventory
                      .filter((item) => item.category === cat)
                      .map((item, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center border border-white/20 p-2 rounded-md"
                        >
                          <span className="text-gray-800">{item.name}</span>
                          <span className="text-gray-800">
                            Qty: {item.quantity}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </section>
      </div>

      {/* Floating Button to Toggle Side Panel */}
      <button
        onClick={() => setShowSidePanel(!showSidePanel)}
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all z-50"
        style={{
          boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
        }}
      >
        {showSidePanel ? "Close Panel" : "Open Panel"}
      </button>

      {/* Side Panel for Recent Activity & Quick Actions */}
      {showSidePanel && (
        <div
          className="fixed top-20 right-8 w-80 h-[70%] rounded-xl p-4 overflow-auto z-40"
          style={{
            background: "#e0e0e0",
            boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
          }}
        >
          <div className="flex justify-around mb-4">
            <button
              onClick={() => setActiveSideTab("recent")}
              className={`px-3 py-1 rounded-md ${
                activeSideTab === "recent"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              style={{
                boxShadow:
                  activeSideTab === "recent"
                    ? "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
                    : "",
              }}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveSideTab("quick")}
              className={`px-3 py-1 rounded-md ${
                activeSideTab === "quick"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              style={{
                boxShadow:
                  activeSideTab === "quick"
                    ? "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
                    : "",
              }}
            >
              Quick Actions
            </button>
          </div>
          {activeSideTab === "recent" && (
            <div>
              <h3 className="text-lg text-gray-800 mb-2">Recent Activity</h3>
              <ul className="space-y-2">
                {logs.slice(0, 5).map((log, index) => {
                  const quantityValue =
                    log.quantity_added || log.quantity_sold || log.quantity || "N/A";
                  const dateValue = log.timestamp
                    ? new Date(log.timestamp).toLocaleString()
                    : log.date_alloted
                    ? new Date(log.date_alloted).toLocaleString()
                    : log.date_returned
                    ? new Date(log.date_returned).toLocaleString()
                    : "N/A";
                  let buyerName = "N/A";
                  if (log.action === "sell" || log.action === "return") {
                    buyerName = log.buyer || "N/A";
                  } else {
                    buyerName = log.performed_by || "N/A";
                  }
                  return (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{dateValue}</td>
                      <td className="px-4 py-2">{log.item_name}</td>
                      <td className="px-4 py-2">{log.action}</td>
                      <td className="px-4 py-2">{quantityValue}</td>
                      <td className="px-4 py-2">{buyerName}</td>
                    </tr>
                  );
                })}
              </ul>
            </div>
          )}
          {activeSideTab === "quick" && (
            <div>
              <h3 className="text-lg text-gray-800 mb-2">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/inventory/add")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                  style={{
                    boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
                  }}
                >
                  Add Inventory
                </button>
                <button
                  onClick={() => navigate("/logs/allot")}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all"
                  style={{
                    boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
                  }}
                >
                  Sell Item
                </button>
                <button
                  onClick={() => navigate("/logs/return")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                  style={{
                    boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
                  }}
                >
                  Return Item
                </button>
                {user?.role === "admin" && (
                  <button
                    onClick={() => navigate("/create-user")}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-all"
                    style={{
                      boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
                    }}
                  >
                    Create User
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
