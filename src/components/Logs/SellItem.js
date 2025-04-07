
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../../api.js";
// import "jspdf-autotable";

// // Child component for a single sale entry
// function SaleEntry({ sale, index, handleSaleChange, allItems, handleRemoveSale, canRemove }) {
//   const [suggestions, setSuggestions] = useState([]);

//   // Autocomplete filter
//   useEffect(() => {
//     if (!sale.itemName) {
//       setSuggestions([]);
//       return;
//     }
//     const lowerInput = sale.itemName.toLowerCase();
//     const filtered = allItems.filter((name) => name.toLowerCase().includes(lowerInput));
//     // Sort suggestions so that names starting with the input come first
//     filtered.sort((a, b) => {
//       const aLower = a.toLowerCase();
//       const bLower = b.toLowerCase();
//       const aStarts = aLower.startsWith(lowerInput) ? 0 : 1;
//       const bStarts = bLower.startsWith(lowerInput) ? 0 : 1;
//       return aStarts - bStarts || aLower.localeCompare(bLower);
//     });
//     setSuggestions(filtered);
//   }, [sale.itemName, allItems]);

//   const handleSelectSuggestion = (suggestion) => {
//     handleSaleChange(index, "itemName", suggestion);
//     setSuggestions([]);
//   };

//   return (
//     <div className="bg-white/80 rounded-lg shadow-md p-4 relative flex flex-col space-y-3">
//       {/* Top Row: Title + Remove Button */}
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-bold text-gray-700">Item {index + 1}</h3>
//         {canRemove && (
//           <button
//             type="button"
//             onClick={() => handleRemoveSale(index)}
//             className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
//           >
//             Remove
//           </button>
//         )}
//       </div>

//       {/* Item Name (Autocomplete) */}
//       <div className="relative">
//         <label className="text-sm text-gray-600 mb-1 block">Item Name</label>
//         <input
//           type="text"
//           value={sale.itemName}
//           onChange={(e) => handleSaleChange(index, "itemName", e.target.value)}
//           className="w-full px-3 py-2 rounded focus:outline-none border"
//           placeholder="e.g., Raspberry Brulee"
//         />
//         {suggestions.length > 0 && (
//           <ul className="absolute z-10 left-0 right-0 bg-white border rounded shadow-md mt-1 max-h-40 overflow-auto">
//             {suggestions.map((suggestion, idx) => (
//               <li
//                 key={idx}
//                 onClick={() => handleSelectSuggestion(suggestion)}
//                 className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
//               >
//                 {suggestion}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Company */}
//       <div>
//         <label className="text-sm text-gray-600 mb-1 block">Company</label>
//         <input
//           type="text"
//           value={sale.company}
//           onChange={(e) => handleSaleChange(index, "company", e.target.value)}
//           className="w-full px-3 py-2 rounded focus:outline-none border"
//           placeholder="e.g., Bakery Co."
//         />
//       </div>

//       {/* Quantity & Price */}
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className="text-sm text-gray-600 mb-1 block">Quantity</label>
//           <input
//             type="number"
//             value={sale.quantity}
//             onChange={(e) => handleSaleChange(index, "quantity", e.target.value)}
//             className="w-full px-3 py-2 rounded focus:outline-none border"
//             placeholder="e.g., 2"
//           />
//         </div>
//         <div>
//           <label className="text-sm text-gray-600 mb-1 block">Price (₹)</label>
//           <input
//             type="number"
//             value={sale.price}
//             onChange={(e) => handleSaleChange(index, "price", e.target.value)}
//             className="w-full px-3 py-2 rounded focus:outline-none border"
//             placeholder="e.g., 120"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function SellMultipleItems() {
//   // Each sale object
//   const initialSale = {
//     itemName: "",
//     company: "",
//     quantity: "",
//     price: ""
//   };

//   const [sales, setSales] = useState([initialSale]);
//   const [buyer, setBuyer] = useState("");
//   const [cart, setCart] = useState([]);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [allItems, setAllItems] = useState([]);

//   const navigate = useNavigate();

