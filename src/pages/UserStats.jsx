import React from "react";
import heroGif from "../assets/hero.gif";

const UserStats = ({ profile, remaining, totalSpent, filterDate }) => {
  return (
    <>
      <div style={headerSectionStyle}>
        
        <p style={greetingStyle}>
          Hi <strong>{profile.first_name}</strong>, today you have ₱
          {remaining > 0 ? remaining : 0} remaining.
        </p>
        <img src={heroGif} alt="User Avatar" style={avatarStyle} />
      </div>

      <div style={cardStyle}>
        <h1 style={{ margin: "5px 0", color: "#10b981" }}>
          ₱{totalSpent}
        </h1>
      </div>
    </>
  );
};

const headerSectionStyle = { display: "flex", gap: "15px", marginBottom: "-10vh", alignItems: "center" };

const avatarStyle = { 
  width: "20vh", 
  height: "20vh", 
  borderRadius: "50%", 
  objectFit: "cover"
};

const greetingStyle = { fontSize: "0.9rem", lineHeight: "1.4" };
const cardStyle = { background: "#111", padding: "20px", borderRadius: "18px", border: "1px solid #222" };

export default UserStats;