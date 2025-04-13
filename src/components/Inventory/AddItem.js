import React, { useState, useEffect, useRef } from "react";
import axios from "../../api.js";
import { UploadIcon } from "lucide-react";

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
    file: "",
    hsn_code: "",
  };

  const [item, setItem] = useState(initialItem);
  const [imageFile, setImageFile] = useState(null); // File upload state
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Sync with backend's allowed extensions
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/bmp",
      "image/webp",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid file (JPG, PNG, GIF, BMP, WebP, or PDF).");
      return;
    }

    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // Validate required fields
    if (
      !item.name ||
      !item.company ||
      !item.unitPrice ||
      !item.quantity ||
      !item.date ||
      !item.hsn_code ||
      !item.barcode
    ) {
      setError("Name, Company, Unit Price, Quantity, Date, Barcode, and HSN Code are required.");
      setLoading(false);
      return;
    }

    // Validate numeric fields
    const unitPrice = Number(item.unitPrice);
    const quantity = Number(item.quantity);
    const minimumStock = item.minimumStock ? Number(item.minimumStock) : null;

    if (unitPrice <= 0 || quantity <= 0) {
      setError("Unit Price and Quantity must be greater than zero.");
      setLoading(false);
      return;
    }

    if (minimumStock !== null && minimumStock < 0) {
      setError("Minimum Stock cannot be negative.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", item.name.trim().toLowerCase());
      formData.append("company", item.company.trim().toLowerCase());
      formData.append("unit_price", item.unitPrice);
      formData.append("quantity", item.quantity);
      formData.append("date_of_addition", item.date);
      formData.append("barcode", item.barcode);
      formData.append("hsn_code", item.hsn_code);

      if (item.category) formData.append("category", item.category);
      if (minimumStock !== null) formData.append("minimum_stock", minimumStock);
      if (imageFile) formData.append("file", imageFile);

      const res = await axios.post("/inventory/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT is stored
        },
      });

      setMessage(res.data.message || "Item added successfully.");
      setItem(initialItem);
      setImageFile(null);
      document.getElementById("file").value = null; // Clear file input
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log("imagefile", imageFile);

  return (
    <div className="flex justify-center items-center min-h-screen p-6" style={{ background: "#f3f4f6" }}>
      <div
        className="p-8 w-full max-w-md rounded-2xl text-white"
        style={{
          background: "#e0e0e0",
          boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black" style={{ fontFamily: "Reospec" }}>
          Add Inventory Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={handleNameChange}
              onFocus={() => setShowSuggestions(true)}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={inputStyle}
            />
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-gray-200 rounded shadow-lg max-h-40 overflow-auto text-black"
              >
                {!loading ? (
                  availableNames.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 hover:bg-gray-300 cursor-pointer"
                      onMouseDown={() => handleSuggestionClick(item)}
                    >
                      {item.name}
                    </div>
                  ))
                ) : (
                  <p className="px-5 py-2">Loading...</p>
                )}
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Company Name"
            value={item.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
            style={inputStyle}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Unit Price (₹)"
              value={item.unitPrice}
              onChange={(e) => handleChange("unitPrice", e.target.value)}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Total Quantity"
              value={item.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={item.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full p-3 rounded-xl text-gray-800 focus:outline-none"
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Category"
              value={item.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
              style={inputStyle}
            />
          </div>

          <input
            type="number"
            placeholder="Minimum Stock (optional)"
            value={item.minimumStock}
            onChange={(e) => handleChange("minimumStock", e.target.value)}
            className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Barcode"
            value={item.barcode}
            onChange={(e) => handleChange("barcode", e.target.value)}
            className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="HSN Code"
            value={item.hsn_code}
            onChange={(e) => handleChange("hsn_code", e.target.value)}
            className="w-full p-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none"
            style={inputStyle}
          />

          <input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/bmp,image/webp,application/pdf"
            id="file"
            onChange={handleFileChange}
            className="w-full p-2 bg-white text-black rounded-xl hidden"
          />

          <div
            className="flex gap-2 justify-between items-center w-full p-3 rounded-xl text-gray-800 cursor-pointer"
            style={inputStyle}
          >
            <label htmlFor="file" className="flex gap-2 items-center cursor-pointer">
              <UploadIcon />
              <span>{imageFile ? imageFile.name : "Upload Image / PDF"}</span>
            </label>

            {imageFile && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageFile(null);
                  document.getElementById("file").value = null;
                }}
                className="text-red-500"
                title="Clear file"
              >
                ❌
              </button>
            )}
          </div>




          {fetchLoading && <small className="text-gray-500 p-3">Autofilling details...</small>}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                setItem(initialItem);
                setImageFile(null);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all"
            >
              Clear & New
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all"
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div >
    </div >
  );
}

const inputStyle = {
  background: "#e0e0e0",
  border: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
};

export default AddItem;
