import React, { useState } from 'react';
import { Plus, Trash2, Bell, ChevronDown, ChevronUp } from 'lucide-react';

const Home = ({ userName }) => {
  const [spendAvail, setSpendAvail] = useState(150); // Example state
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  // Mock data for spending
  const [logs, setLogs] = useState([
    { id: 1, amount: 25, time: '10:30 AM', date: 'Mar 15, 2026', desc: 'Coffee & Breakfast' },
    { id: 2, amount: 15, time: '01:15 PM', date: 'Mar 15, 2026', desc: 'Stationary' }
  ]);
  
  const [expandedId, setExpandedId] = useState(null);

  const totalSpent = logs.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={pageStyle}>
      {/* Avatar & Greeting Section */}
      <div style={headerSectionStyle}>
        <div style={avatarWrapperStyle}>
          <div style={avatarStyle}></div>
        </div>
        <p style={greetingStyle}>
          Hi {userName}, it's {today} and {spendAvail > 0 
            ? `your remaining spend available is $${spendAvail}. Good luck spending!` 
            : "you have used all your available money for today!"}
        </p>
      </div>

      {/* Daily Total */}
      <div style={cardStyle}>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>Spent Today</p>
        <h1 style={{ margin: '5px 0', color: '#10b981' }}>${totalSpent}</h1>
      </div>

      {/* Spending Logs */}
      <h3 style={{ marginTop: '20px' }}>Daily Activity</h3>
      {logs.map(log => (
        <div key={log.id} style={logItemStyle} onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
          <div style={logHeaderStyle}>
            <span>{log.desc}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong>${log.amount}</strong>
              <small style={{ opacity: 0.5 }}>{log.time}</small>
              {expandedId === log.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
          {expandedId === log.id && (
            <div style={expandedDetailsStyle}>
              <p style={{ margin: '5px 0', fontSize: '0.85rem' }}>Date: {log.date}</p>
              <button style={deleteBtnStyle} onClick={(e) => { e.stopPropagation(); setLogs(logs.filter(l => l.id !== log.id)); }}>
                <Trash2 size={14} /> Remove
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Followed Accounts */}
      <h3 style={{ marginTop: '30px' }}>Followed Friends</h3>
      <div style={cardStyle}>
        <div style={friendStyle}>
          <span>Alex's Spend</span>
          <button style={notifyBtnStyle}><Bell size={16} /></button>
        </div>
      </div>
    </div>
  );
};

// Styles
const pageStyle = { padding: '20px', paddingBottom: '100px' };
const headerSectionStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' };
const avatarWrapperStyle = { animation: 'bounce 2s infinite' };
const avatarStyle = { width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(45deg, #10b981, #064e3b)' };
const greetingStyle = { fontSize: '0.9rem', lineHeight: '1.4', flex: 1 };
const cardStyle = { background: '#111', padding: '20px', borderRadius: '18px', border: '1px solid #222' };
const logItemStyle = { background: '#111', padding: '15px', borderRadius: '12px', border: '1px solid #222', marginBottom: '10px', cursor: 'pointer' };
const logHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const expandedDetailsStyle = { marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #333' };
const deleteBtnStyle = { background: '#7f1d1d', border: 'none', color: '#fecaca', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', marginTop: '5px' };
const friendStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const notifyBtnStyle = { background: '#222', border: 'none', color: '#10b981', padding: '8px', borderRadius: '8px', cursor: 'pointer' };

// Inject keyframe for bounce
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }`, styleSheet.cssRules.length);

export default Home;