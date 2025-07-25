import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js"; // Import the useAuth hook

// Import your custom icons
import dashboardIcon from "../assets/dashboard.png";
import createUserIcon from "../assets/createUser.png";
import inventoryIcon from "../assets/inventory.png";
import logsIcon from "../assets/logs.png";
import calendarIcon from "../assets/calendar.png";
import invoicesIcon from "../assets/invoices.png";
import logoutIcon from "../assets/logoutIcon.png";
import SuppliersIcon from "../assets/suppliers.png"; // Import the suppliers icon
import newPOIcon from "../assets/newPO.png"; // Import the new purchase order icon
import customersIcon from "../assets/customers.png";
import reportsIcon from "../assets/reports.png"
import paymentIcon from "../assets/payment.png";

// The component no longer needs user and handleLogout as props
function Sidebar({ sidebarCollapsed, setSidebarCollapsed }) {
  const { user, logout } = useAuth(); // Get user and logout directly from the context

  const linkClass = ({ isActive }) =>
    isActive ? "flex items-center gap-2 text-yellow-500" : "flex items-center gap-2 text-gray-800";

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-300 p-4 transition-all duration-300 flex flex-col ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      {!sidebarCollapsed && (
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-wide uppercase" style={{ fontFamily: "Reospec", color: "#333" }}>
            Hindustan Electric
          </h1>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 focus:outline-none"
        >
          {sidebarCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="flex flex-col space-y-4 flex-grow">
        <NavLink to="/dashboard" className={linkClass}>
          <img src={dashboardIcon} alt="Dashboard" className="w-6 h-6" />
          {!sidebarCollapsed && <span>Home</span>}
        </NavLink>
        {/* The user role check remains the same */}
        {user?.role === "admin" && (
          <NavLink to="/create-user" className={linkClass}>
            <img src={createUserIcon} alt="Create User" className="w-6 h-6" />
            {!sidebarCollapsed && <span>Create User</span>}
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink to="/customers" className={linkClass}>
            <img src={customersIcon} alt="Customers" className="w-6 h-6" />
            {!sidebarCollapsed && <span>Customers</span>}
          </NavLink>
        )}
        {user?.role === "admin" && (
        <NavLink to="/suppliers" className={linkClass}>
          <img src={SuppliersIcon} alt="Suppliers" className="w-6 h-6" />
          {!sidebarCollapsed && <span>Suppliers</span>}
        </NavLink>
      )}
      {user?.role === "admin" && (
        <NavLink to="/purchase-orders/new" className={linkClass}>
          {/* You can find or create a suitable icon */}
          <img src={inventoryIcon} alt="New PO" className="w-6 h-6" />
          {!sidebarCollapsed && <span>New Purchase Order</span>}
        </NavLink>
      )}
      {user?.role === "admin" && (
        <NavLink to="/purchase-orders" className={linkClass}>
          <img src={newPOIcon} alt="Purchase Orders" className="w-6 h-6" />
          {!sidebarCollapsed && <span>Purchase Orders</span>}
        </NavLink>
      )}
      {user?.role === "admin" && (
        <NavLink to="/reports/aging" className={linkClass}>
          <img src={reportsIcon} alt="Aging Report" className="w-6 h-6" />
          {!sidebarCollapsed && <span>Aging Report</span>}
        </NavLink>
      )}
      {user?.role === "admin" && (
        <NavLink to="/payments/new" className={linkClass}>
          <img src={paymentIcon} alt="Record Payment" className="w-6 h-6" />
          {!sidebarCollapsed && <span>Record Payment</span>}
        </NavLink>
      )}
        <NavLink to="/inventory" className={linkClass}>
          <img src={inventoryIcon} alt="Inventory" className="w-6 h-6" />
          {!sidebarCollapsed && <span>Inventory</span>}
        </NavLink>
        <NavLink to="/logs" className={linkClass}>
          <img src={logsIcon} alt="Logs" className="w-6 h-6" />
          {!sidebarCollapsed && <span>Logs</span>}
        </NavLink>
        <NavLink to="/calendar" className={linkClass}>
          <img src={calendarIcon} alt="Calendar" className="w-6 h-6" />
          {!sidebarCollapsed && <span>Calendar</span>}
        </NavLink>
        <NavLink to="/invoices" className={linkClass}>
          <img src={invoicesIcon} alt="Invoices" className="w-6 h-6" />
          {!sidebarCollapsed && <span>Invoices</span>}
        </NavLink>
      </nav>

      <div className="mt-auto">
        {sidebarCollapsed ? (
          <button
            onClick={logout} // Use logout from the context
            className="p-2 focus:outline-none"
          >
            <img src={logoutIcon} alt="Logout" className="w-12 h-6" />
          </button>
        ) : (
          <button
            onClick={logout} // Use logout from the context
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md focus:outline-none"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
// // src/components/Common/Sidebar.js
// import React from "react";
// import { NavLink } from "react-router-dom";
// // Import your custom icons; adjust the paths as needed.
// import dashboardIcon from "../assets/dashboard.png";
// import createUserIcon from "../assets/createUser.png";
// import inventoryIcon from "../assets/inventory.png";
// import logsIcon from "../assets/logs.png";
// import calendarIcon from "../assets/calendar.png";
// import invoicesIcon from "../assets/invoices.png";
// import logoutIcon from "../assets/logoutIcon.png";

// function Sidebar({ user, handleLogout, sidebarCollapsed, setSidebarCollapsed }) {
//   // Function to apply active class styles for nav links.
//   const linkClass = ({ isActive }) =>
//     isActive ? "flex items-center gap-2 text-yellow-500" : "flex items-center gap-2 text-gray-800";

//   return (
//     <div
//       className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-300 p-4 transition-all duration-300 flex flex-col ${
//         sidebarCollapsed ? "w-16" : "w-64"
//       }`}
//     >
//       {/* Brand Header: Shown only when expanded */}
//       {!sidebarCollapsed && (
//         <div className="mb-8 text-center">
//           <h1 className="text-2xl font-bold tracking-wide uppercase" style={{ fontFamily: "Reospec", color: "#333" }}>
//             Hindustan Electric
//           </h1>
//         </div>
//       )}

//       {/* Toggle Button */}
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//           className="p-2 focus:outline-none"
//         >
//           {sidebarCollapsed ? "→" : "←"}
//         </button>
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex flex-col space-y-4 flex-grow">
//         <NavLink to="/dashboard" className={linkClass}>
//           <img src={dashboardIcon} alt="Dashboard" className="w-6 h-6" />
//           {!sidebarCollapsed && <span>Home</span>}
//         </NavLink>
//         {user?.role === "admin" && (
//           <NavLink to="/create-user" className={linkClass}>
//             <img src={createUserIcon} alt="Create User" className="w-6 h-6" />
//             {!sidebarCollapsed && <span>Create User</span>}
//           </NavLink>
//         )}
//         <NavLink to="/inventory" className={linkClass}>
//           <img src={inventoryIcon} alt="Inventory" className="w-6 h-6" />
//           {!sidebarCollapsed && <span>Inventory</span>}
//         </NavLink>
//         <NavLink to="/logs" className={linkClass}>
//           <img src={logsIcon} alt="Logs" className="w-6 h-6" />
//           {!sidebarCollapsed && <span>Logs</span>}
//         </NavLink>
//         <NavLink to="/calendar" className={linkClass}>
//           <img src={calendarIcon} alt="Calendar" className="w-6 h-6" />
//           {!sidebarCollapsed && <span>Calendar</span>}
//         </NavLink>
//         <NavLink to="/invoices" className={linkClass}>
//           <img src={invoicesIcon} alt="Invoices" className="w-6 h-6" />
//           {!sidebarCollapsed && <span>Invoices</span>}
//         </NavLink>
//       </nav>

//       {/* Logout Button at Bottom */}
//       <div className="mt-auto">
//         {sidebarCollapsed ? (
//           <button
//             onClick={handleLogout}
//             className="p-2 focus:outline-none"
//           >
//             <img src={logoutIcon} alt="Logout" className="w-12 h-6" />
//           </button>
//         ) : (
//           <button
//             onClick={handleLogout}
//             className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md focus:outline-none"
//           >
//             Logout
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;
