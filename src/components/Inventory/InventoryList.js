import React, { useEffect, useState } from "react";
import axios from "../../api.js";

function InventoryList() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get("/inventory/");
        setInventory(res.data.data);
      } catch (err) {
        console.error("Failed to fetch inventory.");
      }
    };
    fetchInventory();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Inventory List</h1>
      <table className="w-full table-auto bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Item</th>
            <th className="px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryList;
