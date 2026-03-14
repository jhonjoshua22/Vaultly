import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Home = ({ userName }) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const [spendAvail, setSpendAvail] = useState(150);

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

  // Example followed friends data
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
      logs: [
        { id: 1, amount: 20, desc: "Groceries", time: "11:45 AM" },
      ],
    },
  ];

  const totalSpent = logs.reduce((acc, curr) => acc + curr.amount, 0);

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

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerSectionStyle}>
        <div style={avatarStyle}></div>

        <p style={greetingStyle}>
          Hi {userName}, it's {today} and{" "}
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
        <h1 style={{ margin: "5px 0", color: "#10b981" }}>
          ${totalSpent}
        </h1>
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

            <button
              style={cancelBtn}
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Spend Logs */}
      <h3 style={{ marginTop: "25px" }}>Your Activity</h3>

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

            <div style={{ display: "flex", gap: "10px" }}>
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
                  setLogs(logs.filter((l) => l.id !== log.id));
                }}
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Followed Friends */}
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

export default Home;