//   // Fetch item names for autocomplete
//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const res = await axios.get("/inventory/names");
//         const names = res.data.data || [];
//         setAllItems(names);
//       } catch (err) {
//         console.error("Error fetching item names:", err);
//       }
//     };
//     fetchItems();
//   }, []);

//   // Helper: handle field changes in sale objects
//   const handleSaleChange = (index, field, value) => {
//     const newSales = [...sales];
//     newSales[index][field] = value;
//     setSales(newSales);
//   };

//   // Add new blank sale row
//   const handleAddSale = () => {
//     setSales([...sales, initialSale]);
//   };

//   // Remove a sale row
//   const handleRemoveSale = (index) => {
//     if (sales.length > 1) {
//       setSales(sales.filter((_, i) => i !== index));
//     }
//   };

//   // Validate and add the current sales to cart
//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     if (!buyer.trim()) {
//       setError("Buyer name is required.");
//       return;
//     }

//     for (let sale of sales) {
//       if (!sale.itemName || !sale.company || !sale.quantity || !sale.price) {
//         setError("All fields are required for each item (Buyer is common).");
//         return;
//       }
//       if (Number(sale.quantity) <= 0 || Number(sale.price) <= 0) {
//         setError("Quantity and Price must be greater than zero.");
//         return;
//       }
//     }

//     const updatedSales = sales.map((s) => ({
//       ...s,
//       buyer: buyer.trim()
//     }));

//     setCart((prev) => [...prev, ...updatedSales]);
//     setMessage("Items added to cart.");
//     // Reset the form
//     setSales([initialSale]);
//   };

//   // Proceed to billing with current cart
//   const handleProceedToBilling = () => {
//     if (cart.length === 0) {
//       setError("Cart is empty. Add items before proceeding.");
//       return;
//     }
//     navigate("/billing", { state: { cart } });
//   };

//   // Calculate total items in cart & total cost
//   const totalCartItems = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
//   const totalCartCost = cart.reduce(
//     (sum, item) => sum + Number(item.quantity) * Number(item.price),
//     0
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col md:flex-row gap-6">
//       {/* Left Column: Item Selection */}
//       <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col space-y-4">
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "Reospec" }}>
//             Select Items to Sell
//           </h1>
//           <p className="text-gray-600 mb-4 text-sm">Fill in the details below to add items to your cart.</p>

//           {/* Buyer Field */}
//           <div className="mb-4">
//             <label className="block text-sm text-gray-600 mb-1">Buyer Name</label>
//             <input
//               type="text"
//               placeholder="Enter Buyer Name"
//               value={buyer}
//               onChange={(e) => setBuyer(e.target.value)}
//               className="w-full px-3 py-2 rounded focus:outline-none border"
//             />
//           </div>

//           {/* Sale Entries */}
//           <form onSubmit={handleAddToCart} className="space-y-6">
//             {sales.map((sale, index) => (
//               <SaleEntry
//                 key={index}
//                 sale={sale}
//                 index={index}
//                 handleSaleChange={handleSaleChange}
//                 allItems={allItems}
//                 handleRemoveSale={handleRemoveSale}
//                 canRemove={sales.length > 1}
//               />
//             ))}

//             {/* Action Buttons */}
//             <div className="flex justify-between mt-4">
//               <button
//                 type="button"
//                 onClick={handleAddSale}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all"
//               >
//                 + Add Another Item
//               </button>
//               <button
//                 type="submit"
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </form>

//           <div className="mt-4">
//             <button
//               type="button"
//               onClick={handleProceedToBilling}
//               className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-all w-full"
//             >
//               Proceed to Billing
//             </button>
//           </div>

//           {error && <p className="mt-4 text-center text-red-500">{error}</p>}
//           {message && <p className="mt-4 text-center text-green-500">{message}</p>}
//         </div>
//       </div>

