// src/components/Logs/Billing.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api.js";
import jsPDF from "jspdf";
import { toWords } from 'number-to-words';
import "jspdf-autotable";

function Billing() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];

  // Billing items are initially taken from cart; extend each with tax fields.
  const [billingItems, setBillingItems] = useState(
    cart.map((item) => ({
      ...item,
      taxPercentage: 0,   // default tax percentage
      taxIncluded: false, // default: tax is excluded
      discount: 0,        // optional discount amount (in ₹)
    }))
  );

  console.log("billingItems", billingItems);

  // Additional invoice details
  const [supplier, setSupplier] = useState({ name: "", gstin: "", address: "" });
  const [recipient, setRecipient] = useState({ name: "", gstin: "", address: "" });
  const [dateOfIssuance, setDateOfIssuance] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [chargeType, setChargeType] = useState("forward");
  const [signature, setSignature] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

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

  const overallTotal = billingItems.reduce((sum, item) => sum + calculateRowTotal(item), 0);

  const handleBillingChange = (index, field, value) => {
    const newItems = [...billingItems];
    newItems[index][field] = value;
    setBillingItems(newItems);
  };

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
        hsn_code: item.hsn_code || ""
      }));
      console.log("formattedSales", formattedSales);
      const payload = { sales: formattedSales };
      const res = await axios.post("/inventory/sell-multiple", payload);
      setMessage(res.data.message || "Billing processed successfully.");
      setInvoiceGenerated(true); // Set the flag to true to enable the Print PDF button
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process billing.");
    }
  };

  const handlePrintPDF = () => {
    if (!invoiceGenerated) {
      setError("Please generate the invoice first.");
      return;
    }
    const doc = new jsPDF();
    // Header: GSTIN and Original Copy
doc.setFont("Helvetica", "normal");
doc.setFontSize(10);
doc.text(`GSTIN  : ${supplier.gstin}`, 14, 10);
doc.text("Original Copy", doc.internal.pageSize.getWidth() - 40, 10);

// Title: TAX INVOICE (centered)
doc.setFontSize(16);
doc.setFont("Helvetica", "bold");
doc.text("TAX INVOICE", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

// Company Header (centered)
doc.setFontSize(12);
doc.setFont("Helvetica", "bold");
doc.text(supplier.name, doc.internal.pageSize.getWidth() / 2, 28, { align: "center" });
doc.setFontSize(10);
doc.setFont("Helvetica", "normal");
doc.text(supplier.address, doc.internal.pageSize.getWidth() / 2, 34, { align: "center" });
doc.text(`Tel. : 9006711400   email : jahangir9934@gmail.com`, doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

// Party Details and Invoice Info
doc.setFontSize(10);
doc.text("Buyer Details :", 14, 50);
doc.text(recipient.name, 14, 56);
doc.text(`Invoice No.    : `, doc.internal.pageSize.getWidth() - 70, 50);
doc.text(`Dated          : ${dateOfIssuance}`, doc.internal.pageSize.getWidth() - 70, 56);
doc.text(`Place of Supply : ${supplier.place}`, doc.internal.pageSize.getWidth() - 70, 62);
doc.text(`Reverse Charge : ${supplier.reverseCharge}`, doc.internal.pageSize.getWidth() - 70, 68);

// Leave a gap before table
let startY = 75;

// Table: Items
const tableColumn = [
  "S.N.",
  "Description of Goods",
  "HSN/SAC Code",
  "Qty. Unit",
  "List Price",
  "Discount",
  "Price",
  "Amount(₹)"
];

const tableRows = billingItems.map((item, index) => {
  const total = calculateRowTotal(item);
  return [
    (index + 1).toString(),
    item.itemName,
    item.hsn_code,
    `${item.quantity} Pcs.`,
    Number(item.price).toFixed(2),
    "0.00", // Discount is assumed to be zero as per sample; adjust if needed.
    Number(item.price).toFixed(2),
    total.toFixed(2)
  ];
});

// AutoTable for the items. Adjust margin and startY as needed.
doc.autoTable({
  head: [tableColumn],
  body: tableRows,
  startY: startY,
  theme: "grid",
  styles: { fontSize: 8 },
  headStyles: { fillColor: [220, 220, 220] }
});

// Grand Total row (simulate a row below the table)
const finalY = doc.lastAutoTable.finalY;
doc.setFontSize(10);
doc.text(
  `Grand Total      ${billingItems.reduce((acc, item) => acc + Number(item.quantity), 0)} Pcs.       ₹${overallTotal.toFixed(2)}`,
  14,
  finalY + 10
);

// Tax Summary Section
// For demo, we calculate tax based on overall taxable amount.
// In real case, break down per tax rate.
const taxRate = 18; // assuming 18%
const taxableAmount = overallTotal / 1.18; // reverse calculate if tax is included; adjust if needed.
const taxAmount = overallTotal - taxableAmount;
const cgst = taxAmount / 2;
const sgst = taxAmount / 2;

doc.text("Tax Rate   Taxable Amt.   CGST Amt.   SGST Amt.   Total Tax", 14, finalY + 20);
doc.text(
  `${taxRate}%        ${taxableAmount.toFixed(2)}     ${cgst.toFixed(2)}     ${sgst.toFixed(2)}     ${taxAmount.toFixed(2)}`,
  14,
  finalY + 26
);

const integerPart = Math.floor(overallTotal);
const fractionPart = Math.round((overallTotal - integerPart) * 100);

// Convert the integer part to words.
let amountInWords = toWords(integerPart);

// Optionally, if there is a fractional part, append it (e.g., "and 45/100").
if (fractionPart > 0) {
  amountInWords += ` and ${fractionPart}/100`;
}

// Finally, add the text to your PDF.
doc.text(`Rupees ${amountInWords} Only`, 14, finalY + 36);

// Declaration Section
doc.text("Declaration", 14, finalY + 46);
doc.text("Bank - State Bank of India", doc.internal.pageSize.getWidth() - 80, finalY + 46);
doc.text("Branch- M.I.T, Muzaffarpur", doc.internal.pageSize.getWidth() - 80, finalY + 52);
doc.text("A/c No-32959477419", doc.internal.pageSize.getWidth() - 80, finalY + 58);
doc.text("IFSC-SBIN0004603", doc.internal.pageSize.getWidth() - 80, finalY + 64);

// Terms & Conditions
doc.text("Terms & Conditions", 14, finalY + 74);
doc.text("1. Goods once sold will not be taken back.", 14, finalY + 80);
doc.text("2. Interest @ 18% p.a. will be charged if the payment is not made within the stipulated time.", 14, finalY + 86);
doc.text("is not made within the stipulated time.", 14, finalY + 86);
doc.text("3. Subject to 'Bihar' Jurisdiction only.", 14, finalY + 92);

// Receiver's Signature placeholder
doc.text("Receiver's Signature  :", doc.internal.pageSize.getWidth() - 80, finalY + 80);
doc.text("Authorised Signatory", doc.internal.pageSize.getWidth() - 80, finalY + 86);

// Save PDF and navigate to dashboard.
doc.save("invoice.pdf");
navigate("/dashboard");

  };

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
      onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
      className="w-full p-2 border rounded mt-1"
    />
    <input
      type="text"
      placeholder="Supplier GSTIN"
      value={supplier.gstin}
      onChange={(e) => setSupplier({ ...supplier, gstin: e.target.value })}
      className="w-full p-2 border rounded mt-1"
    />
    <input
      type="text"
      placeholder="Supplier Address"
      value={supplier.address}
      onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
      className="w-full p-2 border rounded mt-1"
    />
  </div>

  {/* Recipient Information (Optional) */}
  <div className="mb-4">
    <h3 className="font-semibold">Recipient Information (Optional)</h3>
    <input
      type="text"
      placeholder="Recipient Name"
      value={recipient.name}
      onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
      className="w-full p-2 border rounded mt-1"
    />
    <input
      type="text"
      placeholder="Recipient GSTIN"
      value={recipient.gstin}
      onChange={(e) => setRecipient({ ...recipient, gstin: e.target.value })}
      className="w-full p-2 border rounded mt-1"
    />
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
    <input
      type="text"
      placeholder="(Optional) Billing Address"
      value=""
      readOnly
      className="w-full p-2 border rounded mt-1 text-gray-500"
    />
    <input
      type="text"
      placeholder="(Optional) Shipping Address"
      value=""
      readOnly
      className="w-full p-2 border rounded mt-1 text-gray-500"
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
                onChange={(e) =>
                  handleBillingChange(index, "taxPercentage", e.target.value)
                }
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

            <td className="px-2 py-1 border text-center">
              ₹{calculateRowTotal(item).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="text-right text-lg font-semibold">
      Overall Total: ₹{overallTotal.toFixed(2)}
    </div>
  </div>

  {/* Buttons for billing */}
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