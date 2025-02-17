// src/components/Logs/Billing.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api.js";
import jsPDF from "jspdf";
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
      hsn_code: ""        // placeholder for HSN code
    }))
  );
  
  // Additional invoice details
  const [supplier, setSupplier] = useState({ name: "", gstin: "", address: "" });
  const [recipient, setRecipient] = useState({ name: "", gstin: "", address: "" });
  const [dateOfIssuance, setDateOfIssuance] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [chargeType, setChargeType] = useState("forward"); // "forward" or "reverse"
  const [signature, setSignature] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Calculate row total for each billing item.
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

  // Function to update billing item fields.
  const handleBillingChange = (index, field, value) => {
    const newItems = [...billingItems];
    if (field === "taxIncluded") {
      newItems[index][field] = value === "included";
    } else {
      newItems[index][field] = value;
    }
    setBillingItems(newItems);
  };

  // Submit billing: reformat keys and call backend sell-multiple endpoint.
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
        buyer: item.buyer.trim(),
        price: parseFloat(item.price),
        taxPercentage: parseFloat(item.taxPercentage),
        taxIncluded: item.taxIncluded,
        discount: parseFloat(item.discount || 0),
        hsn_code: item.hsn_code || ""
      }));
      const payload = { sales: formattedSales };
      const res = await axios.post("/inventory/sell-multiple", payload);
      setMessage(res.data.message || "Billing processed successfully.");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process billing.");
    }
  };

  // Optional: PDF printing for the generated invoice.
  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("GST Invoice", 14, 22);
    doc.setFontSize(11);
    doc.text(`Supplier: ${supplier.name}`, 14, 32);
    doc.text(`GSTIN: ${supplier.gstin}`, 14, 38);
    doc.text(`Address: ${supplier.address}`, 14, 44);
    doc.text(`Date: ${dateOfIssuance}`, 14, 50);
    doc.text(`Invoice No.: (generated on backend)`, 14, 56);

    const tableColumn = ["Item Name", "Company", "Qty", "Price (₹)", "Tax (%)", "Tax Inc.", "Discount (₹)", "Total (₹)"];
    const tableRows = billingItems.map(item => {
      const total = calculateRowTotal(item);
      return [
        item.itemName,
        item.company,
        item.quantity,
        Number(item.price).toFixed(2),
        item.taxPercentage + "%",
        item.taxIncluded ? "Yes" : "No",
        Number(item.discount).toFixed(2),
        total.toFixed(2)
      ];
    });

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 62 });
    doc.text(`Overall Total: ₹${overallTotal.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save("invoice.pdf");
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
          placeholder="Billing Address"
          value={billingAddress}
          onChange={(e) => setBillingAddress(e.target.value)}
          className="w-full p-2 border rounded mt-1"
        />
        <input
          type="text"
          placeholder="Shipping Address"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          className="w-full p-2 border rounded mt-1"
        />
        <select
          value={chargeType}
          onChange={(e) => setChargeType(e.target.value)}
          className="w-full p-2 border rounded mt-1"
        >
          <option value="forward">Forward Charge</option>
          <option value="reverse">Reverse Charge</option>
        </select>
        <input
          type="text"
          placeholder="Signature of Issuer"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className="w-full p-2 border rounded mt-1"
        />
      </div>

      {/* Billing Items Table */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Billing Items</h3>
        <table className="w-full table-auto border-collapse mb-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-1 border">Item Name</th>
              <th className="px-2 py-1 border">Company</th>
              <th className="px-2 py-1 border">Quantity</th>
              <th className="px-2 py-1 border">Price (₹)</th>
              <th className="px-2 py-1 border">Tax (%)</th>
              <th className="px-2 py-1 border">Tax Inc.</th>
              <th className="px-2 py-1 border">Total (₹)</th>
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
                    onChange={(e) => handleBillingChange(index, "taxIncluded", e.target.value)}
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

      {/* Buttons for billing */}
      <div className="flex justify-between">
        <button
          onClick={handleSubmitBilling}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all"
        >
          Generate Invoice
        </button>
        <button
          onClick={handlePrintPDF}
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