//       {/* Right Column: Cart Summary */}
//       <div className="w-full md:w-1/3 lg:w-1/4">
//         <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col">
//           <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Reospec" }}>
//             Cart Summary
//           </h2>
//           <div className="flex-1 overflow-auto">
//             {cart.length === 0 ? (
//               <p className="text-gray-500">No items in cart</p>
//             ) : (
//               <ul className="space-y-3">
//                 {cart.map((c, idx) => {
//                   const itemTotal = Number(c.quantity) * Number(c.price);
//                   return (
//                     <li key={idx} className="border-b pb-2">
//                       <div className="flex justify-between">
//                         <p className="text-gray-700 font-semibold">
//                           {c.itemName} <span className="text-sm text-gray-500">({c.company})</span>
//                         </p>
//                         <p className="text-gray-700">₹{itemTotal.toFixed(2)}</p>
//                       </div>
//                       <p className="text-sm text-gray-500">
//                         Qty: {c.quantity} | Price: ₹{c.price}
//                       </p>
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//           </div>
//           {/* Cart Totals */}
//           <div className="mt-4 border-t pt-4 text-gray-700">
//             <div className="flex justify-between mb-1">
//               <span className="font-semibold">Total Items:</span>
//               <span>{totalCartItems}</span>
//             </div>
//             <div className="flex justify-between mb-2">
//               <span className="font-semibold">Subtotal:</span>
//               <span>₹{totalCartCost.toFixed(2)}</span>
//             </div>
//             <button
//               onClick={handleProceedToBilling}
//               className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-all"
//             >
//               Checkout
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SellMultipleItems;


// src/components/Logs/SellMultipleItems.js
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../../api.js";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// // Child component for a single sale entry with autocomplete functionality
// function SaleEntry({ sale, index, handleSaleChange, allItems }) {
//   const [suggestions, setSuggestions] = useState([]);

//   useEffect(() => {
//     if (!sale.itemName) {
//       setSuggestions([]);
//       return;
//     }
//     const lowerInput = sale.itemName.toLowerCase();
//     const filtered = allItems.filter(name =>
//       name.toLowerCase().includes(lowerInput)
//     );
//     // Sort suggestions so that names starting with the input come first
//     filtered.sort((a, b) => {
//       const aLower = a.toLowerCase();
//       const bLower = b.toLowerCase();
//       const aStarts = aLower.startsWith(lowerInput) ? 0 : 1;
//       const bStarts = bLower.startsWith(lowerInput) ? 0 : 1;
//       return aStarts - bStarts || aLower.localeCompare(bLower);
//     });
//     setSuggestions(filtered);
//   }, [sale.itemName, allItems]);

//   const handleSelectSuggestion = (suggestion) => {
//     handleSaleChange(index, "itemName", suggestion);
//     setSuggestions([]);
//   };

//   return (
//     <div className="relative">
//       <input
//         type="text"
//         placeholder="Item Name"
//         value={sale.itemName}
//         onChange={(e) => handleSaleChange(index, "itemName", e.target.value)}
//         className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//         style={{
//           background: "#e0e0e0",
//           border: "1px solid rgba(255,255,255,0.3)",
//           boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//         }}
//       />
//       {suggestions.length > 0 && (
//         <ul className="absolute z-10 left-0 right-0 bg-white border rounded shadow-md mt-1 max-h-48 overflow-auto">
//           {suggestions.map((suggestion, idx) => (
//             <li
//               key={idx}
//               onClick={() => handleSelectSuggestion(suggestion)}
//               className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
//             >
//               {suggestion}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// function SellMultipleItems() {
//   const initialSale = {
//     itemName: "",
//     company: "",
//     quantity: "",
//     price: ""
//   };

//   const [sales, setSales] = useState([initialSale]);
//   const [buyer, setBuyer] = useState(""); // Common buyer for all sales
//   const [cart, setCart] = useState([]);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [allItems, setAllItems] = useState([]);
//   const navigate = useNavigate();

//   // Fetch list of available item names for autocomplete
//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const res = await axios.get("/inventory/names");
//         const names = res.data.data || [];
//         setAllItems(names);
//       } catch (err) {
//         console.error("Error fetching item names:", err);
//       }
//     };
//     fetchItems();
//   }, []);

