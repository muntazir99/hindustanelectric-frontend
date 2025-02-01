
// import React, { useState } from "react";
// import axios from "../../api.js";

// function SellItem() {
//   const [itemName, setItemName] = useState("");
//   const [company, setCompany] = useState("");
//   const [quantity, setQuantity] = useState(0);
//   const [buyer, setBuyer] = useState("");
//   const [price, setPrice] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSell = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     try {
//       const res = await axios.post("/inventory/sell", {
//         item_name: itemName,
//         company,
//         quantity,
//         buyer,
//         price: parseFloat(price),
//       });
//       setMessage(res.data.message);
//       // Optionally reset fields on success:
//       setItemName("");
//       setCompany("");
//       setQuantity(0);
//       setBuyer("");
//       setPrice("");
//     } catch (err) {
//       setMessage("Failed to sell item. Please try again.");
//     }
//   };

//   return (
//     <div
//       className="flex justify-center items-center min-h-screen p-6"
//       style={{
//         background: "#f3f4f6",
//       }}
//     >
//       <div
//         className="p-8 w-full max-w-sm rounded-2xl"
//         style={{
//           background: "#e0e0e0",
//           boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//           backdropFilter: "blur(4px)",
//         }}
//       >
//         <h2
//           className="text-2xl font-bold mb-6 text-center"
//           style={{ fontFamily: "Reospec", color: "#333" }}
//         >
//           Sell Item
//         </h2>
//         <form onSubmit={handleSell} className="space-y-4">
//           <div>
//             <input
//               type="text"
//               placeholder="Item Name"
//               value={itemName}
//               onChange={(e) => setItemName(e.target.value)}
//               className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//               style={{
//                 background: "#e0e0e0",
//                 border: "1px solid rgba(255, 255, 255, 0.3)",
//                 boxShadow:
//                   "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//               }}
//             />
//           </div>
//           <div>
//             <input
//               type="text"
//               placeholder="Company Name"
//               value={company}
//               onChange={(e) => setCompany(e.target.value)}
//               className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//               style={{
//                 background: "#e0e0e0",
//                 border: "1px solid rgba(255, 255, 255, 0.3)",
//                 boxShadow:
//                   "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//               }}
//             />
//           </div>
//           <div>
//             <input
//               type="number"
//               placeholder="Quantity"
//               value={quantity}
//               onChange={(e) => setQuantity(Number(e.target.value))}
//               className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//               style={{
//                 background: "#e0e0e0",
//                 border: "1px solid rgba(255, 255, 255, 0.3)",
//                 boxShadow:
//                   "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//               }}
//             />
//           </div>
//           <div>
//             <input
//               type="text"
//               placeholder="Buyer Name"
//               value={buyer}
//               onChange={(e) => setBuyer(e.target.value)}
//               className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//               style={{
//                 background: "#e0e0e0",
//                 border: "1px solid rgba(255, 255, 255, 0.3)",
//                 boxShadow:
//                   "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//               }}
//             />
//           </div>
//           <div>
//             <input
//               type="number"
//               placeholder="Price (₹)"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//               style={{
//                 background: "#e0e0e0",
//                 border: "1px solid rgba(255, 255, 255, 0.3)",
//                 boxShadow:
//                   "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//               }}
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-3 rounded-xl font-bold transition-all hover:bg-green-600"
//             style={{
//               background: "#34d399",
//               boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//             }}
//           >
//             Sell Item
//           </button>
//         </form>
//         {message && (
//           <p className="mt-4 text-center text-green-500">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SellItem;

// src/components/Logs/SellMultipleItems.js
import React, { useState } from "react";
import axios from "../../api.js";

function SellMultipleItems() {
  const initialSale = {
    itemName: "",
    company: "",
    quantity: "",
    buyer: "",
    price: ""
  };

  const [sales, setSales] = useState([initialSale]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Update a field for a given sale entry
  const handleSaleChange = (index, field, value) => {
    const newSales = [...sales];
    newSales[index][field] = value;
    setSales(newSales);
  };

  // Append a new sale entry
  const handleAddSale = () => {
    setSales([...sales, initialSale]);
  };

  // Remove a sale entry (if more than one exists)
  const handleRemoveSale = (index) => {
    if (sales.length > 1) {
      setSales(sales.filter((_, i) => i !== index));
    }
  };

  // Submit all sale entries to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate each sale entry
    for (let i = 0; i < sales.length; i++) {
      const sale = sales[i];
      if (!sale.itemName || !sale.company || !sale.quantity || !sale.buyer || !sale.price) {
        setError("All fields are required for every sale entry.");
        return;
      }
      if (Number(sale.quantity) <= 0 || Number(sale.price) <= 0) {
        setError("Quantity and Price must be greater than zero for every sale entry.");
        return;
      }
    }

    try {
      // Format sales array as expected by backend
      const formattedSales = sales.map((sale) => ({
        item_name: sale.itemName.trim().toLowerCase(),
        company: sale.company.trim().toLowerCase(),
        quantity: parseInt(sale.quantity),
        buyer: sale.buyer.trim(),
        price: parseFloat(sale.price)
      }));

      // Post the array to the new endpoint
      const res = await axios.post("/inventory/sell-multiple", { sales: formattedSales });
      setMessage(res.data.message);
      // Reset the form on success
      setSales([initialSale]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process sales. Please try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen p-6"
      style={{
        background: "#f3f4f6"
      }}
    >
      <div
        className="p-8 w-full max-w-2xl rounded-2xl"
        style={{
          background: "#e0e0e0",
          boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
          backdropFilter: "blur(4px)"
        }}
      >
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ fontFamily: "Reospec", color: "#333" }}
        >
          Sell Multiple Items
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="grid grid-cols-1 gap-4">
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
                <input
                  type="text"
                  placeholder="Company Name"
                  value={sale.company}
                  onChange={(e) => handleSaleChange(index, "company", e.target.value)}
                  className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
                  style={{
                    background: "#e0e0e0",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
                  }}
                />
                <div className="grid grid-cols-2 gap-4">
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
                <input
                  type="text"
                  placeholder="Buyer Name"
                  value={sale.buyer}
                  onChange={(e) => handleSaleChange(index, "buyer", e.target.value)}
                  className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
                  style={{
                    background: "#e0e0e0",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
                  }}
                />
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
              Submit All
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
}

export default SellMultipleItems;
