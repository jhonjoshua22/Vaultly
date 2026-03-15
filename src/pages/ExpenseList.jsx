import React from "react";
import { Trash2, Calendar } from "lucide-react";

const ExpenseList = ({ 
  logs, 
  expandedId, 
  setExpandedId, 
  deleteLog, 
  filterDate, 
  setFilterDate, 
  fetchLogs 
}) => {
  return (
    <>
      <h3 style={{ marginTop: "5vh" }}>Activity</h3>

      {/* Calendar Filter UI */}
      <div style={{ marginTop: "25px", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
        <input 
          type="date" 
          value={filterDate} 
          onChange={(e) => {
            setFilterDate(e.target.value);
            fetchLogs(e.target.value);
          }} 
          style={dateInputStyle}
        />
      </div>

      {logs.map((log) => (
        <div 
          key={log.id} 
          style={logItemStyle} 
          onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
        >
          <div style={logHeaderStyle}>
            <span>{log.description}</span>
            <strong>₱{log.amount}</strong>
          </div>
          
          <div style={timeStyle}>
            {new Date(log.created_at).toLocaleString("en-PH", { 
              timeZone: "Asia/Manila" 
            })}
          </div>

          {expandedId === log.id && (
            <div style={expandedDetailsStyle}>
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
    </>
  );
};

/* --- Styles --- */
const dateInputStyle = { 
  background: "#111", 
  border: "1px solid #333", 
  color: "white", 
  padding: "8px", 
  borderRadius: "8px", 
  cursor: "pointer", 
  fontSize: "0.9rem" 
};
const logItemStyle = { 
  background: "#111", 
  padding: "15px", 
  borderRadius: "12px", 
  border: "1px solid #222", 
  marginBottom: "10px", 
  cursor: "pointer" 
};
const logHeaderStyle = { 
  display: "flex", 
  justifyContent: "space-between" 
};
const timeStyle = { 
  fontSize: '0.7rem', 
  opacity: 0.5, 
  marginTop: '5px' 
};
const expandedDetailsStyle = { 
  marginTop: "10px", 
  borderTop: "1px solid #333", 
  paddingTop: "10px" 
};
const deleteBtnStyle = { 
  background: "#7f1d1d", 
  border: "none", 
  color: "#fecaca", 
  padding: "6px 10px", 
  borderRadius: "6px", 
  cursor: "pointer" 
};

export default ExpenseList;