//   const handleSaleChange = (index, field, value) => {
//     const newSales = [...sales];
//     newSales[index][field] = value;
//     setSales(newSales);
//   };

//   const handleAddSale = () => {
//     setSales([...sales, initialSale]);
//   };

//   const handleRemoveSale = (index) => {
//     if (sales.length > 1) {
//       setSales(sales.filter((_, i) => i !== index));
//     }
//   };

//   // Add the current sales entries (with the common buyer) to the cart.
//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     // Validate each sale entry (buyer is common)
//     for (let sale of sales) {
//       if (!sale.itemName || !sale.company || !sale.quantity || !sale.price) {
//         setError("All fields (except buyer) are required for every sale entry.");
//         return;
//       }
//       if (Number(sale.quantity) <= 0 || Number(sale.price) <= 0) {
//         setError("Quantity and Price must be greater than zero for every sale entry.");
//         return;
//       }
//     }
//     if (!buyer.trim()) {
//       setError("Buyer name is required.");
//       return;
//     }
//     const updatedSales = sales.map(sale => ({
//       ...sale,
//       buyer: buyer.trim()
//     }));
//     setCart(prevCart => [...prevCart, ...updatedSales]);
//     setMessage("Items added to cart.");
//     setSales([initialSale]);
//   };

//   const handleProceedToBilling = () => {
//     if (cart.length === 0) {
//       setError("Cart is empty. Please add items to cart before proceeding to billing.");
//       return;
//     }
//     navigate("/billing", { state: { cart } });
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen p-6" style={{ background: "#f3f4f6" }}>
//       <div className="p-8 w-full max-w-2xl rounded-2xl" style={{ background: "#e0e0e0", boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff", backdropFilter: "blur(4px)" }}>
//         <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "Reospec", color: "#333" }}>
//           Sell Multiple Items
//         </h2>
//         {/* Common Buyer Field */}
//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="Buyer Name"
//             value={buyer}
//             onChange={(e) => setBuyer(e.target.value)}
//             className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//             style={{
//               background: "#e0e0e0",
//               border: "1px solid rgba(255,255,255,0.3)",
//               boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//             }}
//           />
//         </div>
//         <form onSubmit={handleAddToCart} className="space-y-6">
//           {sales.map((sale, index) => (
//             <div key={index} className="p-4 rounded-xl mb-4" style={{ background: "#e0e0e0", boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff" }}>
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="text-lg font-bold text-gray-800">Sale {index + 1}</h3>
//                 {sales.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveSale(index)}
//                     className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all text-sm"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//               <SaleEntry sale={sale} index={index} handleSaleChange={handleSaleChange} allItems={allItems} />
//               <input
//                 type="text"
//                 placeholder="Company Name"
//                 value={sale.company}
//                 onChange={(e) => handleSaleChange(index, "company", e.target.value)}
//                 className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none mt-2"
//                 style={{
//                   background: "#e0e0e0",
//                   border: "1px solid rgba(255,255,255,0.3)",
//                   boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//                 }}
//               />
//               <div className="grid grid-cols-2 gap-4 mt-2">
//                 <input
//                   type="number"
//                   placeholder="Quantity"
//                   value={sale.quantity}
//                   onChange={(e) => handleSaleChange(index, "quantity", e.target.value)}
//                   className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//                   style={{
//                     background: "#e0e0e0",
//                     border: "1px solid rgba(255,255,255,0.3)",
//                     boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//                   }}
//                 />
//                 <input
//                   type="number"
//                   placeholder="Price (₹)"
//                   value={sale.price}
//                   onChange={(e) => handleSaleChange(index, "price", e.target.value)}
//                   className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//                   style={{
//                     background: "#e0e0e0",
//                     border: "1px solid rgba(255,255,255,0.3)",
//                     boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//                   }}
//                 />
//               </div>
//               {/* Note: Buyer field is common, so not per-sale */}
//             </div>
//           ))}
//           <div className="flex justify-between">
//             <button
//               type="button"
//               onClick={handleAddSale}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all"
//             >
//               Add Another Sale
//             </button>
//             <button
//               type="submit"
//               className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all"
//             >
//               Add to Cart
//             </button>
//           </div>
//         </form>
//         <div className="mt-4 flex justify-center">
//           <button
//             type="button"
//             onClick={handleProceedToBilling}
//             className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-all"
//           >
//             Proceed to Billing
//           </button>
//         </div>
//         {error && <p className="mt-4 text-center text-red-500">{error}</p>}
//         {message && <p className="mt-4 text-center text-green-500">{message}</p>}
//       </div>
//     </div>
//   );
// }

