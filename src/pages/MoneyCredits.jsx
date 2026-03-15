import React, { useState } from "react";
import { supabase } from "../lib/supabase";

// Import photos from assets
import gcashImg from "../assets/gcash.png";
import cashImg from "../assets/cash.jpg";
import bdoImg from "../assets/bdo.jpg";
import eastwestImg from "../assets/eastwest.jpg";

const MoneyCredits = ({ balances, setBalances, userId }) => {
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState("");

  // Map database keys to UI labels, colors, and images
  const balanceConfig = {
    gcash: { 
      label: "GCash", 
      color: "rgba(30, 58, 138, 0.8)",
      img: gcashImg 
    },
    cash: { 
      label: "Cash", 
      color: "rgba(255, 255, 255, 0.8)", 
      textColor: "#000", 
      img: cashImg 
    },
    bdoSavings: { 
      label: "BDO Savings", 
      color: "rgba(96, 165, 250, 0.8)", 
      img: bdoImg 
    },
    bdoCredit: { 
      label: "BDO Credit", 
      color: "rgba(196, 181, 253, 0.8)", 
      textColor: "#000", 
      img: bdoImg 
    },
    eastwestCredit: { 
      label: "Eastwest Credit", 
      color: "rgba(214, 172, 4, 0.7)", 
      textColor: "#000", 
      img: eastwestImg 
    }
  };

  const updateBalance = async () => {
    if (!editing) return;
    const newBalances = { ...balances, [editing]: Number(value) };
    setBalances(newBalances);
    setEditing(null);
    setValue("");

    await supabase.from("balances").update({
      gcash: newBalances.gcash,
      cash: newBalances.cash,
      bdo_savings: newBalances.bdoSavings,
      bdo_credit: newBalances.bdoCredit,
      eastwest_credit: newBalances.eastwestCredit,
      updated_at: new Date()
    }).eq("user_id", userId);
  };

  const netTotal = (balances.gcash + balances.cash + balances.bdoSavings) - (balances.bdoCredit + balances.eastwestCredit);

  return (
    <div style={{ marginTop: 30 }}>
      <p style={{...sectionTitle, marginBottom: 10}}>My Money</p>
      <div style={grid}>
        {["gcash","cash","bdoSavings"].map(acc => (
          <div 
            key={acc} 
            style={{ 
                ...card, 
                backgroundImage: `linear-gradient(${balanceConfig[acc].color}, ${balanceConfig[acc].color}), url(${balanceConfig[acc].img})`,
                color: balanceConfig[acc].textColor || "#fff" 
            }} 
            onClick={() => { setEditing(acc); setValue(balances[acc]); }}
          >
            <p style={cardTitle}>{balanceConfig[acc].label}</p>
            <h3 style={{ margin: "5px 0" }}>₱{balances[acc]}</h3>
          </div>
        ))}
      </div>

      <p style={{ ...sectionTitle, marginTop: 20, marginBottom: 10 }}>Credit Balance</p>
      <div style={creditGrid}>
        {["bdoCredit","eastwestCredit"].map(acc => (
          <div 
            key={acc} 
            style={{ 
                ...card, 
                backgroundImage: `linear-gradient(${balanceConfig[acc].color}, ${balanceConfig[acc].color}), url(${balanceConfig[acc].img})`,
                color: balanceConfig[acc].textColor || "#000" 
            }} 
            onClick={() => { setEditing(acc); setValue(balances[acc]); }}
          >
            <p style={cardTitle}>{balanceConfig[acc].label}</p>
            <h3 style={{ margin: "5px 0" }}>₱{balances[acc]}</h3>
          </div>
        ))}
      </div>

      <div style={totalCard}>
        <p style={{ margin: 0 }}>Total Money</p>
        <h2 style={{ margin: "5px 0" }}>₱{netTotal}</h2>
      </div>

      {editing && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={{ marginTop: 0 }}>Edit {balanceConfig[editing].label}</h3>
            <input style={input} type="number" value={value} onChange={e => setValue(e.target.value)} />
            <button style={saveBtn} onClick={updateBalance}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Updated Styles --- */
const grid = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 };
const creditGrid = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 };
const card = { 
    padding: 12, 
    borderRadius: 12, 
    border: "1px solid #222", 
    cursor: "pointer",
    backgroundSize: "cover",
    backgroundPosition: "center",
    aspectRatio: "1/1", // Keeps cards square for the 3-column grid
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
};
const totalCard = { marginTop: 20, background: "#064e3b", padding: 18, borderRadius: 14, textAlign: "center", color:"#fff" };
const cardTitle = { fontSize: "0.7rem", opacity: 0.9, margin: 0, fontWeight: "bold" };
const sectionTitle = { fontSize: "0.8rem", opacity: 0.6 };
const overlay = { position: "fixed", top:0,left:0,right:0,bottom:0, background:"rgba(0,0,0,0.7)", display:"flex", justifyContent:"center", alignItems:"center", zIndex: 1000 };
const modal = { background:"#111", padding:24, borderRadius:16, width:"90%", maxWidth:300 };
const input = { width:"100%", padding:12, marginTop:10, marginBottom:15, background:"#000", border:"1px solid #333", color:"white", borderRadius:8, boxSizing:"border-box", outline:"none" };
const saveBtn = { background:"#10b981", border:"none", padding:12, width:"100%", borderRadius:8, color:"white", cursor:"pointer", fontWeight:"bold" };

export default MoneyCredits;