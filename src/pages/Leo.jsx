import React, { useState } from "react";
import { Send, Brain, TrendingUp, Wallet, Lightbulb } from "lucide-react";

const Leo = () => {
  const [message, setMessage] = useState("");

  return (
    <div style={pageStyle}>
      
      {/* Header */}
      <h2 style={titleStyle}>Leo AI</h2>
      <p style={subtitleStyle}>
        Your AI budgeting assistant
      </p>

      {/* AI Insight Card */}
      <div style={cardStyle}>
        <div style={cardHeader}>
          <Brain size={20} color="#10b981" />
          <strong>Leo Insight</strong>
        </div>

        <p style={insightText}>
          You spent <strong>$40</strong> today. Most of your spending was on
          food. If this pattern continues, you may exceed your weekly
          budget by <strong>$60</strong>.
        </p>
      </div>

      {/* Budget Stats */}
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

      {/* AI Suggestions */}
      <div style={cardStyle}>
        <div style={cardHeader}>
          <Lightbulb size={18} color="#10b981" />
          <strong>Leo Suggestions</strong>
        </div>

        <ul style={suggestionList}>
          <li>Try limiting coffee purchases to 3 per week.</li>
          <li>You spend most on food between 12PM–3PM.</li>
          <li>Reducing food delivery could save ~$120/month.</li>
        </ul>
      </div>

      {/* Chat Section */}
      <div style={chatBox}>
        <div style={chatHeader}>Ask Leo</div>

        <div style={chatMessages}>
          <div style={leoMessage}>
            Hi! I can analyze your spending and help you budget smarter.
          </div>
        </div>

        <div style={chatInputWrapper}>
          <input
            style={chatInput}
            placeholder="Ask Leo about your spending..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button style={sendBtn}>
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
  minHeight: "100px"
};

const leoMessage = {
  background: "#10b98120",
  border: "1px solid #10b98140",
  padding: "10px",
  borderRadius: "10px",
  fontSize: "0.85rem",
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
