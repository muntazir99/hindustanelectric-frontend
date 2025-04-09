
// src/components/Dashboard/Dashboard.js
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api.js";

// Chart.js and react-chartjs-2 imports
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // For independent category expansion
  const [expandedCategories, setExpandedCategories] = useState({});
  // Side panel state
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState("quick");

  const navigate = useNavigate();

  // Decode user from token
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

  // Fetch inventory and logs
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [invRes, logsRes] = await Promise.all([
        api.get("/inventory/"),
        api.get("/logs/"),
      ]);
      setInventory(invRes.data.data || []);
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

  // Delete an item from inventory
  const handleDelete = async (name, company) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from ${company}?`))
      return;
    try {
      await api.delete("/inventory/delete", { data: { name, company } });
      setInventory(prev =>
        prev.filter(item => !(item.name === name && item.company === company))
      );
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Extract unique categories (non-empty)
  const categories = Array.from(new Set(inventory.map(item => item.category).filter(Boolean)));

  // Toggle expansion for a category (allows independent expansion)
  const toggleExpand = (cat) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  // --- Sales & Purchase Calculations ---
  let totalCost = 0;
  let totalRevenue = 0;
  logs.forEach(log => {
    if (log.action === "add_inventory") {
      const qty = Number(log.quantity_added) || 0;
      const price = Number(log.unit_price) || 0;
      totalCost += qty * price;
    } else if (log.action === "sell") {
      const qty = Number(log.quantity_sold) || Number(log.quantity) || 0;
      const price = Number(log.price) || 0;
      totalRevenue += qty * price;
    }
  });

  // --- Profit Calculation ---
  // For each sell log, find matching inventory record's unit_price (as cost)
  const sellLogs = logs.filter(
    log => typeof log.action === "string" && log.action.toLowerCase() === "sell"
  );
  const totalProfit = sellLogs.reduce((sum, log) => {
    const matchingItem = inventory.find(item =>
      item.name.toLowerCase() === log.item_name.toLowerCase() &&
      item.company.toLowerCase() === log.company.toLowerCase()
    );
    const costPrice = matchingItem ? Number(matchingItem.unit_price) : 0;
    const qty = Number(log.quantity_sold) || Number(log.quantity) || 0;
    const sellPrice = Number(log.price) || 0;
    return sum + (sellPrice - costPrice) * qty;
  }, 0);

  // Chart for Money Spent vs Money Earned
  const chartDataSpentEarned = {
    labels: ["Money Spent", "Money Earned"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [totalCost, totalRevenue],
        backgroundColor: ["#f87171", "#34d399"],
      },
    ],
  };

  // Chart for Total Sales vs Profit Earned
  const salesProfitChartData = {
    labels: ["Total Sales", "Profit Earned"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [totalRevenue, totalProfit],
        backgroundColor: ["#34d399", "#facc15"],
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 p-6 relative">
      {/* Two-column layout: Inventory Summary and Sales Summary */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {inventory.map((item, index) => {
              const totalVal = item.total_value || item.quantity * item.unit_price || 0;
              return (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 rounded-xl"
                  style={{
                    background: "#e0e0e0",
                    boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
                  }}
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.name}{" "}
                      {item.company && (
                        <span className="text-sm text-gray-600">({item.company})</span>
                      )}
                      {item.category && (
                        <span className="text-sm text-gray-600"> - {item.category}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-bold text-gray-800">
                      ₹{totalVal.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleDelete(item.name, item.company)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Sales Summary Section */}
        <section
          className="p-6 rounded-xl space-y-6"
          style={{
            background: "#e0e0e0",
            boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
          }}
        >
          <h2 className="text-xl text-gray-800 mb-4">Sales Summary</h2>
          {/* Chart: Money Spent vs Earned */}
          <div>
            <Bar
              data={chartDataSpentEarned}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Money Spent vs Earned",
                    font: { size: 16 },
                  },
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { color: "#333" },
                    grid: { color: "#ddd" },
                  },
                  x: {
                    ticks: { color: "#333" },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
          {/* Chart: Total Sales vs Profit Earned */}
          <div>
            <Bar
              data={salesProfitChartData}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Total Sales vs Profit Earned",
                    font: { size: 16 },
                  },
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { color: "#333" },
                    grid: { color: "#ddd" },
                  },
                  x: {
                    ticks: { color: "#333" },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 text-center text-lg font-semibold">
            Net Profit: ₹{totalProfit > 0 ? totalProfit.toFixed(2) : "0.00"}
          </div>
        </section>
      </div>

      {/* Categories Grid */}
      <div className="max-w-6xl mx-auto mt-8">
        <h2 className="text-xl text-gray-800 mb-4">Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-600">No categories available</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="p-4 rounded-xl"
                style={{
                  background: "#e0e0e0",
                  boxShadow: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
                }}
              >
                <button
                  className="w-full text-left font-semibold text-gray-800 focus:outline-none"
                  onClick={() => toggleExpand(cat)}
                >
                  {cat}
                </button>
                {expandedCategories[cat] && (
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    {inventory
                      .filter(item => item.category === cat)
                      .map((item, idx) => (
                        <li key={idx} className="border-b py-1">
                          {item.name} ({item.company}) - Qty: {item.quantity}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
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
              className={`px-3 py-1 rounded-md ${activeSideTab === "recent" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              style={{
                boxShadow: activeSideTab === "recent" ? "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff" : "",
              }}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveSideTab("quick")}
              className={`px-3 py-1 rounded-md ${activeSideTab === "quick" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              style={{
                boxShadow: activeSideTab === "quick" ? "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff" : "",
              }}
            >
              Quick Actions
            </button>
          </div>

          {activeSideTab === "recent" && (
            <div>
              <h3 className="text-lg text-gray-800 mb-2">Recent Activity</h3>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-2 py-1 text-sm text-center">Date</th>
                    <th className="px-2 py-1 text-sm text-center">Item</th>
                    <th className="px-2 py-1 text-sm text-center">Action</th>
                    <th className="px-2 py-1 text-sm text-center">Qty</th>
                    <th className="px-2 py-1 text-sm text-center">Buyer</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 5).map((log, index) => {
                    const quantityValue = log.quantity_added || log.quantity_sold || log.quantity || "N/A";
                    const buyerName =
                      log.buyer && log.buyer.trim() !== ""
                        ? log.buyer
                        : log.company && log.company.trim() !== ""
                          ? log.company
                          : "n/a";
                    const dateValue = log.timestamp
                      ? new Date(log.timestamp).toLocaleString()
                      : log.date_alloted
                        ? new Date(log.date_alloted).toLocaleString()
                        : log.date_returned
                          ? new Date(log.date_returned).toLocaleString()
                          : "N/A";
                    return (
                      <tr key={index} className="border-b">
                        <td className="px-2 py-1 text-xs text-center">{dateValue}</td>
                        <td className="px-2 py-1 text-xs text-center">{log.item_name}</td>
                        <td className="px-2 py-1 text-xs text-center">{log.action}</td>
                        <td className="px-2 py-1 text-xs text-center">{quantityValue}</td>
                        <td className="px-2 py-1 text-xs text-center">{buyerName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeSideTab === "quick" && (
            <div>
              <h3 className="text-lg text-gray-800 mb-2">Quick Actions</h3>
              <div className="space-y-3">
                {
                  user.role === "admin" ? (
                    <>
                      <button
                        onClick={() => navigate("/inventory/add")}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                        style={{ boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff" }}
                      >
                        Add Inventory
                      </button>
                      <button
                        onClick={() => navigate("/logs/allot")}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all"
                        style={{ boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff" }}
                      >
                        Sell Item
                      </button>
                      <button
                        onClick={() => navigate("/logs/return")}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                        style={{ boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff" }}
                      >
                        Return Item
                      </button>
                      {user?.role === "admin" && (
                        <button
                          onClick={() => navigate("/create-user")}
                          className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-all"
                          style={{ boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff" }}
                        >
                          Create User
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate("/logs/allot")}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all"
                        style={{ boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff" }}
                      >
                        Sell Item
                      </button>
                      <button
                        onClick={() => navigate("/logs/return")}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                        style={{ boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff" }}
                      >
                        Return Item
                      </button>
                    </>
                  )
                }
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
