import React, { useState } from "react";
import { Plus, Trash2, Bell, ChevronDown, ChevronUp } from "lucide-react";

const Home = ({ userName = "User" }) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const [spendAvail] = useState(150);

  const [logs, setLogs] = useState([
    {
      id: 1,
      amount: 25,
      time: "10:30 AM",
      date: "Mar 15, 2026",
      desc: "Coffee & Breakfast",
    },
  ]);

  const [expandedId, setExpandedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  // Example friends data (frontend only for now)
  const followed = [
    {
      name: "Alex",
      logs: [
        { id: 1, amount: 10, desc: "Lunch", time: "12:30 PM" },
        { id: 2, amount: 5, desc: "Coffee", time: "2:15 PM" },
      ],
    },
    {
      name: "Jamie",
      logs: [{ id: 1, amount: 20, desc: "Groceries", time: "11:45 AM" }],
    },
  ];

  const totalSpent = logs.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const addSpend = () => {
    if (!amount || !desc) return;

    const now = new Date();

    const newLog = {
      id: Date.now(),
      amount: Number(amount),
      desc,
      date: now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setLogs([newLog, ...logs]);

    setAmount("");
    setDesc("");
    setShowAdd(false);
  };

  const deleteLog = (id) => {
    setLogs(logs.filter((l) => l.id !== id));
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerSectionStyle}>
        <div style={avatarStyle}></div>

        <p style={greetingStyle}>
          Hi <strong>{userName}</strong>, it's {today} and{" "}
          {spendAvail > 0
            ? `your remaining spend available is $${spendAvail}.`
            : "you have used all your money for today!"}
        </p>
      </div>

      {/* Daily Total */}
      <div style={cardStyle}>
        <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>
          Spent Today
        </p>

        <h1 style={{ margin: "5px 0", color: "#10b981" }}>${totalSpent}</h1>
      </div>

      {/* Add Spend Button */}
      <button style={addBtn} onClick={() => setShowAdd(true)}>
        <Plus size={18} /> Add Spend
      </button>

      {/* Add Spend Modal */}
      {showAdd && (
        <div style={modal}>
          <h3>Add Spend</h3>

          <input
            style={input}
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            style={input}
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <button style={saveBtn} onClick={addSpend}>
              Save
            </button>

            <button style={cancelBtn} onClick={() => setShowAdd(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Spend Logs */}
      <h3 style={{ marginTop: "25px" }}>Your Activity</h3>

      {logs.length === 0 && (
        <p style={{ opacity: 0.6 }}>No spending recorded today.</p>
      )}

      {logs.map((log) => (
        <div
          key={log.id}
          style={logItemStyle}
          onClick={() =>
            setExpandedId(expandedId === log.id ? null : log.id)
          }
        >
          <div style={logHeaderStyle}>
            <span>{log.desc}</span>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <strong>${log.amount}</strong>
              <small style={{ opacity: 0.6 }}>{log.time}</small>

              {expandedId === log.id ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
          </div>

          {expandedId === log.id && (
            <div style={expandedDetailsStyle}>
              <p>Date: {log.date}</p>

              <button
                style={deleteBtnStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteLog(log.id);
                }}
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Friends Spend */}
      <h3 style={{ marginTop: "30px" }}>Friends Spend Today</h3>

      {followed.map((friend) => (
        <div key={friend.name} style={cardStyle}>
          <div style={friendHeader}>
            <strong>{friend.name}</strong>
            <Bell size={16} />
          </div>

          {friend.logs.map((log) => (
            <div key={log.id} style={friendLog}>
              <span>{log.desc}</span>
              <span>
                ${log.amount} • {log.time}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

/* Styles */

const pageStyle = {
  padding: "20px",
  paddingBottom: "120px",
};

const headerSectionStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "25px",
  alignItems: "center",
};

const avatarStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(45deg,#10b981,#064e3b)",
};

const greetingStyle = {
  fontSize: "0.9rem",
  lineHeight: "1.4",
};

const cardStyle = {
  background: "#111",
  padding: "20px",
  borderRadius: "18px",
  border: "1px solid #222",
  marginTop: "10px",
};

const logItemStyle = {
  background: "#111",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #222",
  marginBottom: "10px",
  cursor: "pointer",
};

const logHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const expandedDetailsStyle = {
  marginTop: "10px",
  borderTop: "1px solid #333",
  paddingTop: "10px",
};

const deleteBtnStyle = {
  background: "#7f1d1d",
  border: "none",
  color: "#fecaca",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const addBtn = {
  marginTop: "20px",
  background: "#10b981",
  border: "none",
  color: "white",
  padding: "10px 14px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  cursor: "pointer",
};

const modal = {
  background: "#111",
  border: "1px solid #333",
  padding: "20px",
  borderRadius: "14px",
  marginTop: "20px",
};

const input = {
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #333",
  background: "#000",
  color: "white",
};

const saveBtn = {
  background: "#10b981",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
};

const cancelBtn = {
  background: "#333",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
};

const friendHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const friendLog = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.85rem",
  opacity: 0.8,
};

export default Home;
