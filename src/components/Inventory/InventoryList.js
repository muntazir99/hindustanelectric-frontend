// src/components/Inventory/InventoryList.js
import React, { useEffect, useState } from "react";
import axios from "../../api.js";

function InventoryList() {
  const [inventory, setInventory] = useState([]);
  // Group expansion state: key is the item name, value is a boolean
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get("/inventory/");
        // Ensure we have an array (or default to empty array)
        setInventory(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch inventory.");
      }
    };
    fetchInventory();
  }, []);

  // Group inventory by item name (all in lowercase for consistency)
  const groupedInventory = inventory.reduce((groups, item) => {
    const key = item.name.toLowerCase();
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});

  // Optionally compute a total quantity per group
  const computeGroupTotal = (items) => {
    return items.reduce((sum, item) => sum + Number(item.quantity), 0);
  };

  // Toggle expanded state for a given group key
  const toggleGroup = (itemName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  return (
    <div className="p-6" style={{ background: "#e0e0e0", minHeight: "100vh" }}>
      <h1 className="text-2xl font-bold mb-6 text-center">Inventory List</h1>
      <div
        className="overflow-x-auto mx-auto"
        style={{
          maxWidth: "800px",
          background: "#e0e0e0",
          borderRadius: "12px",
          boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
        }}
      >
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-300">
              <th className="px-4 py-2 text-sm text-center">Item</th>
              <th className="px-4 py-2 text-sm text-center">Total Quantity</th>
              <th className="px-4 py-2 text-sm text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedInventory).map(([itemName, items]) => (
              <React.Fragment key={itemName}>
                <tr className="border-b">
                  <td className="px-4 py-2 text-xs text-center font-semibold">
                    {items[0].name}
                  </td>
                  <td className="px-4 py-2 text-xs text-center">
                    {computeGroupTotal(items)}
                  </td>
                  <td className="px-4 py-2 text-xs text-center">
                    <button
                      onClick={() => toggleGroup(itemName)}
                      className="px-3 py-1 rounded-md transition-all bg-blue-500 text-white shadow-md"
                    >
                      {expandedGroups[itemName] ? "Hide Details" : "View Details"}
                    </button>
                  </td>
                </tr>
                {expandedGroups[itemName] && (
                  <tr>
                    <td colSpan="3" className="px-4 py-2">
                      <div
                        className="bg-white p-4 rounded-lg"
                        style={{
                          boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
                        }}
                      >
                        <h3 className="text-lg font-bold mb-2">
                          Details for {items[0].name}
                        </h3>
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="px-2 py-1 text-sm text-center">Company</th>
                              <th className="px-2 py-1 text-sm text-center">Quantity</th>
                              <th className="px-2 py-1 text-sm text-center">Unit Price (₹)</th>
                              {items[0].category && (
                                <th className="px-2 py-1 text-sm text-center">Category</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item, idx) => (
                              <tr key={idx} className="border-b">
                                <td className="px-2 py-1 text-xs text-center">
                                  {item.company}
                                </td>
                                <td className="px-2 py-1 text-xs text-center">
                                  {item.quantity}
                                </td>
                                <td className="px-2 py-1 text-xs text-center">
                                  {item.unit_price.toFixed(2)}
                                </td>
                                {item.category && (
                                  <td className="px-2 py-1 text-xs text-center">
                                    {item.category}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryList;
