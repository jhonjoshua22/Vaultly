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

  const submit = () => addSpend(payment);

  return (
    <div style={overlayStyle}>
      <div style={modal}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0 }}>Add Spend</h3>
          <X size={24} onClick={() => setShowAdd(false)} style={{ cursor: "pointer" }} />
        </div>

        {/* Inputs Container */}
        <div style={inputsContainer}>
          <input
            style={input}
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            style={input}
            type="text"
            placeholder="Item"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
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
        </div>

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
  borderRadius: "20px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  width: "90%",
  maxWidth: "320px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
};

const inputsContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  width: "100%",
};

const input = {
  width: "90%",           // Not full width
  maxWidth: "250px",      // Compact like your screenshot
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#000",
  color: "white",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const saveBtn = {
  width: "90%",
  maxWidth: "250px",
  padding: "12px",
  borderRadius: "10px",
  backgroundColor: "#10b981",
  color: "white",
  border: "none",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
};

export default AddSpendModal;