// export default SellMultipleItems;



// updated for dropdown with autofill and quantity check

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../../api.js";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// // Child component for a single sale entry using a dropdown of available items
// function SaleEntry({ sale, index, handleSaleChange, allItems }) {
//   const handleSelectChange = (e) => {
//     const selectedName = e.target.value;
//     const selectedItem = allItems.find((item) => item.name === selectedName);
//     handleSaleChange(index, "itemName", selectedName);
//     handleSaleChange(index, "company", selectedItem ? selectedItem.company : "");
//     handleSaleChange(index, "availableQuantity", selectedItem ? selectedItem.quantity : null);
//   };

//   return (
//     <div className="relative">
//       <select
//         value={sale.itemName}
//         onChange={handleSelectChange}
//         className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//         style={{
//           background: "#e0e0e0",
//           border: "1px solid rgba(255,255,255,0.3)",
//           boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//         }}
//       >
//         <option value="">Select item</option>
//         {allItems.map((item, idx) => (
//           <option key={idx} value={item.name}>
//             {item.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// function SellMultipleItems() {
//   const initialSale = {
//     itemName: "",
//     company: "",
//     quantity: "",
//     price: "",
//     availableQuantity: null
//   };

//   const [sales, setSales] = useState([initialSale]);
//   const [buyer, setBuyer] = useState("");
//   const [cart, setCart] = useState([]);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [allItems, setAllItems] = useState([]);
//   const navigate = useNavigate();

//   // Fetch the list of available items (with full details) for the dropdown.
//   // Ensure this endpoint returns an object with a "data" array.
//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const res = await axios.get("/inventory/");
//         const items = res.data.data || [];
//         setAllItems(items);
//       } catch (err) {
//         console.error("Error fetching inventory details:", err);
//       }
//     };
//     fetchItems();
//   }, []);


//   const handleSaleChange = (index, field, value) => {
//     const newSales = [...sales];
//     newSales[index][field] = value;
//     // If itemName is changed manually (e.g. reselecting), clear company and availableQuantity
//     if (field === "itemName") {
//       newSales[index]["company"] = "";
//       newSales[index]["availableQuantity"] = null;
//     }
//     setSales(newSales);
//   };

//   const handleAddSale = () => {
//     setSales([...sales, initialSale]);
//   };

//   const handleRemoveSale = (index) => {
//     if (sales.length > 1) {
//       setSales(sales.filter((_, i) => i !== index));
//     }
//   };

//   // Validate sales entries and add them to the cart.
//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     for (let sale of sales) {
//       if (!sale.itemName || !sale.company || !sale.quantity || !sale.price) {
//         setError("All fields (except buyer) are required for every sale entry.");
//         return;
//       }
//       if (Number(sale.quantity) <= 0 || Number(sale.price) <= 0) {
//         setError("Quantity and Price must be greater than zero for every sale entry.");
//         return;
//       }
//       // Check that the sale quantity does not exceed available quantity.
//       if (sale.availableQuantity !== null && Number(sale.quantity) > Number(sale.availableQuantity)) {
//         setError(`Quantity for "${sale.itemName}" cannot exceed available stock (${sale.availableQuantity}).`);
//         return;
//       }
//     }
//     if (!buyer.trim()) {
//       setError("Buyer name is required.");
//       return;
//     }
//     const updatedSales = sales.map(sale => ({
//       item_name: sale.itemName,
//       quantity: sale.quantity,
//       buyer: buyer.trim(),
//       price: sale.price
//     }));
//     setCart(prevCart => [...prevCart, ...updatedSales]);
//     setMessage("Items added to cart.");
//     setSales([initialSale]);
//   };

