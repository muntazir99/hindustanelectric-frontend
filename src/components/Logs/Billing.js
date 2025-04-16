// // src/components/Logs/Billing.js
// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "../../api.js";
// import jsPDF from "jspdf";
// import { toWords } from 'number-to-words';
// import "jspdf-autotable";
// import { useEffect } from "react";
// function Billing() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const cart = location.state?.cart || [];

//   // Billing items are initially taken from cart; extend each with tax fields.
//   const [billingItems, setBillingItems] = useState(
//     cart.map((item) => ({
//       ...item,
//       taxPercentage: 0,   // default tax percentage
//       taxIncluded: false, // default: tax is excluded
//       discount: 0,        // optional discount amount (in ₹)
//     }))
//   );

//   console.log("billingItems", billingItems);

//   // Additional invoice details
//   const [supplier, setSupplier] = useState({ name: "", gstin: "", address: "" });
//   const [recipient, setRecipient] = useState({ name: "", gstin: "", address: "" });
//   const [dateOfIssuance, setDateOfIssuance] = useState("");
//   const [billingAddress, setBillingAddress] = useState("");
//   const [shippingAddress, setShippingAddress] = useState("");
//   const [chargeType, setChargeType] = useState("forward");
//   const [signature, setSignature] = useState("");

//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [invoiceGenerated, setInvoiceGenerated] = useState(false);

//   const calculateRowTotal = (item) => {
//     const qty = Number(item.quantity) || 0;
//     const price = Number(item.price) || 0;
//     const baseTotal = qty * price;
//     const taxPercentage = Number(item.taxPercentage) || 0;
//     let taxAmount = 0;
//     if (!item.taxIncluded) {
//       taxAmount = baseTotal * (taxPercentage / 100);
//     }
//     const discount = Number(item.discount) || 0;
//     return baseTotal + taxAmount - discount;
//   };

//   const overallTotal = billingItems.reduce((sum, item) => sum + calculateRowTotal(item), 0);

//   const handleBillingChange = (index, field, value) => {
//     const newItems = [...billingItems];
//     newItems[index][field] = value;
//     setBillingItems(newItems);
//   };

//   const handleSubmitBilling = async () => {
//     setError("");
//     setMessage("");
//     if (billingItems.length === 0) {
//       setError("Cart is empty.");
//       return;
//     }
//     try {
//       const formattedSales = billingItems.map((item) => ({
//         item_name: item.itemName.trim().toLowerCase(),
//         company: item.company.trim().toLowerCase(),
//         quantity: parseInt(item.quantity),
//         buyer: item.buyer ? item.buyer.trim() : "",
//         price: parseFloat(item.price),
//         taxPercentage: parseFloat(item.taxPercentage),
//         taxIncluded: item.taxIncluded,
//         discount: parseFloat(item.discount || 0),
//         hsn_code: item.hsn_code || ""
//       }));
//       console.log("formattedSales", formattedSales);
//       const payload = { sales: formattedSales };
//       const res = await axios.post("/inventory/sell-multiple", payload);
//       setMessage(res.data.message || "Billing processed successfully.");
//       setInvoiceGenerated(true); // Set the flag to true to enable the Print PDF button
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to process billing.");
//     }
//   };

//   const handlePrintPDF = () => {
//     if (!invoiceGenerated) {
//       setError("Please generate the invoice first.");
//       return;
//     }
//     const doc = new jsPDF();
//     // Header: GSTIN and Original Copy
// doc.setFont("Helvetica", "normal");
// doc.setFontSize(10);
// doc.text(`GSTIN  : ${supplier.gstin}`, 14, 10);
// doc.text("Original Copy", doc.internal.pageSize.getWidth() - 40, 10);

// // Title: TAX INVOICE (centered)
// doc.setFontSize(16);
// doc.setFont("Helvetica", "bold");
// doc.text("TAX INVOICE", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

