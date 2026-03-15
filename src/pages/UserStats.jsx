import React from "react";
import heroGif from "../assets/hero.gif"; // Import your GIF

const UserStats = ({ profile, remaining, totalSpent, filterDate }) => {
  return (
    <>
      <div style={headerSectionStyle}>
        {/* Replaced the div background with an img tag */}
        <img src={heroGif} alt="User Avatar" style={avatarStyle} />
        
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

const avatarStyle = { 
  width: "60px", 
  height: "60px", 
  borderRadius: "50%", 
  objectFit: "cover", // Ensures the GIF fills the circle nicely
  border: "2px solid #10b981" // Optional: adds a nice border to match your theme
};

const greetingStyle = { fontSize: "0.9rem", lineHeight: "1.4" };
const cardStyle = { background: "#111", padding: "20px", borderRadius: "18px", border: "1px solid #222" };

export default UserStats;