//   const handleProceedToBilling = () => {
//     if (cart.length === 0) {
//       setError("Cart is empty. Please add items to cart before proceeding to billing.");
//       return;
//     }
//     navigate("/billing", { state: { cart } });
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen p-6" style={{ background: "#f3f4f6" }}>
//       <div className="p-8 w-full max-w-2xl rounded-2xl" style={{ background: "#e0e0e0", boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff", backdropFilter: "blur(4px)" }}>
//         <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "Reospec", color: "#333" }}>
//           Sell Multiple Items
//         </h2>
//         {/* Common Buyer Field */}
//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="Buyer Name"
//             value={buyer}
//             onChange={(e) => setBuyer(e.target.value)}
//             className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//             style={{
//               background: "#e0e0e0",
//               border: "1px solid rgba(255,255,255,0.3)",
//               boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//             }}
//           />
//         </div>
//         <form onSubmit={handleAddToCart} className="space-y-6">
//           {sales.map((sale, index) => (
//             <div key={index} className="p-4 rounded-xl mb-4" style={{ background: "#e0e0e0", boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff" }}>
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="text-lg font-bold text-gray-800">Sale {index + 1}</h3>
//                 {sales.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveSale(index)}
//                     className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all text-sm"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//               <SaleEntry sale={sale} index={index} handleSaleChange={handleSaleChange} allItems={allItems} />
//               <input
//                 type="text"
//                 placeholder="Company Name"
//                 value={sale.company}
//                 className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none mt-2"
//                 style={{
//                   background: "#e0e0e0",
//                   border: "1px solid rgba(255,255,255,0.3)",
//                   boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//                 }}
//                 disabled
//               />
//               <div className="grid grid-cols-2 gap-4 mt-2">
//                 <input
//                   type="number"
//                   placeholder="Quantity"
//                   value={sale.quantity}
//                   onChange={(e) => handleSaleChange(index, "quantity", e.target.value)}
//                   className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//                   style={{
//                     background: "#e0e0e0",
//                     border: "1px solid rgba(255,255,255,0.3)",
//                     boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//                   }}
//                   // Maximum quantity is set to the available quantity of the selected item.
//                   max={sale.availableQuantity || undefined}
//                 />
//                 <input
//                   type="number"
//                   placeholder="Price (₹)"
//                   value={sale.price}
//                   onChange={(e) => handleSaleChange(index, "price", e.target.value)}
//                   className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//                   style={{
//                     background: "#e0e0e0",
//                     border: "1px solid rgba(255,255,255,0.3)",
//                     boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//           <div className="flex justify-between">
//             <button
//               type="button"
//               onClick={handleAddSale}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all"
//             >
//               Add Another Sale
//             </button>
//             <button
//               type="submit"
//               className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all"
//             >
//               Add to Cart
//             </button>
//           </div>
//         </form>
//         <div className="mt-4 flex justify-center">
//           <button
//             type="button"
//             onClick={handleProceedToBilling}
//             className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-all"
//           >
//             Proceed to Billing
//           </button>
//         </div>
//         {error && <p className="mt-4 text-center text-red-500">{error}</p>}
//         {message && <p className="mt-4 text-center text-green-500">{message}</p>}
//       </div>
//     </div>
//   );
// }