// // Company Header (centered)
// doc.setFontSize(12);
// doc.setFont("Helvetica", "bold");
// doc.text(supplier.name, doc.internal.pageSize.getWidth() / 2, 28, { align: "center" });
// doc.setFontSize(10);
// doc.setFont("Helvetica", "normal");
// doc.text(supplier.address, doc.internal.pageSize.getWidth() / 2, 34, { align: "center" });
// doc.text(`Tel. : 9006711400   email : jahangir9934@gmail.com`, doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

// // Party Details and Invoice Info
// doc.setFontSize(10);
// doc.text("Buyer Details :", 14, 50);
// doc.text(recipient.name, 14, 56);
// doc.text(`Invoice No.    : `, doc.internal.pageSize.getWidth() - 70, 50);
// doc.text(`Dated          : ${dateOfIssuance}`, doc.internal.pageSize.getWidth() - 70, 56);
// doc.text(`Place of Supply : ${supplier.place}`, doc.internal.pageSize.getWidth() - 70, 62);
// doc.text(`Reverse Charge : ${supplier.reverseCharge}`, doc.internal.pageSize.getWidth() - 70, 68);

// // Leave a gap before table
// let startY = 75;

// // Table: Items
// const tableColumn = [
//   "S.N.",
//   "Description of Goods",
//   "HSN/SAC Code",
//   "Qty. Unit",
//   "List Price",
//   "Discount",
//   "Price",
//   "Amount(₹)"
// ];

// const tableRows = billingItems.map((item, index) => {
//   const total = calculateRowTotal(item);
//   return [
//     (index + 1).toString(),
//     item.itemName,
//     item.hsn_code,
//     `${item.quantity} Pcs.`,
//     Number(item.price).toFixed(2),
//     "0.00", // Discount is assumed to be zero as per sample; adjust if needed.
//     Number(item.price).toFixed(2),
//     total.toFixed(2)
//   ];
// });

// // AutoTable for the items. Adjust margin and startY as needed.
// doc.autoTable({
//   head: [tableColumn],
//   body: tableRows,
//   startY: startY,
//   theme: "grid",
//   styles: { fontSize: 8 },
//   headStyles: { fillColor: [220, 220, 220] }
// });

// // Grand Total row (simulate a row below the table)
// const finalY = doc.lastAutoTable.finalY;
// doc.setFontSize(10);
// doc.text(
//   `Grand Total      ${billingItems.reduce((acc, item) => acc + Number(item.quantity), 0)} Pcs.       ₹${overallTotal.toFixed(2)}`,
//   14,
//   finalY + 10
// );

// // Tax Summary Section
// // For demo, we calculate tax based on overall taxable amount.
// // In real case, break down per tax rate.
// const taxRate = 18; // assuming 18%
// const taxableAmount = overallTotal / 1.18; // reverse calculate if tax is included; adjust if needed.
// const taxAmount = overallTotal - taxableAmount;
// const cgst = taxAmount / 2;
// const sgst = taxAmount / 2;

// doc.text("Tax Rate   Taxable Amt.   CGST Amt.   SGST Amt.   Total Tax", 14, finalY + 20);
// doc.text(
//   `${taxRate}%        ${taxableAmount.toFixed(2)}     ${cgst.toFixed(2)}     ${sgst.toFixed(2)}     ${taxAmount.toFixed(2)}`,
//   14,
//   finalY + 26
// );

// const integerPart = Math.floor(overallTotal);
// const fractionPart = Math.round((overallTotal - integerPart) * 100);

// // Convert the integer part to words.
// let amountInWords = toWords(integerPart);

// // Optionally, if there is a fractional part, append it (e.g., "and 45/100").
// if (fractionPart > 0) {
//   amountInWords += ` and ${fractionPart}/100`;
// }

// // Finally, add the text to your PDF.
// doc.text(`Rupees ${amountInWords} Only`, 14, finalY + 36);

