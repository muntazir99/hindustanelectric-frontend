// src/components/Common/Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.js";

function Layout({ user, handleLogout }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="max-w-7xl mx-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
