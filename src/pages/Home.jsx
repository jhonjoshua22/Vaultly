import React, { useState } from 'react';
import { Plus, Trash2, Bell, ChevronDown, ChevronUp, X } from 'lucide-react';

const Home = ({ userName }) => {
  const [spendAvail, setSpendAvail] = useState(150);
  const [showAddForm, setShowAddForm] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  // New entry states
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  const [logs, setLogs] = useState([
    { id: 1, amount: 25, time: '10:30 AM', date: 'Mar 15, 2026', desc: 'Coffee & Breakfast' }
  ]);
  
  const [expandedId, setExpandedId] = useState(null);

  const handleAddLog = () => {
    if (!amount || !desc) return;
    const now = new Date();
    const newLog = {
      id: Date.now(),
      amount: parseFloat(amount),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString(),
      desc: desc
    };
    setLogs([newLog, ...logs]);
    setSpendAvail(spendAvail - parseFloat(amount));
    setAmount('');
    setDesc('');
    setShowAddForm(false);
  };

  const totalSpent = logs.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerSectionStyle}>
        <div style={avatarWrapperStyle}><div style={avatarStyle}></div></div>
        <p style={greetingStyle}>
          Hi {userName}, it's {today} and {spendAvail > 0 
            ? `your remaining spend available is $${spendAvail}. Good luck spending!` 
            : "you have used all your available money for today!"}
        </p>
      </div>

      {/* Stats */}
      <div style={cardStyle}>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>Spent Today</p>
        <h1 style={{ margin: '5px 0', color: '#10b981' }}>${totalSpent}</h1>
      </div>

      {/* Add Button */}
      <button style={fabStyle} onClick={() => setShowAddForm(true)}><Plus size={24} /></button>

      {/* Add Form Overlay */}
      {showAddForm && (
        <div style={overlayStyle}>
          <div style={formCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <strong>Add Expense</strong>
              <X size={20} onClick={() => setShowAddForm(false)} style={{cursor:'pointer'}} />
            </div>
            <input type="number" placeholder="Amount ($)" style={inputStyle} value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input type="text" placeholder="Details (e.g. Lunch)" style={inputStyle} value={desc} onChange={(e) => setDesc(e.target.value)} />
            <button style={saveBtnStyle} onClick={handleAddLog}>Save Entry</button>
          </div>
        </div>
      )}

      {/* Logs */}
      <h3 style={{ marginTop: '20px' }}>Daily Activity</h3>
      {logs.map(log => (
        <div key={log.id} style={logItemStyle} onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
          <div style={logHeaderStyle}>
            <span>{log.desc}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong>${log.amount}</strong>
              <small style={{ opacity: 0.5 }}>{log.time}</small>
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
    </div>
  );
};

// New Styles
const fabStyle = { position: 'fixed', bottom: '100px', right: '20px', background: '#10b981', color: '#000', border: 'none', borderRadius: '50%', width: '55px', height: '55px', boxShadow: '0 4px 15px rgba(16,185,129,0.4)', cursor: 'pointer', zIndex: 10 };
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, padding: '20px' };
const formCardStyle = { background: '#111', padding: '20px', borderRadius: '18px', width: '100%', border: '1px solid #333' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #333', background: '#000', color: '#fff', boxSizing: 'border-box' };
const saveBtnStyle = { width: '100%', padding: '12px', background: '#10b981', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

// ... (previous styles remain the same)
const pageStyle = { padding: '20px', paddingBottom: '150px' };
const headerSectionStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' };
const avatarWrapperStyle = { animation: 'bounce 2s infinite' };
const avatarStyle = { width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(45deg, #10b981, #064e3b)' };
const greetingStyle = { fontSize: '0.9rem', lineHeight: '1.4', flex: 1 };
const cardStyle = { background: '#111', padding: '20px', borderRadius: '18px', border: '1px solid #222', marginBottom: '20px' };
const logItemStyle = { background: '#111', padding: '15px', borderRadius: '12px', border: '1px solid #222', marginBottom: '10px', cursor: 'pointer' };
const logHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const expandedDetailsStyle = { marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #333' };
const deleteBtnStyle = { background: '#7f1d1d', border: 'none', color: '#fecaca', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', marginTop: '5px' };

export default Home;