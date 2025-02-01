import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard.js";
import AddItem from "./components/Inventory/AddItem.js";
import SellItem from "./components/Logs/SellItem.js";
import ReturnItem from "./components/Logs/ReturnItem.js"; // New route for returns
import CalendarDashboard from "./components/Dashboard/CalenderDashboard.js";
import Logs from "./components/Logs/LogsList.js";
import Inventory from "./components/Inventory/InventoryList.js";
import Login from "./components/Auth/LoginAuth.js";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Redirect home to Dashboard if authenticated */}
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/inventory" element={isAuthenticated ? <Inventory /> : <Navigate to="/login" />} />
        <Route path="/logs" element={isAuthenticated ? <Logs /> : <Navigate to="/login" />} />
        <Route path="/inventory/add" element={isAuthenticated ? <AddItem /> : <Navigate to="/login" />} />
        <Route path="/logs/allot" element={isAuthenticated ? <SellItem /> : <Navigate to="/login" />} />
        <Route path="/logs/return" element={isAuthenticated ? <ReturnItem /> : <Navigate to="/login" />} />
        <Route path="/calendar" element={isAuthenticated ? <CalendarDashboard /> : <Navigate to="/login" />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
