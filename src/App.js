import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard.js";
import AddItem from "./components/Inventory/AddItem.js";
import SellItem from "./components/Logs/SellItem.js";
import ReturnItem from "./components/Logs/ReturnItem.js";
import CalendarDashboard from "./components/Dashboard/CalenderDashboard.js";
import Logs from "./components/Logs/LogsList.js";
import Inventory from "./components/Inventory/InventoryList.js";
import Login from "./components/Auth/LoginAuth.js";
import CreateUser from "./components/Auth/CreateUser.js";
import Billing from "./components/Logs/Billing.js";
import Layout from "./components/Common/Layout.js";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  const user = isAuthenticated ? { role: localStorage.getItem("role") } : null;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes wrapped in Layout */}
        <Route
          element={isAuthenticated ? <Layout user={user} handleLogout={handleLogout} /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/add" element={<AddItem />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/logs/allot" element={<SellItem />} />
          <Route path="/logs/return" element={<ReturnItem />} />
          <Route path="/calendar" element={<CalendarDashboard />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/billing" element={<Billing />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