// // Declaration Section
// doc.text("Declaration", 14, finalY + 46);
// doc.text("Bank - State Bank of India", doc.internal.pageSize.getWidth() - 80, finalY + 46);
// doc.text("Branch- M.I.T, Muzaffarpur", doc.internal.pageSize.getWidth() - 80, finalY + 52);
// doc.text("A/c No-32959477419", doc.internal.pageSize.getWidth() - 80, finalY + 58);
// doc.text("IFSC-SBIN0004603", doc.internal.pageSize.getWidth() - 80, finalY + 64);

// // Terms & Conditions
// doc.text("Terms & Conditions", 14, finalY + 74);
// doc.text("1. Goods once sold will not be taken back.", 14, finalY + 80);
// doc.text("2. Interest @ 18% p.a. will be charged if the payment is not made within the stipulated time.", 14, finalY + 86);
// doc.text("is not made within the stipulated time.", 14, finalY + 86);
// doc.text("3. Subject to 'Bihar' Jurisdiction only.", 14, finalY + 92);

// // Receiver's Signature placeholder
// doc.text("Receiver's Signature  :", doc.internal.pageSize.getWidth() - 80, finalY + 80);
// doc.text("Authorised Signatory", doc.internal.pageSize.getWidth() - 80, finalY + 86);

// // Save PDF and navigate to dashboard.
// doc.save("invoice.pdf");
// navigate("/dashboard");

//   };

//   const supplierData = {
//     name: "HINDUSTAN ELECTRIC",
//     gstin: "10AIPPA4282R1ZZ",
//     address:
//       "Brahampura, Main Road, Muzaffarpur (Bihar)-842003, State Code-10",
//   };
//   useEffect(() => {
//     setSupplier(supplierData);
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold mb-4">Generate Invoice</h2>

//         {/* Supplier Information */}
//         <div className="mb-4">
//       <h3 className="font-semibold">Supplier Information</h3>
//       <input
//         type="text"
//         placeholder="Supplier Name"
//         value={supplier.name}
//         readOnly
//         className="w-full p-2 border rounded mt-1"
//       />
//       <input
//         type="text"
//         placeholder="Supplier GSTIN"
//         value={supplier.gstin}
//         readOnly
//         className="w-full p-2 border rounded mt-1"
//       />
//       <input
//         type="text"
//         placeholder="Supplier Address"
//         value={supplier.address}
//         readOnly
//         className="w-full p-2 border rounded mt-1"
//       />
//     </div>

//   {/* Recipient Information (Optional) */}
//   <div className="mb-4">
//     <h3 className="font-semibold">Recipient Information (Optional)</h3>
//     <input
//       type="text"
//       placeholder="Recipient Name"
//       value={recipient.name}
//       onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
//       className="w-full p-2 border rounded mt-1"
//     />
//     <input
//       type="text"
//       placeholder="Recipient GSTIN"
//       value={recipient.gstin}
//       onChange={(e) => setRecipient({ ...recipient, gstin: e.target.value })}
//       className="w-full p-2 border rounded mt-1"
//     />
//     <input
//       type="text"
//       placeholder="Recipient Address"
//       value={recipient.address}
//       onChange={(e) => setRecipient({ ...recipient, address: e.target.value })}
//       className="w-full p-2 border rounded mt-1"
//     />
//   </div>

//   {/* Invoice Details */}
//   <div className="mb-4">
//     <h3 className="font-semibold">Invoice Details</h3>
//     <input
//       type="date"
//       placeholder="Date of Issuance"
//       value={dateOfIssuance}
//       onChange={(e) => setDateOfIssuance(e.target.value)}
//       className="w-full p-2 border rounded mt-1"
//     />
//     <input
//       type="text"
//       placeholder="(Optional) Billing Address"
//       value=""
//       readOnly
//       className="w-full p-2 border rounded mt-1 text-gray-500"
//     />
//     <input
//       type="text"
//       placeholder="(Optional) Shipping Address"
//       value=""
//       readOnly
//       className="w-full p-2 border rounded mt-1 text-gray-500"
//     />
//   </div>

