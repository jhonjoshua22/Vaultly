import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const MoneyCredits = ({ balances, setBalances, userId }) => {
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState("");

  const updateBalance = async () => {
    if (!editing) return;

    const newBalances = { ...balances, [editing]: Number(value) };
    setBalances(newBalances);
    setEditing(null);
    setValue("");

    // Update DB
    await supabase.from("balances").update({
      gcash: newBalances.gcash,
      cash: newBalances.cash,
      bdo_savings: newBalances.bdoSavings,
      bdo_credit: newBalances.bdoCredit,
      eastwest_credit: newBalances.eastwestCredit,
      updated_at: new Date()
    }).eq("user_id", userId);
  };

  const moneyTotal = balances.gcash + balances.cash + balances.bdoSavings;
  const creditTotal = balances.bdoCredit + balances.eastwestCredit;
  const netTotal = moneyTotal - creditTotal;

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Money & Credits Balance</h3>
      <p style={sectionTitle}>My Money</p>
      <div style={grid}>
        {["gcash","cash","bdoSavings"].map(acc => (
          <div key={acc} style={card} onClick={() => { setEditing(acc); setValue(balances[acc]); }}>
            <p style={cardTitle}>{acc}</p>
            <h3>${balances[acc]}</h3>
          </div>
        ))}
      </div>

      <p style={{...sectionTitle, marginTop:20}}>Credit Balance</p>
      <div style={grid}>
        <div style={creditCard}><p style={cardTitle}>BDO Credit</p><h3>${balances.bdoCredit}</h3></div>
        <div style={creditCard}><p style={cardTitle}>Eastwest Credit</p><h3>${balances.eastwestCredit}</h3></div>
      </div>

      <div style={totalCard}>
        <p>Total Money</p>
        <h2>${netTotal}</h2>
        <small>(${moneyTotal} money - ${creditTotal} credit)</small>
      </div>

      {editing && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Edit {editing}</h3>
            <input style={input} type="number" value={value} onChange={e => setValue(e.target.value)}/>
            <button style={saveBtn} onClick={updateBalance}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Styles --- */
const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };
const card = { background:"#111", padding:15, borderRadius:12, border:"1px solid #222", cursor:"pointer" };
const creditCard = { background:"#1f2937", padding:15, borderRadius:12, border:"1px solid #374151" };
const totalCard = { marginTop:20, background:"#064e3b", padding:18, borderRadius:14, textAlign:"center" };
const cardTitle = { fontSize:"0.8rem", opacity:0.7 };
const sectionTitle = { fontSize:"0.8rem", opacity:0.6 };
const overlay = { position:"fixed", top:0,left:0,right:0,bottom:0, background:"rgba(0,0,0,0.7)", display:"flex", justifyContent:"center", alignItems:"center" };
const modal = { background:"#111", padding:20, borderRadius:16, width:300 };
const input = { width:"100%", padding:10, marginTop:10, marginBottom:15, background:"#000", border:"1px solid #333", color:"white", borderRadius:8 };
const saveBtn = { background:"#10b981", border:"none", padding:10, width:"100%", borderRadius:8, color:"white", cursor:"pointer" };

export default MoneyCredits;