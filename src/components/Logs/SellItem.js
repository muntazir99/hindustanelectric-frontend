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
//           boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
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
//     buyer: "",
//     price: ""
//   };

//   const [sales, setSales] = useState([initialSale]);
//   const [cart, setCart] = useState([]);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [allItems, setAllItems] = useState([]);
//   const navigate = useNavigate();

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

//   // Add the current sales entries to the cart.
//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     for (let sale of sales) {
//       if (!sale.itemName || !sale.company || !sale.quantity || !sale.buyer || !sale.price) {
//         setError("All fields are required for every sale entry.");
//         return;
//       }
//       if (Number(sale.quantity) <= 0 || Number(sale.price) <= 0) {
//         setError("Quantity and Price must be greater than zero for every sale entry.");
//         return;
//       }
//     }
//     setCart(prevCart => [...prevCart, ...sales]);
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
//               <input
//                 type="text"
//                 placeholder="Buyer Name"
//                 value={sale.buyer}
//                 onChange={(e) => handleSaleChange(index, "buyer", e.target.value)}
//                 className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none mt-2"
//                 style={{
//                   background: "#e0e0e0",
//                   border: "1px solid rgba(255,255,255,0.3)",
//                   boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
//                 }}
//               />
//             </div>
//           ))}
//           <div className="flex justify-between">
//             <button type="button" onClick={handleAddSale} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all">
//               Add Another Sale
//             </button>
//             <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all">
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

// src/components/Logs/SellMultipleItems.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Child component for a single sale entry with autocomplete functionality
function SaleEntry({ sale, index, handleSaleChange, allItems }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!sale.itemName) {
      setSuggestions([]);
      return;
    }
    const lowerInput = sale.itemName.toLowerCase();
    const filtered = allItems.filter(name =>
      name.toLowerCase().includes(lowerInput)
    );
    // Sort suggestions so that names starting with the input come first
    filtered.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const aStarts = aLower.startsWith(lowerInput) ? 0 : 1;
      const bStarts = bLower.startsWith(lowerInput) ? 0 : 1;
      return aStarts - bStarts || aLower.localeCompare(bLower);
    });
    setSuggestions(filtered);
  }, [sale.itemName, allItems]);

  const handleSelectSuggestion = (suggestion) => {
    handleSaleChange(index, "itemName", suggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Item Name"
        value={sale.itemName}
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
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
            >
              {suggestion}
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
    price: ""
  };

  const [sales, setSales] = useState([initialSale]);
  const [buyer, setBuyer] = useState(""); // Common buyer for all sales
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [allItems, setAllItems] = useState([]);
  const navigate = useNavigate();

  // Fetch list of available item names for autocomplete
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("/inventory/names");
        const names = res.data.data || [];
        setAllItems(names);
      } catch (err) {
        console.error("Error fetching item names:", err);
      }
    };
    fetchItems();
  }, []);

  const handleSaleChange = (index, field, value) => {
    const newSales = [...sales];
    newSales[index][field] = value;
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

  // Add the current sales entries (with the common buyer) to the cart.
  const handleAddToCart = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    // Validate each sale entry (buyer is common)
    for (let sale of sales) {
      if (!sale.itemName || !sale.company || !sale.quantity || !sale.price) {
        setError("All fields (except buyer) are required for every sale entry.");
        return;
      }
      if (Number(sale.quantity) <= 0 || Number(sale.price) <= 0) {
        setError("Quantity and Price must be greater than zero for every sale entry.");
        return;
      }
    }
    if (!buyer.trim()) {
      setError("Buyer name is required.");
      return;
    }
    const updatedSales = sales.map(sale => ({
      ...sale,
      buyer: buyer.trim()
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

  return (
    <div className="flex justify-center items-center min-h-screen p-6" style={{ background: "#f3f4f6" }}>
      <div className="p-8 w-full max-w-2xl rounded-2xl" style={{ background: "#e0e0e0", boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff", backdropFilter: "blur(4px)" }}>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "Reospec", color: "#333" }}>
          Sell Multiple Items
        </h2>
        {/* Common Buyer Field */}
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
            <div key={index} className="p-4 rounded-xl mb-4" style={{ background: "#e0e0e0", boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff" }}>
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
              <SaleEntry sale={sale} index={index} handleSaleChange={handleSaleChange} allItems={allItems} />
              <input
                type="text"
                placeholder="Company Name"
                value={sale.company}
                onChange={(e) => handleSaleChange(index, "company", e.target.value)}
                className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none mt-2"
                style={{
                  background: "#e0e0e0",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
                }}
              />
              <div className="grid grid-cols-2 gap-4 mt-2">
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
                />
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
              {/* Note: Buyer field is common, so not per-sale */}
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
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleProceedToBilling}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-all"
          >
            Proceed to Billing
          </button>
        </div>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
}

export default SellMultipleItems;