//   {/* Billing Items Table */}
//   <div className="mb-4">
//     <h3 className="font-semibold mb-2">Billing Items</h3>
//     <table className="w-full table-auto border-collapse mb-2">
//       <thead>
//         <tr className="bg-gray-200">
//           <th className="px-2 py-1 border text-center">Item Name</th>
//           <th className="px-2 py-1 border text-center">Company</th>
//           <th className="px-2 py-1 border text-center">Quantity</th>
//           <th className="px-2 py-1 border text-center">Price (₹)</th>
//           <th className="px-2 py-1 border text-center">Tax (%)</th>
//           <th className="px-2 py-1 border text-center">Tax Inc.</th>
//           <th className="px-2 py-1 border text-center">Total (₹)</th>
//         </tr>
//       </thead>
//       <tbody>
//         {billingItems.map((item, index) => (
//           <tr key={index}>
//             <td className="px-2 py-1 border text-center">{item.itemName}</td>
//             <td className="px-2 py-1 border text-center">{item.company}</td>
//             <td className="px-2 py-1 border text-center">{item.quantity}</td>
//             <td className="px-2 py-1 border text-center">{Number(item.price).toFixed(2)}</td>
//             <td className="px-2 py-1 border text-center">
//               <input
//                 type="number"
//                 min="0"
//                 value={item.taxPercentage}
//                 onChange={(e) =>
//                   handleBillingChange(index, "taxPercentage", e.target.value)
//                 }
//                 className="w-16 p-1 border rounded"
//               />
//             </td>
//             <td className="px-2 py-1 border text-center">
//               <select
//                 value={item.taxIncluded ? "included" : "excluded"}
//                 onChange={(e) =>
//                   handleBillingChange(index, "taxIncluded", e.target.value === "included")
//                 }
//                 className="p-1 border rounded"
//               >
//                 <option value="included">Included</option>
//                 <option value="excluded">Excluded</option>
//               </select>
//             </td>

//             <td className="px-2 py-1 border text-center">
//               ₹{calculateRowTotal(item).toFixed(2)}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     <div className="text-right text-lg font-semibold">
//       Overall Total: ₹{overallTotal.toFixed(2)}
//     </div>
//   </div>

//   {/* Buttons for billing */}
//   <div className="flex justify-between">
//     <button
//       onClick={handleSubmitBilling}
//       disabled={invoiceGenerated}
//       className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all"
//     >
//       Generate Invoice
//     </button>
//     <button
//       onClick={handlePrintPDF}
//       disabled={!invoiceGenerated}
//       className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-all"
//     >
//       Print PDF
//     </button>
//   </div>
//   {error && <p className="mt-4 text-center text-red-500">{error}</p>}
//   {message && <p className="mt-4 text-center text-green-500">{message}</p>}
// </div>

//   );
// }

// export default Billing;


// New Template

// src/components/Logs/Billing.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api.js";
import jsPDF from "jspdf";
import { toWords } from "number-to-words";
import "jspdf-autotable";

