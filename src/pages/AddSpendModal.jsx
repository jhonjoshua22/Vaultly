import React, { useState } from "react";
import { X } from "lucide-react";

const AddSpendModal = ({
  amount,
  setAmount,
  desc,
  setDesc,
  addSpend,
  setShowAdd
}) => {
  const [payment, setPayment] = useState("cash");

  const submit = () => {
    addSpend(payment);
  };

  return (
    <div style={overlayStyle}>
      <div style={modal}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0 }}>Add Spend</h3>
          <X size={24} onClick={() => setShowAdd(false)} style={{ cursor: "pointer" }} />
        </div>

        {/* Amount */}
        <input
          style={input}
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Description */}
        <input
          style={input}
          type="text"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {/* Payment Method */}
        <select
          style={input}
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option value="cash">Cash</option>
          <option value="gcash">GCash</option>
          <option value="bdoSavings">BDO Savings</option>
          <option value="bdoCredit">BDO Credit</option>
          <option value="eastwestCredit">Eastwest Credit</option>
        </select>

        <button style={saveBtn} onClick={submit}>
          Save Entry
        </button>
      </div>
    </div>
  );
};

/* --- Styles --- */
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 1000,
};

const modal = {
  background: "#111",
  border: "1px solid #333",
  padding: "30px 24px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "420px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
};

const input = {
  width: "100%",
  padding: "14px 12px",
  borderRadius: "12px",
  border: "1px solid #333",
  background: "#000",
  color: "#fff",
  fontSize: "16px", // prevents zoom on mobile
  outline: "none",
};

const saveBtn = {
  background: "#10b981",
  border: "none",
  padding: "14px",
  borderRadius: "12px",
  color: "white",
  width: "100%",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px",
};

export default AddSpendModal;