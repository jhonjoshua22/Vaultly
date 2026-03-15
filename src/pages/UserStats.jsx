import React from "react";

const UserStats = ({ profile, remaining, totalSpent, filterDate }) => {
  return (
    <>
      <div style={headerSectionStyle}>
        <div style={avatarStyle}></div>
        <p style={greetingStyle}>
          Hi <strong>{profile.first_name}</strong>, today you have ₱
          {remaining > 0 ? remaining : 0} remaining.
        </p>
      </div>

      <div style={cardStyle}>
        <h1 style={{ margin: "5px 0", color: "#10b981" }}>
          ₱{totalSpent}
        </h1>
      </div>
    </>
  );
};

const headerSectionStyle = { display: "flex", gap: "15px", marginBottom: "25px", alignItems: "center" };
const avatarStyle = { width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(45deg,#10b981,#064e3b)" };
const greetingStyle = { fontSize: "0.9rem", lineHeight: "1.4" };
const cardStyle = { background: "#111", padding: "20px", borderRadius: "18px", border: "1px solid #222" };

export default UserStats;