function Billing() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];

  // Billing items: extend with tax & discount fields
  const [billingItems, setBillingItems] = useState(
    cart.map((item) => ({
      ...item,
      taxPercentage: 0,
      taxIncluded: false,
      discount: 0,
    }))
  );

  // Invoice details
  const [isGstBill, setIsGstBill] = useState(false);
  const [supplier, setSupplier] = useState({
    name: "",
    gstin: "",
    address: "",
    phone: "",
    email: "",
    place: "",
    reverseCharge: "",
  });
  const [recipient, setRecipient] = useState({ name: "", gstin: "", address: "" });
  const [dateOfIssuance, setDateOfIssuance] = useState("");

  // Status messages
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  // Calculate total for each billing item row
  const calculateRowTotal = (item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const baseTotal = qty * price;
    const taxPercentage = Number(item.taxPercentage) || 0;
    let taxAmount = 0;
    if (!item.taxIncluded) {
      taxAmount = baseTotal * (taxPercentage / 100);
    }
    const discount = Number(item.discount) || 0;
    return baseTotal + taxAmount - discount;
  };

  // Overall total calculation
  const overallTotal = billingItems.reduce((sum, item) => sum + calculateRowTotal(item), 0);

  // Update billing item fields
  const handleBillingChange = (index, field, value) => {
    const newItems = [...billingItems];
    newItems[index][field] = value;
    setBillingItems(newItems);
  };

  // Submit billing data to backend
  const handleSubmitBilling = async () => {
    setError("");
    setMessage("");
    if (billingItems.length === 0) {
      setError("Cart is empty.");
      return;
    }
    try {
      const formattedSales = billingItems.map((item) => ({
        item_name: item.itemName.trim().toLowerCase(),
        company: item.company.trim().toLowerCase(),
        quantity: parseInt(item.quantity),
        buyer: item.buyer ? item.buyer.trim() : "",
        price: parseFloat(item.price),
        taxPercentage: parseFloat(item.taxPercentage),
        taxIncluded: item.taxIncluded,
        discount: parseFloat(item.discount || 0),
        hsn_code: item.hsn_code || "",
      }));

      const payload = {
        sales: formattedSales,
        is_gst: isGstBill,
        recipient_gst: isGstBill ? recipient.gstin.trim() : undefined,
      };

      const res = await axios.post("/inventory/sell-multiple", payload);
      setMessage(res.data.message || "Billing processed successfully.");
      setInvoiceNumber(res.data.invoice_number || "");
      console.log("Invoice Number:", res.data.invoice_number);
      setInvoiceGenerated(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process billing.");
    }
  };

  // Generate PDF using jsPDF and jspdf-autotable
  const handlePrintPDF = () => {
    if (!invoiceGenerated) {
      setError("Please generate the invoice first.");
      return;
    }

    const doc = new jsPDF("p", "pt", "a4"); // using points for precision
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20; // vertical starting position

    // --------------------- TOP SECTION ---------------------
    // Define invoice info variables
    const invoiceNo = invoiceNumber; // Replace or generate dynamically as needed
    const invoiceDate = dateOfIssuance || "20-03-2025";
    const placeOfSupply = supplier.place || "Bihar (10)";
    const reverseCharge = supplier.reverseCharge || "N";
    const partyName = recipient.name || "";
    // Use newline for multi-line address if needed
    const partyAddress = recipient.address || "";
    const partyGSTIN = recipient.gstin || "";

    // Build rows for the top section.
    // In this version, the GSTIN / UIN info is appended to the party details cell.
    const topRows = [
      [
        { content: `GSTIN  : ${supplier.gstin}`, styles: { halign: "left" } },
        { content: "Original Copy", styles: { halign: "right" } },
      ],
      [
        {
          content: "TAX INVOICE",
          colSpan: 2,
          styles: { halign: "center", fontSize: 14, fontStyle: "bold" },
        },
      ],
      [
        {
          content: supplier.name,
          colSpan: 2,
          styles: { halign: "center", fontSize: 12, fontStyle: "bold" },
        },
      ],
      [
        {
          content: supplier.address,
          colSpan: 2,
          styles: { halign: "center", fontSize: 10 },
        },
      ],
      [
        {
          content: `Tel. : ${supplier.phone}   email : ${supplier.email}`,
          colSpan: 2,
          styles: { halign: "center", fontSize: 10 },
        },
      ],
      [
        {
          content: `Party Details :\n${partyName}\n${partyAddress}\n${partyGSTIN ? `GSTIN : ${partyGSTIN}` : ""}`,
          styles: { halign: "left", fontSize: 10 },
        },
        {
          content: `Invoice No.    : ${invoiceNo}\nDated          : ${invoiceDate}\nPlace of Supply: ${placeOfSupply}\nReverse Charge : ${reverseCharge}`,
          styles: { halign: "left", fontSize: 10 },
        },
      ],
    ];

    doc.autoTable({
      startY: currentY,
      body: topRows,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 5 },
      tableWidth: "auto",
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: (pageWidth - 40) / 2 },
        1: { cellWidth: (pageWidth - 40) / 2 },
      },
    });
    currentY = doc.lastAutoTable.finalY + 10;

    // --------------------- MIDDLE SECTION (Items Table) ---------------------
    const tableHead = [
      [
        "S.N.",
        "Description of Goods",
        "HSN/SAC Code",
        "Qty. Unit",
        "List Price",
        "Discount",
        "Price",
        "Amount(₹)",
      ],
    ];

    const tableBody = billingItems.map((item, index) => {
      const total = calculateRowTotal(item);
      return [
        (index + 1).toString() + ".",
        item.itemName,
        item.hsn_code,
        `${Number(item.quantity).toFixed(2)} Pcs.`,
        Number(item.price).toFixed(2),
        Number(item.discount).toFixed(2),
        item.taxIncluded ? `${Number(item.price).toFixed(2)} (Inc)` : Number(item.price).toFixed(2),
        total.toFixed(2),
      ];
    });

    // Pad with empty rows so that table appears large even if few items exist
    const minRows = 10;
    if (tableBody.length < minRows) {
      for (let i = tableBody.length; i < minRows; i++) {
        tableBody.push(["", "", "", "", "", "", "", ""]);
      }
    }

    // Append Grand Total row (ensuring totals are under the correct columns)
    const taxRate = 18;
    const taxableAmount = overallTotal * (1 + taxRate / 100);
    const taxAmount = Math.abs(overallTotal - taxableAmount);
    const cgst = taxAmount / 2;
    const sgst = taxAmount / 2;
    const totalQuantity = billingItems.reduce((acc, item) => acc + Number(item.quantity), 0);
    const totalAmount = overallTotal + taxAmount;
    tableBody.push([
      { content: "Total", colSpan: 3, styles: { halign: "right", fontStyle: "bold" } },
      `${totalQuantity.toFixed(2)} Pcs.`,
      "", "", "",
      { content: overallTotal.toFixed(2), styles: { halign: "right", fontStyle: "bold" } },
    ]);

    tableBody.push([
      { content: "Total Amount (Tax Inc.)", colSpan: 6, styles: { halign: "right", fontStyle: "bold" } },
      "",
      { content: totalAmount.toFixed(2), styles: { halign: "right", fontStyle: "bold" } },
    ]);

    // Distribute available width proportionally across 8 columns
    const availableWidth = pageWidth - 40;
    const colStyles = {
      0: { cellWidth: availableWidth * 0.05 },
      1: { cellWidth: availableWidth * 0.35 },
      2: { cellWidth: availableWidth * 0.10 },
      3: { cellWidth: availableWidth * 0.10 },
      4: { cellWidth: availableWidth * 0.10 },
      5: { cellWidth: availableWidth * 0.10 },
      6: { cellWidth: availableWidth * 0.10 },
      7: { cellWidth: availableWidth * 0.10 },
    };

    doc.autoTable({
      startY: currentY,
      head: tableHead,
      body: tableBody,
      theme: "grid",
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [220, 220, 220] },
      columnStyles: colStyles,
    });
    currentY = doc.lastAutoTable.finalY + 10;

    // --------------------- TAX SUMMARY SECTION ---------------------

    const taxHead = [
      [
        { content: "Tax Rate", styles: { halign: "center", fontStyle: "bold" } },
        { content: "Taxable Amt.", styles: { halign: "center", fontStyle: "bold" } },
        { content: "CGST Amt.", styles: { halign: "center", fontStyle: "bold" } },
        { content: "SGST Amt.", styles: { halign: "center", fontStyle: "bold" } },
        { content: "Total Tax", styles: { halign: "center", fontStyle: "bold" } },
      ],
    ];
    const taxBody = [
      [
        `${taxRate}%`,
        overallTotal.toFixed(2),
        cgst.toFixed(2),
        sgst.toFixed(2),
        taxAmount.toFixed(2),
      ],
    ];

    doc.autoTable({
      startY: currentY,
      head: taxHead,
      body: taxBody,
      theme: "grid",
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10, cellPadding: 4 },
    });
    currentY = doc.lastAutoTable.finalY + 10;

    // --------------------- AMOUNT IN WORDS ---------------------
    const integerPart = Math.floor(overallTotal);
    const fractionPart = Math.round((overallTotal - integerPart) * 100);
    let amountInWords = toWords(integerPart);
    if (fractionPart > 0) {
      amountInWords += ` and ${fractionPart}/100`;
    }
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Rupees ${amountInWords} Only`, 25, currentY);
    currentY += 20;

    // --------------------- BOTTOM SECTION ---------------------
    // Force bottom section to appear at the bottom of the page with reduced gap
    const bottomStartY = pageHeight - 220;
    const bottomBody = [
      [
        {
          content: "Declaration",
          colSpan: 3,
          styles: { halign: "center", fontStyle: "bold" },
        },
      ],
      [
        {
          content:
            "Bank - State Bank of India\nBranch- M.I.T, Patna\nA/c No-32959477419\nIFSC-SBIN0004603",
          colSpan: 3,
          styles: { halign: "center" },
        },
      ],
      [
        {
          content:
            "Terms & Conditions\nE.& O.E.\n1. Goods once sold will not be taken back.\n2. Interest @ 18% p.a. will be charged if the payment is not made\n   within the stipulated time.\n3. Subject to 'Bihar' Jurisdiction only.",
          styles: { valign: "top", halign: "left" },
        },
        {
          content: "Receiver's Signature :",
          styles: { valign: "top", halign: "left" },
        },
        {
          content: "For HINDUSTAN ELECTRIC:\n\n\n\n\nAuthorised Signatory",
          styles: { valign: "top", halign: "left" },
        },
      ],
    ];


    doc.autoTable({
      startY: bottomStartY,
      body: bottomBody,
      theme: "grid",
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10, cellPadding: 6 },
      columnStyles: {
        0: { cellWidth: (pageWidth - 40) * 0.4 }, // Left
        1: { cellWidth: (pageWidth - 40) * 0.3 }, // Middle
        2: { cellWidth: (pageWidth - 40) * 0.3 }, // Right
      },
    });

    doc.save("invoice.pdf"); // Optional, for user download

    // Convert to Blob and send to backend
    const pdfBlob = doc.output("blob"); // jsPDF gives a Blob

    const formData = new FormData();
    formData.append("file", pdfBlob, `invoice_${invoiceNo}.pdf`);
    formData.append("invoiceNumber", invoiceNo);
    formData.append("billType", isGstBill ? "gst" : "nongst");

    axios
      .post("/upload/bill", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log("Upload success:", res.data);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Upload failed:", err);
        setError("Failed to upload invoice.");
      });
    navigate("/dashboard");
  };

  // Supplier data matching the desired template design
  const supplierData = {
    name: "HINDUSTAN ELECTRIC",
    gstin: "10AIPPA4282R1ZZ",
    address: "Brahampura, Main Road, Muzaffarpur(Bihar)-842003, State Code-10",
    phone: "9006711400",
    email: "jahangir9934@gmail.com",
    place: "Bihar (10)",
    // reverseCharge: "N",
  };

  useEffect(() => {
    setSupplier(supplierData);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Generate Invoice</h2>

      {/* Supplier Information */}
      <div className="mb-4">
        <h3 className="font-semibold">Supplier Information</h3>
        <input
          type="text"
          placeholder="Supplier Name"
          value={supplier.name}
          readOnly
          className="w-full p-2 border rounded mt-1"
        />
        <input
          type="text"
          placeholder="Supplier GSTIN"
          value={supplier.gstin}
          readOnly
          className="w-full p-2 border rounded mt-1"
        />
        <input
          type="text"
          placeholder="Supplier Address"
          value={supplier.address}
          readOnly
          className="w-full p-2 border rounded mt-1"
        />
      </div>

      {/* Recipient Information */}
      <div className="mb-4">
        <h3 className="font-semibold">Recipient Information (Optional)</h3>
        <input
          type="text"
          placeholder="Recipient Name"
          value={recipient.name}
          onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
          className="w-full p-2 border rounded mt-1"
        />
        {isGstBill && (
          <input
            type="text"
            placeholder="Recipient GSTIN"
            value={recipient.gstin}
            onChange={(e) => setRecipient({ ...recipient, gstin: e.target.value })}
            className="w-full p-2 border rounded mt-1"
          />
        )}
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient.address}
          onChange={(e) => setRecipient({ ...recipient, address: e.target.value })}
          className="w-full p-2 border rounded mt-1"
        />
      </div>

      {/* Invoice Details */}
      <div className="mb-4">
        <h3 className="font-semibold">Invoice Details</h3>
        <input
          type="date"
          placeholder="Date of Issuance"
          value={dateOfIssuance}
          onChange={(e) => setDateOfIssuance(e.target.value)}
          className="w-full p-2 border rounded mt-1"
        />
      </div>

      {/* Billing Items Table */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Billing Items</h3>
        <table className="w-full table-auto border-collapse mb-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-1 border text-center">Item Name</th>
              <th className="px-2 py-1 border text-center">Company</th>
              <th className="px-2 py-1 border text-center">Quantity</th>
              <th className="px-2 py-1 border text-center">Price (₹)</th>
              <th className="px-2 py-1 border text-center">Tax (%)</th>
              <th className="px-2 py-1 border text-center">Tax Inc.</th>
              <th className="px-2 py-1 border text-center">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {billingItems.map((item, index) => (
              <tr key={index}>
                <td className="px-2 py-1 border text-center">{item.itemName}</td>
                <td className="px-2 py-1 border text-center">{item.company}</td>
                <td className="px-2 py-1 border text-center">{item.quantity}</td>
                <td className="px-2 py-1 border text-center">{Number(item.price).toFixed(2)}</td>
                <td className="px-2 py-1 border text-center">
                  <input
                    type="number"
                    min="0"
                    value={item.taxPercentage}
                    onChange={(e) => handleBillingChange(index, "taxPercentage", e.target.value)}
                    className="w-16 p-1 border rounded"
                  />
                </td>
                <td className="px-2 py-1 border text-center">
                  <select
                    value={item.taxIncluded ? "included" : "excluded"}
                    onChange={(e) =>
                      handleBillingChange(index, "taxIncluded", e.target.value === "included")
                    }
                    className="p-1 border rounded"
                  >
                    <option value="included">Included</option>
                    <option value="excluded">Excluded</option>
                  </select>
                </td>
                <td className="px-2 py-1 border text-center">₹{calculateRowTotal(item).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right text-lg font-semibold">
          Overall Total: ₹{overallTotal.toFixed(2)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-4">
        <label>
          <input
            type="checkbox"
            checked={isGstBill}
            onChange={(e) => setIsGstBill(e.target.checked)}
          />
          {" "}Generate GST Invoice
        </label>
      </div>
      <div className="flex justify-between">
        <button
          onClick={handleSubmitBilling}
          disabled={invoiceGenerated}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all"
        >
          Generate Invoice
        </button>
        <button
          onClick={handlePrintPDF}
          disabled={!invoiceGenerated}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-all"
        >
          Print PDF
        </button>
      </div>

      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
    </div>
  );
}

export default Billing;