// export default SellMultipleItems;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Child component for a single sale entry with autocomplete for item names
function SaleEntry({ sale, index, handleSaleChange, handleSelectItem, allItems }) {
  const [suggestions, setSuggestions] = useState([]);
  const containerRef = useRef(null);

  // Filter suggestions based on input
  useEffect(() => {
    const inputText = sale.itemName || "";
    if (!inputText) {
      setSuggestions([]);
      return;
    }
    const lowerInput = inputText.toLowerCase();
    const filtered = allItems.filter(item =>
      (item.name || "").toLowerCase().includes(lowerInput)
    );
    filtered.sort((a, b) => {
      const aName = (a.name || "").toLowerCase();
      const bName = (b.name || "").toLowerCase();
      const aStarts = aName.startsWith(lowerInput) ? 0 : 1;
      const bStarts = bName.startsWith(lowerInput) ? 0 : 1;
      return aStarts - bStarts || aName.localeCompare(bName);
    });
    setSuggestions(filtered);
  }, [sale.itemName, allItems]);

  // Close suggestions if click happens outside this component
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectSuggestion = (suggestion) => {
    // Update the entire sale object with suggestion details
    handleSelectItem(index, suggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        placeholder="Search item name"
        value={sale.itemName || ""}
        onChange={(e) => handleSaleChange(index, "itemName", e.target.value)}
        className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
        style={{
          background: "#e0e0e0",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
        }}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-white border rounded shadow-md mt-1 max-h-48 overflow-auto">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectSuggestion(suggestion);
              }}
              className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SellMultipleItems() {
  const initialSale = {
    itemName: "",
    company: "",
    quantity: "",
    price: "",
    availableQuantity: null,
    hsn_code: "",
    unit_price: "",
    image: ""
  };

  const [sales, setSales] = useState([initialSale]);
  const [buyer, setBuyer] = useState("");
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [allItems, setAllItems] = useState([]);
  const navigate = useNavigate();

  // Fetch inventory details from the API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("/inventory/");
        const items = res.data.data || [];
        setAllItems(items);
      } catch (err) {
        console.error("Error fetching inventory details:", err);
      }
    };
    fetchItems();
  }, []);

  // Update sale on manual input change; clear company/unit_price if itemName is changed.
  const handleSaleChange = (index, field, value) => {
    const newSales = [...sales];
    newSales[index][field] = value;
    if (field === "itemName") {
      newSales[index]["company"] = "";
      newSales[index]["availableQuantity"] = null;
      newSales[index]["unit_price"] = "";
      newSales[index]["image"] = "";
    }
    setSales(newSales);
  };

  // When a suggestion is selected, update the entire sale object.
  const handleSelectItem = (index, suggestion) => {
    const newSales = [...sales];
    newSales[index] = {
      ...newSales[index],
      itemName: suggestion.name,
      company: suggestion.company,
      availableQuantity: suggestion.quantity,
      hsn_code: suggestion.hsn_code,
      unit_price: suggestion.unit_price,
      image: suggestion.image
    };
    setSales(newSales);
  };

  const handleAddSale = () => {
    setSales([...sales, initialSale]);
  };

  const handleRemoveSale = (index) => {
    if (sales.length > 1) {
      setSales(sales.filter((_, i) => i !== index));
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    for (let sale of sales) {
      if (!sale.itemName || !sale.company || !sale.quantity || !sale.price) {
        setError("All fields (except buyer) are required for every sale entry.");
        return;
      }
      if (Number(sale.quantity) <= 0 || Number(sale.price) <= 0) {
        setError("Quantity and Price must be greater than zero for every sale entry.");
        return;
      }
      if (
        sale.availableQuantity !== null &&
        Number(sale.quantity) > Number(sale.availableQuantity)
      ) {
        setError(
          `Quantity for "${sale.itemName}" cannot exceed available stock (${sale.availableQuantity}).`
        );
        return;
      }
    }
    if (!buyer.trim()) {
      setError("Buyer name is required.");
      return;
    }
    const updatedSales = sales.map(sale => ({
      itemName: sale.itemName,
      company: sale.company,
      quantity: sale.quantity,
      buyer: buyer.trim(),
      price: sale.price,
      hsn_code: sale.hsn_code
    }));
    setCart(prevCart => [...prevCart, ...updatedSales]);
    setMessage("Items added to cart.");
    setSales([initialSale]);
  };

  const handleProceedToBilling = () => {
    if (cart.length === 0) {
      setError("Cart is empty. Please add items to cart before proceeding to billing.");
      return;
    }
    navigate("/billing", { state: { cart } });
  };

  const totalCartItems = cart.reduce((sum, item) => sum + Number(item.quantity), 0);
  const totalCartCost = cart.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  );

  return (
    <div className="flex flex-col md:flex-row justify-center items-start min-h-screen p-6" style={{ background: "#f3f4f6" }}>
      <div
        className="p-8 w-full md:w-2/3 rounded-2xl mb-4 md:mb-0 md:mr-4"
        style={{
          background: "#e0e0e0",
          boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
          backdropFilter: "blur(4px)"
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "Reospec", color: "#333" }}>
          Sell Multiple Items
        </h2>
        {/* Buyer Field */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buyer Name"
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
            style={{
              background: "#e0e0e0",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
            }}
          />
        </div>
        <form onSubmit={handleAddToCart} className="space-y-6">
          {sales.map((sale, index) => (
            <div
              key={index}
              className="p-4 rounded-xl mb-4"
              style={{
                background: "#e0e0e0",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800">Sale {index + 1}</h3>
                {sales.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSale(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <SaleEntry
                sale={sale}
                index={index}
                handleSaleChange={handleSaleChange}
                handleSelectItem={handleSelectItem}
                allItems={allItems}
              />
              {/* Item Card: shows photo, remaining quantity and buying price */}
              {sale.itemName && sale.unit_price && (
                <div className="mt-2 p-4 border rounded flex items-center">
                  {sale.image ? (
                    <img
                      src={sale.image}
                      alt={sale.itemName}
                      className="w-16 h-16 object-cover mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center mr-4 text-sm text-gray-500">
                      No Image
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">
                      Remaining: {sale.availableQuantity}
                    </p>
                    <p className="text-sm">
                      Buying Price: ₹{sale.unit_price}
                    </p>
                  </div>
                </div>
              )}
              <input
                type="text"
                placeholder="Company Name"
                value={sale.company}
                className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none mt-2"
                style={{
                  background: "#e0e0e0",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
                }}
                disabled
              />
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={sale.quantity}
                    onChange={(e) => handleSaleChange(index, "quantity", e.target.value)}
                    className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
                    style={{
                      background: "#e0e0e0",
                      border: "1px solid rgba(255,255,255,0.3)",
                      boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
                    }}
                    max={sale.availableQuantity || undefined}
                  />
                  {sale.availableQuantity !== null && (
                    <p className="text-red-500 mt-1 text-sm">
                      Remaining: {sale.availableQuantity - (Number(sale.quantity) || 0)}
                    </p>
                  )}
                </div>
                <div className="self-start">
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={sale.price}
                    onChange={(e) => handleSaleChange(index, "price", e.target.value)}
                    className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
                    style={{
                      background: "#e0e0e0",
                      border: "1px solid rgba(255,255,255,0.3)",
                      boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleAddSale}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all"
            >
              Add Another Sale
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all"
            >
              Add to Cart
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>

      {/* Right Column: Cart Summary */}
      <div className="w-full md:w-1/3 lg:w-1/4">
        <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "Reospec" }}>
            Cart Summary
          </h2>
          <div className="flex-1 overflow-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500">No items in cart</p>
            ) : (
              <ul className="space-y-3">
                {cart.map((c, idx) => {
                  const itemTotal = Number(c.quantity) * Number(c.price);
                  return (
                    <li key={idx} className="border-b pb-2">
                      <div className="flex justify-between">
                        <p className="text-gray-700 font-semibold">
                          {c.itemName} <span className="text-sm text-gray-500">({c.company})</span>
                        </p>
                        <p className="text-gray-700">₹{itemTotal.toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Qty: {c.quantity} | Price: ₹{c.price}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="mt-4 border-t pt-4 text-gray-700">
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Total Items:</span>
              <span>{totalCartItems}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Subtotal:</span>
              <span>₹{totalCartCost.toFixed(2)}</span>
            </div>
            <button
              onClick={handleProceedToBilling}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-all"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellMultipleItems;



