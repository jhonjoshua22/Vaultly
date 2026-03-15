import React, { useState } from "react";
import { Trash2 } from "lucide-react";

const ExpenseList = ({ logs, onDelete }) => {
  const [expandedId, setExpandedId] = useState(null);
  return (
    <>
      <h3 style={{ marginTop: "20px" }}>Activity</h3>
      {logs.map((log) => (
        <div key={log.id} style={logItemStyle} onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
          <div style={logHeaderStyle}><span>{log.description}</span><strong>${log.amount}</strong></div>
          <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '5px' }}>{new Date(log.created_at).toLocaleString()}</div>
          {expandedId === log.id && (
            <div style={expandedDetailsStyle}>
              <button style={deleteBtnStyle} onClick={(e) => { e.stopPropagation(); onDelete(log.id); }}><Trash2 size={14} /> Remove</button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};