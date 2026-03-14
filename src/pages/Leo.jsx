import React, { useState } from "react";
import { Send, Brain, TrendingUp, Wallet, Lightbulb } from "lucide-react";

const Leo = () => {
  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([
    {
      role: "leo",
      text: "Hi! I can analyze your spending and help you budget smarter."
    }
  ]);

  // Fake AI replies until Gemini is connected
  const fakeResponses = [
    "Looks like most of your spending is on food today.",
    "You might save money by limiting coffee purchases.",
    "Your spending trend is slightly higher than yesterday.",
    "Try setting a daily spending limit to stay on track.",
    "Reducing delivery orders could save you around $100/month."
  ];

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };

    const aiMsg = {
      role: "leo",
      text: fakeResponses[Math.floor(Math.random() * fakeResponses.length)]
    };

    setChat([...chat, userMsg, aiMsg]);
    setMessage("");
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <h2 style={titleStyle}>Leo AI</h2>
      <p style={subtitleStyle}>Your AI budgeting assistant</p>

      {/* Insight Card */}
      <div style={cardStyle}>
        <div style={cardHeader}>
          <Brain size={20} color="#10b981" />
          <strong>Leo Insight</strong>
        </div>

        <p style={insightText}>
          You spent <strong>$40</strong> today. Most spending was on food.
          If this pattern continues, you may exceed your weekly budget.
        </p>
      </div>

      {/* Stats */}
      <div style={statsGrid}>
        <div style={statCard}>
          <Wallet size={18} color="#10b981" />
          <span>Today's Spend</span>
          <strong>$40</strong>
        </div>

        <div style={statCard}>
          <TrendingUp size={18} color="#10b981" />
          <span>Weekly Trend</span>
          <strong>+12%</strong>
        </div>
      </div>

      {/* Suggestions */}
      <div style={cardStyle}>
        <div style={cardHeader}>
          <Lightbulb size={18} color="#10b981" />
          <strong>Leo Suggestions</strong>
        </div>

        <ul style={suggestionList}>
          <li>Limit coffee purchases to 3 per week.</li>
          <li>Food spending peaks between 12PM–3PM.</li>
          <li>Reducing delivery could save ~$120/month.</li>
        </ul>
      </div>

      {/* Chat */}
      <div style={chatBox}>
        <div style={chatHeader}>Ask Leo</div>

        <div style={chatMessages}>
          {chat.map((msg, index) => (
            <div
              key={index}
              style={
                msg.role === "leo"
                  ? leoMessage
                  : userMessage
              }
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div style={chatInputWrapper}>
          <input
            style={chatInput}
            placeholder="Ask Leo about your spending..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button style={sendBtn} onClick={sendMessage}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* Styles */

const pageStyle = {
  padding: "20px",
  paddingBottom: "120px"
};

const titleStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold"
};

const subtitleStyle = {
  opacity: 0.6,
  fontSize: "0.9rem",
  marginBottom: "20px"
};

const cardStyle = {
  background: "#111",
  border: "1px solid #222",
  borderRadius: "16px",
  padding: "18px",
  marginBottom: "15px"
};

const cardHeader = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "10px"
};

const insightText = {
  fontSize: "0.9rem",
  lineHeight: "1.5"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginBottom: "15px"
};

const statCard = {
  background: "#111",
  border: "1px solid #222",
  borderRadius: "14px",
  padding: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  fontSize: "0.85rem"
};

const suggestionList = {
  paddingLeft: "18px",
  fontSize: "0.85rem",
  lineHeight: "1.6"
};

const chatBox = {
  background: "#111",
  border: "1px solid #222",
  borderRadius: "16px",
  overflow: "hidden"
};

const chatHeader = {
  padding: "12px 15px",
  borderBottom: "1px solid #222",
  fontWeight: "bold"
};

const chatMessages = {
  padding: "15px",
  minHeight: "120px",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const leoMessage = {
  background: "#10b98120",
  border: "1px solid #10b98140",
  padding: "10px",
  borderRadius: "10px",
  fontSize: "0.85rem",
  maxWidth: "80%"
};

const userMessage = {
  background: "#222",
  padding: "10px",
  borderRadius: "10px",
  fontSize: "0.85rem",
  alignSelf: "flex-end",
  maxWidth: "80%"
};

const chatInputWrapper = {
  display: "flex",
  borderTop: "1px solid #222"
};

const chatInput = {
  flex: 1,
  padding: "12px",
  background: "#000",
  border: "none",
  color: "#fff",
  outline: "none"
};

const sendBtn = {
  background: "#10b981",
  border: "none",
  padding: "12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

export default Leo;
