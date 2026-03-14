import React, { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { supabase } from "../lib/supabase"; 

const Home = ({ profile = { name: "User", dailyLimit: 150 } }) => {
  const [logs, setLogs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Error fetching:", error);
    else setLogs(data || []);
  };

  const addSpend = async () => {
    if (!amount || !desc) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("You must be logged in to save!");
        return;
    }

    const { data, error } = await supabase
        .from('expenses')
        .insert([{ 
          amount: Number(amount), 
          description: desc,
          user_id: user.id
        }])
        .select();

    if (error) {
        console.error("Supabase Error:", error);
        alert("Failed to save: " + error.message);
    } else {
        // Refresh the list to ensure we get the created_at from the DB
        fetchLogs(); 
        setAmount(""); setDesc(""); setShowAdd(false);
    }
  };

  const deleteLog = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) setLogs(logs.filter((l) => l.id !== id));
  };

  const totalSpent = logs.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const remaining = profile.dailyLimit - totalSpent;

  return (
    <div style={pageStyle}>
      <div style={headerSectionStyle}>
        <div style={avatarStyle}></div>
        <p style={greetingStyle}>
          Hi <strong>{profile.name}</strong>, today you have ${remaining > 0 ? remaining : 0} remaining.
        </p>
      </div>

      <div style={cardStyle}>
        <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>Spent Today</p>
        <h1 style={{ margin: "5px 0", color: remaining < 0 ? "#ef4444" : "#10b981" }}>
          ${totalSpent}
        </h1>
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
      {logs.map((log) => (
        <div key={log.id} style={logItemStyle} onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
          <div style={logHeaderStyle}>
            <span>{log.description}</span>
            <strong>${log.amount}</strong>
          </div>
          
          {/* Date display added here */}
          <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '5px' }}>
            {log.created_at ? new Date(log.created_at).toLocaleString() : 'Just now'}
          </div>

          {expandedId === log.id && (
            <div style={expandedDetailsStyle}>
              <button style={deleteBtnStyle} onClick={(e) => { e.stopPropagation(); deleteLog(log.id); }}>
                <Trash2 size={14} /> Remove
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* --- Styles --- */
const pageStyle = { padding: "20px", maxWidth: "600px", margin: "auto" };
const headerSectionStyle = { display: "flex", gap: "15px", marginBottom: "25px", alignItems: "center" };
const avatarStyle = { width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(45deg,#10b981,#064e3b)" };
const greetingStyle = { fontSize: "0.9rem", lineHeight: "1.4" };
const cardStyle = { background: "#111", padding: "20px", borderRadius: "18px", border: "1px solid #222" };
const logItemStyle = { background: "#111", padding: "15px", borderRadius: "12px", border: "1px solid #222", marginBottom: "10px", cursor: "pointer" };
const logHeaderStyle = { display: "flex", justifyContent: "space-between" };
const expandedDetailsStyle = { marginTop: "10px", borderTop: "1px solid #333", paddingTop: "10px" };
const deleteBtnStyle = { background: "#7f1d1d", border: "none", color: "#fecaca", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" };
const addBtn = { marginTop: "20px", background: "#10b981", border: "none", color: "white", padding: "12px 20px", borderRadius: "12px", width: "100%", fontWeight: "bold", cursor: "pointer" };
const overlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 1000 };
const modal = { background: "#111", border: "1px solid #333", padding: "24px", borderRadius: "20px", width: "100%", maxWidth: "400px" };
const input = { width: "100%", boxSizing: "border-box", marginBottom: "15px", padding: "12px", borderRadius: "10px", border: "1px solid #333", background: "#000", color: "white" };
const saveBtn = { background: "#10b981", border: "none", padding: "12px", borderRadius: "10px", color: "white", width: "100%", fontWeight: "bold", cursor: "pointer" };

export default Home;