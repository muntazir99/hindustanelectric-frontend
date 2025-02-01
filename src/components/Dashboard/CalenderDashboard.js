import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../../api.js";

function CalendarDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [inventory, setInventory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  // Fetch data for the selected date
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
        const response = await api.get(`/inventory/by-date?date=${formattedDate}`);
        const { inventory, logs } = response.data.data;
        setInventory(inventory || []);
        setLogs(logs || []);
      } catch (err) {
        setError("Failed to fetch data for the selected date.");
      }
    };

    fetchData();
  }, [selectedDate]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Calendar Dashboard</h2>
      <Calendar onChange={setSelectedDate} value={selectedDate} />
      <div className="mt-6">
        <h3 className="text-lg font-bold">Data for {selectedDate.toDateString()}</h3>
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <h4 className="text-md font-semibold">Inventory Added:</h4>
          <ul className="list-disc ml-6">
            {inventory.map((item, index) => (
              <li key={index}>
                {item.name} - Qty: {item.quantity} - Value: ₹{item.quantity * item.unit_price}
              </li>
            ))}
            {inventory.length === 0 && <p>No inventory added on this date.</p>}
          </ul>
        </div>
        <div className="mt-4">
          <h4 className="text-md font-semibold">Items Allotted:</h4>
          <ul className="list-disc ml-6">
            {logs.map((log, index) => (
              <li key={index}>
                {log.item_name} - Action: {log.action} - Qty: {log.quantity}
              </li>
            ))}
            {logs.length === 0 && <p>No items allotted on this date.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CalendarDashboard;
