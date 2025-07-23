import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './inventorySlice.js';
import suppliersReducer from './suppliersSlice.js';
import logsReducer from './logsSlice.js';
import purchaseOrderReducer from './purchaseOrderSlice.js';
import customersReducer from './customersSlice.js';
import reportsReducer from './reportsSlice.js';
import paymentsReducer from './paymentsSlice.js'; // Import the new reducer

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    suppliers: suppliersReducer,
    logs: logsReducer,
    purchaseOrders: purchaseOrderReducer,
    customers: customersReducer,
    reports: reportsReducer,
    payments: paymentsReducer, // Add the new reducer
  },
});