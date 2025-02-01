// import React, { useEffect, useState } from "react";
// import axios from "../../api.js";

// function LogsList() {
//   const [logs, setLogs] = useState([]);

//   useEffect(() => {
//     const fetchLogs = async () => {
//       try {
//         const res = await axios.get("/logs/");
//         // Assuming logs are in res.data.data
//         setLogs(res.data.data || []);
//       } catch (err) {
//         console.error("Failed to fetch logs.");
//       }
//     };
//     fetchLogs();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Logs</h1>
//       <table className="w-full table-auto bg-white rounded shadow">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="px-4 py-2">Date</th>
//             <th className="px-4 py-2">Item</th>
//             <th className="px-4 py-2">Action</th>
//             <th className="px-4 py-2">Quantity</th>
//             <th className="px-4 py-2">Person</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logs.map((log, index) => {
//             // Determine quantity from available fields:
//             const quantityValue = log.quantity_added || log.quantity_sold || log.quantity || "N/A";

//             // Determine the person involved:
//             let personName = "N/A";
//             if (log.action === "sell") {
//               personName = log.buyer || "N/A";
//             } else if (log.action === "allot") {
//               personName = log.taker || "N/A";
//             } else {
//               personName = log.performed_by || "N/A";
//             }

//             // Determine the date to display (use timestamp if available)
//             const dateValue = log.timestamp
//               ? new Date(log.timestamp).toLocaleString()
//               : log.date_alloted
//               ? new Date(log.date_alloted).toLocaleString()
//               : "N/A";

//             return (
//               <tr key={index} className="border-b">
//                 <td className="px-4 py-2">{dateValue}</td>
//                 <td className="px-4 py-2">{log.item_name}</td>
//                 <td className="px-4 py-2">{log.action}</td>
//                 <td className="px-4 py-2">{quantityValue}</td>
//                 <td className="px-4 py-2">{personName}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default LogsList;


import React, { useEffect, useState } from "react";
import axios from "../../api.js";

function LogsList() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/logs/");
        // Assuming logs are in res.data.data
        setLogs(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch logs.");
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Logs</h1>
      <table className="w-full table-auto bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Item</th>
            <th className="px-4 py-2">Action</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Buyer</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => {
            // Determine quantity from available fields:
            const quantityValue = log.quantity_added || log.quantity_sold || log.quantity || "N/A";

            // Determine the person involved:
            let buyerName = "N/A";
            if (log.action === "sell" || log.action === "return") {
              buyerName = log.buyer || "N/A";
            } else {
              buyerName = log.performed_by || "N/A";
            }

            // Determine the date to display (use timestamp if available)
            const dateValue = log.timestamp
              ? new Date(log.timestamp).toLocaleString()
              : log.date_alloted
              ? new Date(log.date_alloted).toLocaleString()
              : log.date_returned
              ? new Date(log.date_returned).toLocaleString()
              : "N/A";

            return (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{dateValue}</td>
                <td className="px-4 py-2">{log.item_name}</td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">{quantityValue}</td>
                <td className="px-4 py-2">{buyerName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LogsList;
