import React, { useState } from "react";
import { Plus, Trash2, Bell, ChevronDown, ChevronUp, X } from "lucide-react";

const Home = ({ userName = "User" }) => {
  const [logs, setLogs] = useState([
    { id: 1, amount: 25, time: "10:30 AM", date: "Mar 15, 2026", desc: "Coffee & Breakfast" },
  ]);
  const [expandedId, setExpandedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const totalSpent = logs.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const addSpend = () => {
    if (!amount || !desc) return;
    const now = new Date();
    setLogs([{
      id: Date.now(),
      amount: Number(amount),
      desc,
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }, ...logs]);
    setAmount(""); setDesc(""); setShowAdd(false);
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h2 style={{ margin: 0 }}>Hi, {userName}</h2>
          <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <div style={avatarStyle}></div>
      </div>

      {/* Main Stats Card */}
      <div style={statCardStyle}>
        <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.7 }}>Total Spent Today</p>
        <h1 style={{ margin: "10px 0", fontSize: "2.5rem" }}>${totalSpent}</h1>
        <button style={addBtnStyle} onClick={() => setShowAdd(true)}>
          <Plus size={20} /> Add Expense
        </button>
      </div>

      {/* Modal Overlay */}
      {showAdd && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ margin: 0 }}>New Expense</h3>
              <X size={20} onClick={() => setShowAdd(false)} style={{ cursor: "pointer" }} />
            </div>
            <input type="number" placeholder="Amount ($)" style={inputStyle} value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input type="text" placeholder="What did you buy?" style={inputStyle} value={desc} onChange={(e) => setDesc(e.target.value)} />
            <button style={fullWidthBtn} onClick={addSpend}>Save Entry</button>
          </div>
        </div>
      )}

      <h3 style={{ marginTop: "30px" }}>Recent Activity</h3>
      {logs.map((log) => (
        <div key={log.id} style={logCardStyle} onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{log.desc}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <strong>${log.amount}</strong>
              {expandedId === log.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
          {expandedId === log.id && (
            <div style={detailsStyle}>
              <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>{log.date} • {log.time}</p>
              <button style={deleteBtn} onClick={() => setLogs(logs.filter(l => l.id !== log.id))}><Trash2 size={14} /> Remove</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* Professional CSS-in-JS Styles */
const pageStyle = { padding: "20px", maxWidth: "500px", margin: "0 auto" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const avatarStyle = { width: "50px", height: "50px", borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #059669)" };
const statCardStyle = { background: "#111", padding: "30px", borderRadius: "24px", border: "1px solid #222", textAlign: "center" };
const addBtnStyle = { background: "#fff", color: "#000", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", margin: "0 auto", gap: "8px" };
const overlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-end", zIndex: 100 };
const modalStyle = { background: "#181818", padding: "30px", borderRadius: "24px 24px 0 0", width: "100%", borderTop: "1px solid #333" };
const inputStyle = { width: "100%", padding: "15px", marginBottom: "15px", borderRadius: "12px", border: "1px solid #333", background: "#000", color: "#fff", boxSizing: "border-box" };
const fullWidthBtn = { width: "100%", padding: "15px", background: "#10b981", border: "none", borderRadius: "12px", color: "#000", fontWeight: "bold", cursor: "pointer" };
const logCardStyle = { background: "#111", padding: "20px", borderRadius: "16px", marginBottom: "12px", border: "1px solid #222", cursor: "pointer" };
const detailsStyle = { marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center" };
const deleteBtn = { background: "#450a0a", color: "#f87171", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" };

export default Home;