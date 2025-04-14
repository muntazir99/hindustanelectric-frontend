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
  const [expandedCategories, setExpandedCategories] = useState({});
  // State for selecting sales chart view: daily, weekly, or monthly
  const [saleChartView, setSaleChartView] = useState("daily");

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
      // Expecting logs data to be in the field "data"
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
    if (
      !window.confirm(`Are you sure you want to delete "${name}" from ${company}?`)
    )
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

  // Extract unique categories (non-empty)
  const categories = Array.from(
    new Set(inventory.map((item) => item.category).filter(Boolean))
  );

  // Toggle expansion for a category (allows independent expansion)
  const toggleExpand = (cat) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  // --- Sales & Purchase Calculations ---
  let totalCost = 0;
  let totalRevenue = 0;
  logs.forEach((log) => {
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
  const sellLogs = logs.filter(
    (log) => typeof log.action === "string" && log.action.toLowerCase() === "sell"
  );
  const totalProfit = sellLogs.reduce((sum, log) => {
    const matchingItem = inventory.find(
      (item) =>
        item.name.toLowerCase() === log.item_name.toLowerCase() &&
        item.company.toLowerCase() === log.company.toLowerCase()
    );
    const costPrice = matchingItem ? Number(matchingItem.unit_price) : 0;
    const qty = Number(log.quantity_sold) || Number(log.quantity) || 0;
    const sellPrice = Number(log.price) || 0;
    return sum + (sellPrice - costPrice) * qty;
  }, 0);

  // Chart for Money Spent vs Money Earned (existing chart)
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

  // Chart for Total Sales vs Profit Earned (existing chart)
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

  // --- Aggregated Sales & Profit Data for Trends ---
  // Group logs (only sell actions) by a time interval (daily, weekly or monthly).
  // (Using "timestamp" field from backend for grouping.)
  const groupLogsBy = (logsArray, view) => {
    const groups = {};
    logsArray.forEach((log) => {
      if (typeof log.action !== "string" || log.action.toLowerCase() !== "sell")
        return;
      if (!log.timestamp) return; // Skip if no timestamp exists

      const logDate = new Date(log.timestamp);
      if (isNaN(logDate.getTime())) return; // Skip if the date is invalid

      let key;
      if (view === "daily") {
        key = logDate.toISOString().slice(0, 10); // YYYY-MM-DD
      } else if (view === "weekly") {
        const firstDay = new Date(logDate.getFullYear(), 0, 1);
        const pastDays = Math.floor((logDate - firstDay) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
        key = `${logDate.getFullYear()}-W${weekNumber}`;
      } else if (view === "monthly") {
        key = logDate.toISOString().slice(0, 7); // YYYY-MM
      }
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(log);
    });
    return groups;
  };

  const getAggregatedChartData = () => {
    const groups = groupLogsBy(logs, saleChartView);
    const sortedKeys = Object.keys(groups).sort(); // ISO strings sort correctly
    const labels = sortedKeys;
    const salesData = sortedKeys.map((key) => {
      const group = groups[key];
      return group.reduce((sum, log) => {
        const qty = Number(log.quantity_sold) || Number(log.quantity) || 0;
        const price = Number(log.price) || 0;
        return sum + qty * price;
      }, 0);
    });
    const profitData = sortedKeys.map((key) => {
      const group = groups[key];
      return group.reduce((sum, log) => {
        const matchingItem = inventory.find(
          (item) =>
            item.name.toLowerCase() === log.item_name.toLowerCase() &&
            item.company.toLowerCase() === log.company.toLowerCase()
        );
        const costPrice = matchingItem ? Number(matchingItem.unit_price) : 0;
        const qty = Number(log.quantity_sold) || Number(log.quantity) || 0;
        const sellPrice = Number(log.price) || 0;
        return sum + (sellPrice - costPrice) * qty;
      }, 0);
    });
    return {
      labels,
      datasets: [
        {
          label: "Sales",
          data: salesData,
          backgroundColor: "#34d399",
        },
        {
          label: "Profit",
          data: profitData,
          backgroundColor: "#facc15",
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* New Dashboard Overview Section: Two cards on left; graph on right */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Left Column: Two Cards */}
        <div className="col-span-1 flex flex-col space-y-4">
          <div className="p-4 bg-white border border-gray-300 rounded-md shadow-sm">
            <p className="text-gray-500">Total Sale</p>
            <p className="text-2xl font-bold text-gray-800">
              ₹{totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-300 rounded-md shadow-sm">
            <p className="text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-800">
              {inventory.length}
            </p>
          </div>
        </div>
        {/* Right Column: Trends Graph */}
        <div className="col-span-2 bg-white border border-gray-300 rounded-md p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-gray-800">
              Sales & Profit Trends (
              {saleChartView.charAt(0).toUpperCase() + saleChartView.slice(1)})
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setSaleChartView("daily")}
                className={`px-3 py-1 border rounded-md ${
                  saleChartView === "daily"
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setSaleChartView("weekly")}
                className={`px-3 py-1 border rounded-md ${
                  saleChartView === "weekly"
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setSaleChartView("monthly")}
                className={`px-3 py-1 border rounded-md ${
                  saleChartView === "monthly"
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <Bar
            data={getAggregatedChartData()}
            options={{
              plugins: {
                legend: { display: true },
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
      </div>

      {/* Two-column layout: Inventory Summary and Sales Summary */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inventory Summary */}
        <section className="p-6 rounded-xl bg-white border border-gray-300">
          <h2 className="text-xl text-gray-800 mb-4">Inventory Summary</h2>
          {/* Scrollable container */}
          <div className="max-h-[600px] overflow-y-auto">
            <ul className="space-y-2">
              {inventory.map((item, index) => {
                const totalVal =
                  item.total_value || item.quantity * item.unit_price || 0;
                return (
                  <li
                    key={index}
                    className="flex justify-between items-center p-3 rounded-md bg-gray-50 border border-gray-200"
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
                            {" "}
                            - {item.category}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
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
          </div>
        </section>

        {/* Sales Summary Section */}
        <section className="p-6 rounded-xl bg-white border border-gray-300 space-y-6">
          <h2 className="text-xl text-gray-800 mb-4">Sales Summary</h2>
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
          <div className="mt-4 text-center text-lg font-semibold text-gray-800">
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
                className="p-4 rounded-md bg-white border border-gray-300"
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
                      .filter((item) => item.category === cat)
                      .map((item, idx) => (
                        <li key={idx} className="border-b border-gray-200 py-1">
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
    </div>
  );
}

export default Dashboard;

// // src/components/Dashboard/Dashboard.js
// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import api from "../../api.js";

// // Chart.js and react-chartjs-2 imports
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// function Dashboard() {
//   const [inventory, setInventory] = useState([]);
//   const [logs, setLogs] = useState([]);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // For independent category expansion
//   const [expandedCategories, setExpandedCategories] = useState({});

//   const navigate = useNavigate();

//   // Decode user from token
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

//   // Fetch inventory and logs
//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [invRes, logsRes] = await Promise.all([
//         api.get("/inventory/"),
//         api.get("/logs/"),
//       ]);
//       setInventory(invRes.data.data || []);
//       // logsRes.data is expected to be an object: { success: true, data: [...] }
//       setLogs(Array.isArray(logsRes.data.data) ? logsRes.data.data : []);
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

//   // Delete an item from inventory
//   const handleDelete = async (name, company) => {
//     if (!window.confirm(`Are you sure you want to delete "${name}" from ${company}?`))
//       return;
//     try {
//       await api.delete("/inventory/delete", { data: { name, company } });
//       setInventory(prev =>
//         prev.filter(item => !(item.name === name && item.company === company))
//       );
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   // Extract unique categories (non-empty)
//   const categories = Array.from(new Set(inventory.map(item => item.category).filter(Boolean)));

//   // Toggle expansion for a category (allows independent expansion)
//   const toggleExpand = (cat) => {
//     setExpandedCategories(prev => ({
//       ...prev,
//       [cat]: !prev[cat],
//     }));
//   };

//   // --- Sales & Purchase Calculations ---
//   let totalCost = 0;
//   let totalRevenue = 0;
//   logs.forEach(log => {
//     if (log.action === "add_inventory") {
//       const qty = Number(log.quantity_added) || 0;
//       const price = Number(log.unit_price) || 0;
//       totalCost += qty * price;
//     } else if (log.action === "sell") {
//       const qty = Number(log.quantity_sold) || Number(log.quantity) || 0;
//       const price = Number(log.price) || 0;
//       totalRevenue += qty * price;
//     }
//   });

//   // --- Profit Calculation ---
//   // For each sell log, find matching inventory record's unit_price (as cost)
//   const sellLogs = logs.filter(
//     log => typeof log.action === "string" && log.action.toLowerCase() === "sell"
//   );
//   const totalProfit = sellLogs.reduce((sum, log) => {
//     const matchingItem = inventory.find(item =>
//       item.name.toLowerCase() === log.item_name.toLowerCase() &&
//       item.company.toLowerCase() === log.company.toLowerCase()
//     );
//     const costPrice = matchingItem ? Number(matchingItem.unit_price) : 0;
//     const qty = Number(log.quantity_sold) || Number(log.quantity) || 0;
//     const sellPrice = Number(log.price) || 0;
//     return sum + (sellPrice - costPrice) * qty;
//   }, 0);

//   // Chart for Money Spent vs Money Earned
//   const chartDataSpentEarned = {
//     labels: ["Money Spent", "Money Earned"],
//     datasets: [
//       {
//         label: "Amount (₹)",
//         data: [totalCost, totalRevenue],
//         backgroundColor: ["#f87171", "#34d399"],
//       },
//     ],
//   };

//   // Chart for Total Sales vs Profit Earned
//   const salesProfitChartData = {
//     labels: ["Total Sales", "Profit Earned"],
//     datasets: [
//       {
//         label: "Amount (₹)",
//         data: [totalRevenue, totalProfit],
//         backgroundColor: ["#34d399", "#facc15"],
//       },
//     ],
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-200">
//         <p className="text-xl">Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-200 p-6 relative">
//       {/* Two-column layout: Inventory Summary and Sales Summary */}
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Inventory Summary */}
//         <section
//           className="p-6 rounded-xl"
//           style={{
//             background: "#e0e0e0",
//             boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//           }}
//         >
//           <h2 className="text-xl text-gray-800 mb-4">Inventory Summary</h2>
//           {/* Wrapping the list in a div to make it scrollable after a certain height */}
//           <div className="max-h-[600px] overflow-y-auto">
//             <ul className="space-y-2">
//               {inventory.map((item, index) => {
//                 const totalVal = item.total_value || item.quantity * item.unit_price || 0;
//                 return (
//                   <li
//                     key={index}
//                     className="flex justify-between items-center p-3 rounded-xl"
//                     style={{
//                       background: "#e0e0e0",
//                       boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//                     }}
//                   >
//                     <div>
//                       <p className="font-semibold text-gray-800">
//                         {item.name}{" "}
//                         {item.company && (
//                           <span className="text-sm text-gray-600">({item.company})</span>
//                         )}
//                         {item.category && (
//                           <span className="text-sm text-gray-600"> - {item.category}</span>
//                         )}
//                       </p>
//                       <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <p className="text-lg font-bold text-gray-800">
//                         ₹{totalVal.toFixed(2)}
//                       </p>
//                       <button
//                         onClick={() => handleDelete(item.name, item.company)}
//                         className="text-red-500 hover:text-red-700 text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         </section>

//         {/* Sales Summary Section */}
//         <section
//           className="p-6 rounded-xl space-y-6"
//           style={{
//             background: "#e0e0e0",
//             boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//           }}
//         >
//           <h2 className="text-xl text-gray-800 mb-4">Sales Summary</h2>
//           {/* Chart: Money Spent vs Earned */}
//           <div>
//             <Bar
//               data={chartDataSpentEarned}
//               options={{
//                 plugins: {
//                   title: {
//                     display: true,
//                     text: "Money Spent vs Earned",
//                     font: { size: 16 },
//                   },
//                   legend: { display: false },
//                 },
//                 scales: {
//                   y: {
//                     beginAtZero: true,
//                     ticks: { color: "#333" },
//                     grid: { color: "#ddd" },
//                   },
//                   x: {
//                     ticks: { color: "#333" },
//                     grid: { display: false },
//                   },
//                 },
//               }}
//             />
//           </div>
//           {/* Chart: Total Sales vs Profit Earned */}
//           <div>
//             <Bar
//               data={salesProfitChartData}
//               options={{
//                 plugins: {
//                   title: {
//                     display: true,
//                     text: "Total Sales vs Profit Earned",
//                     font: { size: 16 },
//                   },
//                   legend: { display: false },
//                 },
//                 scales: {
//                   y: {
//                     beginAtZero: true,
//                     ticks: { color: "#333" },
//                     grid: { color: "#ddd" },
//                   },
//                   x: {
//                     ticks: { color: "#333" },
//                     grid: { display: false },
//                   },
//                 },
//               }}
//             />
//           </div>
//           <div className="mt-4 text-center text-lg font-semibold">
//             Net Profit: ₹{totalProfit > 0 ? totalProfit.toFixed(2) : "0.00"}
//           </div>
//         </section>
//       </div>

//       {/* Categories Grid */}
//       <div className="max-w-6xl mx-auto mt-8">
//         <h2 className="text-xl text-gray-800 mb-4">Categories</h2>
//         {categories.length === 0 ? (
//           <p className="text-gray-600">No categories available</p>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             {categories.map((cat, index) => (
//               <div
//                 key={index}
//                 className="p-4 rounded-xl"
//                 style={{
//                   background: "#e0e0e0",
//                   boxShadow: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
//                 }}
//               >
//                 <button
//                   className="w-full text-left font-semibold text-gray-800 focus:outline-none"
//                   onClick={() => toggleExpand(cat)}
//                 >
//                   {cat}
//                 </button>
//                 {expandedCategories[cat] && (
//                   <ul className="mt-2 space-y-1 text-sm text-gray-700">
//                     {inventory
//                       .filter(item => item.category === cat)
//                       .map((item, idx) => (
//                         <li key={idx} className="border-b py-1">
//                           {item.name} ({item.company}) - Qty: {item.quantity}
//                         </li>
//                       ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

