// src/components/Inventory/AddItem.js
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
    barcode: "",
    hsn_code: "",   // New field for HSN code
    image: ""       // New field for image URL (optional)
  };

  const [item, setItem] = useState(initialItem);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [availableNames, setAvailableNames] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableNames = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/inventory/names");
        setAvailableNames(res.data.data || []);
      } catch (err) {
        console.error("Error fetching item names:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableNames();
  }, []);

  const handleNameChange = (e) => {
    setItem({ ...item, name: e.target.value });
    setShowSuggestions(true);
  };

  const handleSuggestionClick = async (suggestion) => {
    setShowSuggestions(false);
    setFetchLoading(true);

    try {
      const res = await axios.get(`/inventory/item/${suggestion.object_id}`);
      const data = res.data.data;

      console.log("Fetched item data:", data);
      setItem({
        name: data.name || "",
        company: data.company || "",
        unitPrice: data.unit_price || "",
        quantity: data.quantity || "",
        date: "",
        category: data.category || "",
        minimumStock: data.minimum_stock || "",
        barcode: data.barcode || "",
        hsn_code: data.hsn_code || "",
        image: data.image || ""
      });
    } catch (err) {
      console.error("Error fetching item details:", err);
    } finally {
      setFetchLoading(false);
    }
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
    setLoading(true);

    if (!item.name || !item.company || !item.unitPrice || !item.quantity || !item.date || !item.hsn_code || !item.barcode) {
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
        date_of_addition: item.date,
        category: item.category || undefined,
        minimum_stock: item.minimumStock ? parseInt(item.minimumStock) : undefined,
        barcode: item.barcode,
        hsn_code: item.hsn_code,
        image: item.image || undefined
      });
      setMessage(res.data.message);
      setItem(initialItem);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen p-6" style={{ background: "#f3f4f6" }}>
      <div
        className="p-8 w-full max-w-md rounded-2xl text-white"
        style={{
          background: "#e0e0e0",
          boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
          backdropFilter: "blur(4px)"
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "Reospec" }}>
          Add Inventory Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name with Autocomplete */}
          <div className="relative">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={handleNameChange}
              onFocus={() => setShowSuggestions(true)}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={{
                background: "#e0e0e0",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
              }}
            />
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-gray-200 rounded shadow-lg max-h-40 overflow-auto text-black"
              >
                {!loading ? (availableNames.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 hover:bg-gray-300 cursor-pointer"
                    onMouseDown={() => handleSuggestionClick(item)}
                  >
                    {item.name}
                  </div>
                ))) : (
                  <p className="px-5 py-2">Loading...</p>
                )}

              </div>
            )}
          </div>

          {/* Company */}
          <input
            type="text"
            placeholder="Company Name"
            value={item.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
            style={{
              background: "#e0e0e0",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
            }}
          />

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
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
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
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
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
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
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
                boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
              }}
            />
          </div>

          {/* Minimum Stock */}
          <input
            type="number"
            placeholder="Minimum Stock (optional)"
            value={item.minimumStock}
            onChange={(e) => handleChange("minimumStock", e.target.value)}
            className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
            style={{
              background: "#e0e0e0",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
            }}
          />

          <input
            type="text"
            placeholder="Barcode"
            value={item.barcode}
            onChange={(e) => handleChange("barcode", e.target.value)}
            className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
            style={{
              background: "#e0e0e0",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
            }}
          />

          {/* HSN Code */}
          <input
            type="text"
            placeholder="HSN Code"
            value={item.hsn_code}
            onChange={(e) => handleChange("hsn_code", e.target.value)}
            className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
            style={{
              background: "#e0e0e0",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
            }}
          />

          {/* Image URL (optional) */}
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={item.image}
            onChange={(e) => handleChange("image", e.target.value)}
            className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
            style={{
              background: "#e0e0e0",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff"
            }}
          />

          {fetchLoading && <small className="text-gray-500 p-3">Autofilling details...</small>}

          {/* Action Buttons */}
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
