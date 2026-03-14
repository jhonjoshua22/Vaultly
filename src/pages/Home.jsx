import React, { useState } from "react";
import { Plus, Trash2, Bell, ChevronDown, ChevronUp, X } from "lucide-react";

const Home = ({ userName = "User" }) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const [spendAvail] = useState(150);
  const [logs, setLogs] = useState([
    { id: 1, amount: 25, time: "10:30 AM", date: "Mar 15, 2026", desc: "Coffee & Breakfast" },
  ]);
  const [expandedId, setExpandedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const followed = [
    { name: "Alex", logs: [{ id: 1, amount: 10, desc: "Lunch", time: "12:30 PM" }, { id: 2, amount: 5, desc: "Coffee", time: "2:15 PM" }] },
    { name: "Jamie", logs: [{ id: 1, amount: 20, desc: "Groceries", time: "11:45 AM" }] },
  ];

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

  const deleteLog = (id) => setLogs(logs.filter((l) => l.id !== id));

  return (
    <div style={pageStyle}>
      <div style={headerSectionStyle}>
        <div style={avatarStyle}></div>
        <p style={greetingStyle}>
          Hi <strong>{userName}</strong>, it's {today} and{" "}
          {spendAvail > 0 ? `your remaining spend available is $${spendAvail}.` : "you have used all your money for today!"}
        </p>
      </div>

      <div style={cardStyle}>
        <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>Spent Today</p>
        <h1 style={{ margin: "5px 0", color: "#10b981" }}>${totalSpent}</h1>
      </div>

      <button style={addBtn} onClick={() => setShowAdd(true)}><Plus size={18} /> Add Spend</button>

      {showAdd && (
        <div style={overlayStyle}>
          <div style={modal}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3>Add Spend</h3>
              <X size={20} onClick={() => setShowAdd(false)} style={{ cursor: "pointer" }} />
            </div>
            <input style={input} type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input style={input} placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <button style={saveBtn} onClick={addSpend}>Save Entry</button>
          </div>
        </div>
      )}

      <h3 style={{ marginTop: "25px" }}>Your Activity</h3>
      {logs.length === 0 && <p style={{ opacity: 0.6 }}>No spending recorded today.</p>}
      {logs.map((log) => (
        <div key={log.id} style={logItemStyle} onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
          <div style={logHeaderStyle}>
            <span>{log.desc}</span>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <strong>${log.amount}</strong>
              <small style={{ opacity: 0.6 }}>{log.time}</small>
              {expandedId === log.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
          {expandedId === log.id && (
            <div style={expandedDetailsStyle}>
              <p>Date: {log.date}</p>
              <button style={deleteBtnStyle} onClick={(e) => { e.stopPropagation(); deleteLog(log.id); }}>
                <Trash2 size={14} /> Remove
              </button>
            </div>
          )}
        </div>
      ))}

      <h3 style={{ marginTop: "30px" }}>Friends Spend Today</h3>
      {followed.map((friend) => (
        <div key={friend.name} style={cardStyle}>
          <div style={friendHeader}><strong>{friend.name}</strong><Bell size={16} /></div>
          {friend.logs.map((log) => (
            <div key={log.id} style={friendLog}><span>{log.desc}</span><span>${log.amount} • {log.time}</span></div>
          ))}
        </div>
      ))}
    </div>
  );
};

const pageStyle = { padding: "20px", paddingBottom: "120px", maxWidth: "600px", margin: "auto" };
const headerSectionStyle = { display: "flex", gap: "15px", marginBottom: "25px", alignItems: "center" };
const avatarStyle = { width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(45deg,#10b981,#064e3b)" };
const greetingStyle = { fontSize: "0.9rem", lineHeight: "1.4" };
const cardStyle = { background: "#111", padding: "20px", borderRadius: "18px", border: "1px solid #222", marginTop: "10px" };
const logItemStyle = { background: "#111", padding: "15px", borderRadius: "12px", border: "1px solid #222", marginBottom: "10px", cursor: "pointer" };
const logHeaderStyle = { display: "flex", justifyContent: "space-between" };
const expandedDetailsStyle = { marginTop: "10px", borderTop: "1px solid #333", paddingTop: "10px" };
const deleteBtnStyle = { background: "#7f1d1d", border: "none", color: "#fecaca", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", display: "flex", gap: "5px" };
const addBtn = { marginTop: "20px", background: "#10b981", border: "none", color: "white", padding: "12px 20px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", width: "100%", justifyContent: "center", fontWeight: "bold" };
const overlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 1000 };
const modal = { background: "#111", border: "1px solid #333", padding: "24px", borderRadius: "20px", width: "100%", maxWidth: "400px" };
const input = { width: "100%", boxSizing: "border-box", marginBottom: "15px", padding: "12px", borderRadius: "10px", border: "1px solid #333", background: "#000", color: "white" };
const saveBtn = { background: "#10b981", border: "none", padding: "12px", borderRadius: "10px", color: "white", cursor: "pointer", width: "100%", fontWeight: "bold" };
const friendHeader = { display: "flex", justifyContent: "space-between", marginBottom: "10px" };
const friendLog = { display: "flex", justifyContent: "space-between", fontSize: "0.85rem", opacity: 0.8, marginBottom: "5px" };

export default Home;