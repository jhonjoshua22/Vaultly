import React, { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../lib/supabase";

const AddMoneyModal = ({ userId, balances, setBalances, setShowAddMoney }) => {
  const [from, setFrom] = useState("Work");
  const [to, setTo] = useState("cash");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");

  const handleProcess = async () => {
    if (!amount || !title) return;
    const val = Number(amount);
    let updated = { ...balances };

    // LOGIC 1: Income (External to Money)
    const isIncome = ["Work", "Allowance", "Others"].includes(from);
    // LOGIC 2: Money to Credits
    const isPayingCredit = ["bdoCredit", "eastwestCredit"].includes(to);
    // LOGIC 3: Money to Money (Transfer)
    const isTransfer = !isIncome && !isPayingCredit;

    if (isIncome) {
      updated[to] += val;
    } else if (isPayingCredit) {
      updated[from] -= val; // Deduct from Money
      updated[to] -= val;   // Deduct from Credit balance
    } else if (isTransfer) {
      updated[from] -= val; // Sender
      updated[to] += val;   // Receiver
    }

    const { error } = await supabase.from("balances").update({
      gcash: updated.gcash,
      cash: updated.cash,
      bdo_savings: updated.bdoSavings,
      bdo_credit: updated.bdoCredit,
      eastwest_credit: updated.eastwestCredit,
      updated_at: new Date()
    }).eq("user_id", userId);

    if (!error) {
      setBalances(updated);
      setShowAddMoney(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <h3 style={{ margin: 0 }}>Add Money / Pay</h3>
          <X onClick={() => setShowAddMoney(false)} style={{ cursor: "pointer" }} />
        </div>

        <div style={formGroup}>
          <label style={label}>From:</label>
          <select style={input} value={from} onChange={(e) => setFrom(e.target.value)}>
            <option value="Work">Work</option>
            <option value="Allowance">Allowance</option>
            <option value="Others">Others</option>
            <option value="bdoSavings">BDO Savings</option>
            <option value="gcash">GCash</option>
            <option value="cash">Cash</option>
          </select>

          <label style={label}>To:</label>
          <select style={input} value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="gcash">GCash</option>
            <option value="bdoSavings">BDO Savings</option>
            <option value="bdoCredit">BDO Credits</option>
            <option value="eastwestCredit">Eastwest Credits</option>
          </select>

          <input style={input} type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input style={input} placeholder="Title/Notes" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <button style={procBtn} onClick={handleProcess}>Confirm Transaction</button>
      </div>
    </div>
  );
};

const overlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 };
const modal = { background: "#111", padding: 24, borderRadius: 20, width: "90%", maxWidth: 350, border: "1px solid #333" };
const formGroup = { display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 20 };
const input = { padding: 12, background: "#000", border: "1px solid #333", color: "white", borderRadius: 10, outline: "none" };
const label = { fontSize: "0.7rem", opacity: 0.5, marginBottom: -5 };
const procBtn = { marginTop: 20, background: "#3b82f6", border: "none", color: "white", padding: 12, borderRadius: 10, width: "100%", fontWeight: "bold", cursor: "pointer" };

export default AddMoneyModal;