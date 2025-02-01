
// import React, { useState } from "react";
// import axios from "../../api.js";

// function AddItem() {
//   const [name, setName] = useState("");
//   const [unitPrice, setUnitPrice] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [date, setDate] = useState("");
//   const [category, setCategory] = useState("");
//   const [minimumStock, setMinimumStock] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleAddItem = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     // Validate required fields
//     if (!name || !unitPrice || !quantity || !date) {
//       setError("Name, Unit Price, Quantity, and Date are required.");
//       return;
//     }
//     if (quantity <= 0 || unitPrice <= 0) {
//       setError("Unit Price and Quantity must be greater than zero.");
//       return;
//     }

//     try {
//       const res = await axios.post("/inventory/add", {
//         name,
//         unit_price: parseFloat(unitPrice),
//         quantity: parseInt(quantity),
//         date_of_addition: date,
//         category: category || undefined,
//         minimum_stock: minimumStock ? parseInt(minimumStock) : undefined,
//       });
//       setMessage(res.data.message);
//       setName("");
//       setUnitPrice("");
//       setQuantity("");
//       setDate("");
//       setCategory("");
//       setMinimumStock("");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to add item. Please try again.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
//       <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md text-white">
//         <h2 className="text-2xl font-bold mb-6 text-center">Add Inventory Item</h2>
//         <form onSubmit={handleAddItem} className="space-y-4">
//           <div>
//             <input
//               type="text"
//               placeholder="Item Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300 placeholder-gray-300"
//             />
//           </div>
//           <div>
//             <input
//               type="number"
//               placeholder="Unit Price (₹)"
//               value={unitPrice}
//               onChange={(e) => setUnitPrice(e.target.value)}
//               className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300 placeholder-gray-300"
//             />
//           </div>
//           <div>
//             <input
//               type="number"
//               placeholder="Total Quantity"
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//               className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300 placeholder-gray-300"
//             />
//           </div>
//           <div>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300"
//             />
//           </div>
//           <div>
//             <input
//               type="text"
//               placeholder="Category (optional)"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300 placeholder-gray-300"
//             />
//           </div>
//           <div>
//             <input
//               type="number"
//               placeholder="Minimum Stock (optional)"
//               value={minimumStock}
//               onChange={(e) => setMinimumStock(e.target.value)}
//               className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300 placeholder-gray-300"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition-all font-bold"
//           >
//             Add Item
//           </button>
//         </form>
//         {error && <p className="mt-4 text-center text-red-500">{error}</p>}
//         {message && <p className="mt-4 text-center text-green-500">{message}</p>}
//       </div>
//     </div>
//   );
// }

// export default AddItem;

import React, { useState } from "react";
import axios from "../../api.js";

function AddItem() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState(""); // New field for Company Name
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate required fields: name, company, unitPrice, quantity, and date are required.
    if (!name || !company || !unitPrice || !quantity || !date) {
      setError("Name, Company, Unit Price, Quantity, and Date are required.");
      return;
    }
    if (quantity <= 0 || unitPrice <= 0) {
      setError("Unit Price and Quantity must be greater than zero.");
      return;
    }

    try {
      const res = await axios.post("/inventory/add", {
        name,
        company,
        unit_price: parseFloat(unitPrice),
        quantity: parseInt(quantity),
        date_of_addition: date,
        category: category || undefined,
        minimum_stock: minimumStock ? parseInt(minimumStock) : undefined,
      });
      setMessage(res.data.message);
      setName("");
      setCompany("");
      setUnitPrice("");
      setQuantity("");
      setDate("");
      setCategory("");
      setMinimumStock("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
      <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Inventory Item</h2>
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300 placeholder-gray-300"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300 placeholder-gray-300"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Unit Price (₹)"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300 placeholder-gray-300"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Total Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300 placeholder-gray-300"
            />
          </div>
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Category (optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300 placeholder-gray-300"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Minimum Stock (optional)"
              value={minimumStock}
              onChange={(e) => setMinimumStock(e.target.value)}
              className="w-full p-3 bg-transparent border border-white/30 rounded-xl text-white focus:outline-none focus:border-yellow-300 placeholder-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition-all font-bold"
          >
            Add Item
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
}

export default AddItem;
