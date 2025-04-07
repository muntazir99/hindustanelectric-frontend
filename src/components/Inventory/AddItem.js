import React, { useState, useEffect, useRef } from "react";
import axios from "../../api.js";

function AddItem() {
  const initialItem = {
    name: "",
    company: "",
    unitPrice: "",
    quantity: "",
    date: "",
    category: "",
    minimumStock: "",
    hsn_code: "",   // new field for HSN code
    image: ""       // new field for image URL (optional)
  };

  const [item, setItem] = useState(initialItem);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // For autocomplete suggestions for the item name.
  const [availableNames, setAvailableNames] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // Fetch available item names when the item name input is focused.
  const fetchAvailableNames = async () => {
    try {
      const res = await axios.get("/inventory/names");
      setAvailableNames(res.data.data || []);
    } catch (err) {
      console.error("Error fetching item names:", err);
    }
  };

  const handleNameChange = (e) => {
    setItem({ ...item, name: e.target.value });
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setItem({ ...item, name: suggestion });
    setShowSuggestions(false);
  };

  const handleClickOutside = (e) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    setItem({ ...item, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate required fields.
    if (!item.name || !item.company || !item.unitPrice || !item.quantity || !item.date || !item.hsn_code) {
      setError("Name, Company, Unit Price, Quantity, Date and HSN Code are required.");
      return;
    }
    if (Number(item.quantity) <= 0 || Number(item.unitPrice) <= 0) {
      setError("Unit Price and Quantity must be greater than zero.");
      return;
    }

    try {
      const res = await axios.post("/inventory/add", {
        name: item.name.trim().toLowerCase(),
        company: item.company.trim().toLowerCase(),
        unit_price: parseFloat(item.unitPrice),
        quantity: parseInt(item.quantity),
        date_of_addition: item.date, // expecting "YYYY-MM-DD"
        category: item.category || undefined,
        minimum_stock: item.minimumStock ? parseInt(item.minimumStock) : undefined,
        hsn_code: item.hsn_code,       // new field
        image: item.image || undefined  // new optional field
      });
      setMessage(res.data.message);
      setItem(initialItem);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item. Please try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen p-6"
      style={{ background: "#f3f4f6" }}
    >
      <div
        className="p-8 w-full max-w-md rounded-2xl text-white"
        style={{
          background: "#e0e0e0",
          boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
          backdropFilter: "blur(4px)",
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "Reospec" }}>
          Add Inventory Item
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name Input with Autocomplete */}
          <div className="relative">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={handleNameChange}
              onFocus={fetchAvailableNames}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={{
                background: "#e0e0e0",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
              }}
            />
            {showSuggestions && availableNames.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-gray-200 rounded shadow-lg max-h-40 overflow-auto text-black"
              >
                {availableNames.map((name, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                    onMouseDown={() => handleSuggestionClick(name)}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Company Name */}
          <div>
            <input
              type="text"
              placeholder="Company Name"
              value={item.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={{
                background: "#e0e0e0",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
              }}
            />
          </div>

          {/* Unit Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Unit Price (₹)"
              value={item.unitPrice}
              onChange={(e) => handleChange("unitPrice", e.target.value)}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={{
                background: "#e0e0e0",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
              }}
            />
            <input
              type="number"
              placeholder="Total Quantity"
              value={item.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={{
                background: "#e0e0e0",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
              }}
            />
          </div>

          {/* Date and Category */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={item.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full p-3 rounded-xl text-gray-800 focus:outline-none"
              style={{
                background: "#e0e0e0",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
              }}
            />
            <input
              type="text"
              placeholder="Category (optional)"
              value={item.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={{
                background: "#e0e0e0",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
              }}
            />
          </div>

          {/* Minimum Stock */}
          <div>
            <input
              type="number"
              placeholder="Minimum Stock (optional)"
              value={item.minimumStock}
              onChange={(e) => handleChange("minimumStock", e.target.value)}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={{
                background: "#e0e0e0",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
              }}
            />
          </div>

          {/* New: HSN Code */}
          <div>
            <input
              type="text"
              placeholder="HSN Code"
              value={item.hsn_code}
              onChange={(e) => handleChange("hsn_code", e.target.value)}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={{
                background: "#e0e0e0",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
              }}
            />
          </div>

          {/* New: Image URL (optional) */}
          <div>
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={item.image}
              onChange={(e) => handleChange("image", e.target.value)}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={{
                background: "#e0e0e0",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setItem(initialItem)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all"
            >
              Clear & New
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all"
            >
              Add Item
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
}

export default AddItem;

// // src/components/Inventory/AddItem.js
// import React, { useState, useEffect, useRef } from "react";
// import axios from "../../api.js";

// function AddItem() {
//   const initialItem = {
//     name: "",
//     company: "",
//     unitPrice: "",
//     quantity: "",
//     date: "",
//     category: "",
//     minimumStock: "",
//   };

//   const [item, setItem] = useState(initialItem);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // For autocomplete suggestions
//   const [availableNames, setAvailableNames] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const suggestionsRef = useRef(null);

//   // Fetch available item names from backend when input is focused
//   const fetchAvailableNames = async () => {
//     try {
//       const res = await axios.get("/inventory/names");
//       // Expecting res.data.data to be an array of item names.
//       setAvailableNames(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching item names:", err);
//     }
//   };

//   // Handle changes for the item name input
//   const handleNameChange = (e) => {
//     setItem({ ...item, name: e.target.value });
//     setShowSuggestions(true);
//   };

//   // When a suggestion is clicked, set the item name and hide suggestions
//   const handleSuggestionClick = (suggestion) => {
//     setItem({ ...item, name: suggestion });
//     setShowSuggestions(false);
//   };

//   // Hide suggestions when clicking outside the suggestions box
//   const handleClickOutside = (e) => {
//     if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
//       setShowSuggestions(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleChange = (field, value) => {
//     setItem({ ...item, [field]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     // Validate required fields: name, company, unitPrice, quantity, and date.
//     if (!item.name || !item.company || !item.unitPrice || !item.quantity || !item.date) {
//       setError("Name, Company, Unit Price, Quantity, and Date are required.");
//       return;
//     }
//     if (Number(item.quantity) <= 0 || Number(item.unitPrice) <= 0) {
//       setError("Unit Price and Quantity must be greater than zero.");
//       return;
//     }

//     try {
//       const res = await axios.post("/inventory/add", {
//         name: item.name.trim().toLowerCase(),
//         company: item.company.trim().toLowerCase(),
//         unit_price: parseFloat(item.unitPrice),
//         quantity: parseInt(item.quantity),
//         date_of_addition: item.date, // Expecting "YYYY-MM-DD"
//         category: item.category || undefined,
//         minimum_stock: item.minimumStock ? parseInt(item.minimumStock) : undefined,
//       });
//       setMessage(res.data.message);
//       setItem(initialItem);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to add item. Please try again.");
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
//         className="p-8 w-full max-w-md rounded-2xl text-white"
//         style={{
//           background: "#e0e0e0",
//           boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
//           backdropFilter: "blur(4px)",
//         }}
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "Reospec" }}>
//           Add Inventory Item
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Item Name Input with Autocomplete */}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Item Name"
//               value={item.name}
//               onChange={handleNameChange}
//               onFocus={fetchAvailableNames}
//               className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//               style={{
//                 background: "#e0e0e0",
//                 border: "1px solid rgba(255,255,255,0.3)",
//                 boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//               }}
//             />
//             {showSuggestions && availableNames.length > 0 && (
//               <div
//                 ref={suggestionsRef}
//                 className="absolute z-10 w-full mt-1 bg-gray-200 rounded shadow-lg max-h-40 overflow-auto text-black"
//               >
//                 {availableNames.map((name, idx) => (
//                   <div
//                     key={idx}
//                     className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
//                     onMouseDown={() => handleSuggestionClick(name)}
//                   >
//                     {name}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Company Name */}
//           <div>
//             <input
//               type="text"
//               placeholder="Company Name"
//               value={item.company}
//               onChange={(e) => handleChange("company", e.target.value)}
//               className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//               style={{
//                 background: "#e0e0e0",
//                 border: "1px solid rgba(255,255,255,0.3)",
//                 boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//               }}
//             />
//           </div>

//           {/* Unit Price and Quantity */}
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="number"
//               placeholder="Unit Price (₹)"
//               value={item.unitPrice}
//               onChange={(e) => handleChange("unitPrice", e.target.value)}
//               className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//               style={{
//                 background: "#e0e0e0",
//                 border: "1px solid rgba(255,255,255,0.3)",
//                 boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//               }}
//             />
//             <input
//               type="number"
//               placeholder="Total Quantity"
//               value={item.quantity}
//               onChange={(e) => handleChange("quantity", e.target.value)}
//               className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//               style={{
//                 background: "#e0e0e0",
//                 border: "1px solid rgba(255,255,255,0.3)",
//                 boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//               }}
//             />
//           </div>

//           {/* Date and Category */}
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="date"
//               value={item.date}
//               onChange={(e) => handleChange("date", e.target.value)}
//               className="w-full p-3 rounded-xl text-gray-800 focus:outline-none"
//               style={{
//                 background: "#e0e0e0",
//                 border: "1px solid rgba(255,255,255,0.3)",
//                 boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//               }}
//             />
//             <input
//               type="text"
//               placeholder="Category (optional)"
//               value={item.category}
//               onChange={(e) => handleChange("category", e.target.value)}
//               className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//               style={{
//                 background: "#e0e0e0",
//                 border: "1px solid rgba(255,255,255,0.3)",
//                 boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//               }}
//             />
//           </div>

//           {/* Minimum Stock */}
//           <div>
//             <input
//               type="number"
//               placeholder="Minimum Stock (optional)"
//               value={item.minimumStock}
//               onChange={(e) => handleChange("minimumStock", e.target.value)}
//               className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
//               style={{
//                 background: "#e0e0e0",
//                 border: "1px solid rgba(255,255,255,0.3)",
//                 boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
//               }}
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-between">
//             <button
//               type="button"
//               onClick={() => {
//                 // Append a new empty item
//                 setItem({ ...item, ...initialItem });
//                 // Alternatively, if you want to allow multiple entries, you might
//                 // implement a dynamic form with an array state; here we assume a single item entry
//                 // is replaced with a new one.
//               }}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all"
//             >
//               Clear & New
//             </button>
//             <button
//               type="submit"
//               className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all"
//             >
//               Add Item
//             </button>
//           </div>
//         </form>
//         {error && <p className="mt-4 text-center text-red-500">{error}</p>}
//         {message && <p className="mt-4 text-center text-green-500">{message}</p>}
//       </div>
//     </div>
//   );
// }

// export default AddItem;
