import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { Provider } from 'react-redux';
import { store } from './store/store.js';

// Component Imports
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
import InvoiceList from "./components/Invoices/InvoiceList.js";
import SupplierManager from "./components/Purchasing/SupplierManager.js";
import CreatePO from "./components/Purchasing/CreatePO.js";
import PurchaseOrderList from "./components/Purchasing/PurchaseOrderList.js";
import ReceiveGoods from "./components/Purchasing/ReceiveGoods.js"; 
import PurchaseOrderDetail from "./components/Purchasing/PurchaseOrderDetail.js";
import CustomerManager from "./components/Customers/CustomerManager.js";
import AgingReport from "./components/Reports/AgingReport.js";
import RecordPayment from "./components/Payments/RecordPayment.js";
// --- Route Protection Components ---
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  return isAuthenticated && user.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
}

// --- Main App Routes Component ---
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes nested under the Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* When the path is just "/", navigate to the dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* All other pages are rendered inside the Layout's <Outlet /> */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="inventory/add" element={<AddItem />} />
        <Route path="logs" element={<Logs />} />
        <Route path="logs/allot" element={<SellItem />} />
        <Route path="logs/return" element={<ReturnItem />} />
        <Route path="calendar" element={<CalendarDashboard />} />
        <Route path="billing" element={<Billing />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="suppliers" element={<AdminRoute><SupplierManager /></AdminRoute>} />
        <Route path="purchase-orders/new" element={<AdminRoute><CreatePO /></AdminRoute>} />
        <Route path="purchase-orders" element={<AdminRoute><PurchaseOrderList /></AdminRoute>}/>
        <Route path="purchase-orders/:orderId/receive" element={<AdminRoute><ReceiveGoods /></AdminRoute>} /> 
        <Route path="purchase-orders/:orderId" element={<AdminRoute><PurchaseOrderDetail /></AdminRoute>} />
        <Route path="customers" element={<AdminRoute><CustomerManager /></AdminRoute>} />
        <Route path="reports/aging" element={<AdminRoute><AgingReport /></AdminRoute>} />
        <Route path="payments/new" element={<AdminRoute><RecordPayment /></AdminRoute>} />
        

        {/* Admin-Only Route */}
        
        <Route 
          path="create-user" 
          element={
            <AdminRoute>
              <CreateUser />
            </AdminRoute>
          } 
        />
      </Route>

      {/* Fallback for any other path */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

// --- Root App Component ---
function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext.js";
// import Dashboard from "./components/Dashboard/Dashboard.js";
// import AddItem from "./components/Inventory/AddItem.js";
// import SellItem from "./components/Logs/SellItem.js";
// import ReturnItem from "./components/Logs/ReturnItem.js";
// import CalendarDashboard from "./components/Dashboard/CalenderDashboard.js";
// import Logs from "./components/Logs/LogsList.js";
// import Inventory from "./components/Inventory/InventoryList.js";
// import Login from "./components/Auth/LoginAuth.js";
// import CreateUser from "./components/Auth/CreateUser.js";
// import Billing from "./components/Logs/Billing.js";
// import Layout from "./components/Common/Layout.js";
// import InvoiceList from "./components/Invoices/InvoiceList.js";

// // A component to protect routes
// function PrivateRoute({ children }) {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     // You can add a loading spinner here
//     return <div>Loading...</div>;
//   }

//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

// // A component for admin-only routes
// function AdminRoute({ children }) {
//     const { user, isAuthenticated, loading } = useAuth();
  
//     if (loading) {
//       return <div>Loading...</div>;
//     }
  
//     return isAuthenticated && user.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
// }


// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public Route */}
//           <Route path="/login" element={<Login />} />

//           {/* Protected Routes */}
//           <Route
//             path="/*"
//             element={
//               <PrivateRoute>
//                 <MainApp />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// // Component to house the main application layout and routes
// function MainApp() {
//     const { user, logout } = useAuth();

//     return (
//         <Layout user={user} handleLogout={logout}>
//             <Routes>
//                 <Route index element={<Dashboard />} />
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/inventory" element={<Inventory />} />
//                 <Route path="/inventory/add" element={<AddItem />} />
//                 <Route path="/logs" element={<Logs />} />
//                 <Route path="/logs/allot" element={<SellItem />} />
//                 <Route path="/logs/return" element={<ReturnItem />} />
//                 <Route path="/calendar" element={<CalendarDashboard />} />
//                 <Route path="/billing" element={<Billing />} />
//                 <Route path="/invoices" element={<InvoiceList />} />

//                 {/* Admin-Only Route */}
//                 <Route path="/create-user" element={
//                     <AdminRoute>
//                         <CreateUser />
//                     </AdminRoute>
//                 } />

//                 {/* Fallback */}
//                 <Route path="*" element={<Navigate to="/dashboard" replace />} />
//             </Routes>
//         </Layout>
//     );
// }

// export default App;