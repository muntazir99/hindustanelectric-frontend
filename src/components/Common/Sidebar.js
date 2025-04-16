// src/components/Common/Sidebar.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// Import your custom icons – adjust these paths as needed
import dashboardIcon from "../assets/dashboard.png";
import createUserIcon from "../assets/createUser.png";
import inventoryIcon from "../assets/inventory.png";
import logsIcon from "../assets/logs.png";
import calendarIcon from "../assets/calendar.png";
import invoicesIcon from "../assets/invoices.png";

function Sidebar({ user, handleLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  // Function to apply active styles for nav links
  const linkClass = ({ isActive }) =>
    isActive ? "flex items-center gap-2 text-yellow-500" : "flex items-center gap-2 text-gray-800";

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-300 p-4 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      {/* Brand Header (only shown when expanded) */}
      {!collapsed && (
        <div className="mb-8 text-center">
          <h1
            className="text-2xl font-bold tracking-wide uppercase"
            style={{ fontFamily: "Reospec", color: "#333" }}
          >
            Hindustan Electric
          </h1>
        </div>
      )}

      {/* Toggle Button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 focus:outline-none">
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-4 flex-grow">
        <NavLink to="/dashboard" className={linkClass}>
          <img src={dashboardIcon} alt="Dashboard" className="w-6 h-6" />
          {!collapsed && <span>Home</span>}
        </NavLink>
        {user?.role === "admin" && (
          <NavLink to="/create-user" className={linkClass}>
            <img src={createUserIcon} alt="Create User" className="w-6 h-6" />
            {!collapsed && <span>Create User</span>}
          </NavLink>
        )}
        <NavLink to="/inventory" className={linkClass}>
          <img src={inventoryIcon} alt="Inventory" className="w-6 h-6" />
          {!collapsed && <span>Inventory</span>}
        </NavLink>
        <NavLink to="/logs" className={linkClass}>
          <img src={logsIcon} alt="Logs" className="w-6 h-6" />
          {!collapsed && <span>Logs</span>}
        </NavLink>
        <NavLink to="/calendar" className={linkClass}>
          <img src={calendarIcon} alt="Calendar" className="w-6 h-6" />
          {!collapsed && <span>Calendar</span>}
        </NavLink>
        <NavLink to="/invoices" className={linkClass}>
          <img src={invoicesIcon} alt="Invoices" className="w-6 h-6" />
          {!collapsed && <span>Invoices</span>}
        </NavLink>
      </nav>

      {/* Logout Button (pinned to the bottom) */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md focus:outline-none"
        >
          {!collapsed ? "Logout" : "L"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
