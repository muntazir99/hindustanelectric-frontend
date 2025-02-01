import React, { useState } from "react";
import axios from "../../api.js";

function SellItem() {
  const [itemName, setItemName] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [buyer, setBuyer] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSell = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("/inventory/sell", {
        item_name: itemName,
        company, // New field added to the payload
        quantity,
        buyer,
        price: parseFloat(price),
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Failed to sell item. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Sell Item</h2>
        <form onSubmit={handleSell}>
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="text"
            placeholder="Buyer Name"
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Sell Item
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-500">{message}</p>
        )}
      </div>
    </div>
  );
}

export default SellItem;
