import React, { useState } from 'react';
import { Plus, Trash2, Grid, List, ChevronLeft, Save } from 'lucide-react';

const Planner = () => {
  const [plans, setPlans] = useState([{ id: 1, title: "Groceries", amount: 50, date: "2026-03-20", note: "Weekly shop" }]);
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', date: '', note: '' });

  const savePlan = () => {
    if (!formData.title) return;
    setPlans([...plans, { id: Date.now(), ...formData }]);
    setView('list');
    setFormData({ title: '', amount: '', date: '', note: '' });
  };

  const openNote = (plan) => {
    setCurrentPlan(plan);
    setView('editor');
  };

  return (
    <div style={{ color: '#fff', minHeight: '100vh', background: '#000' }}>
      {view === 'list' ? (
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.8rem' }}>Plans</h2>
            <button onClick={() => { setCurrentPlan(null); setView('editor'); }} style={addBtnStyle}><Plus size={20} /></button>
          </div>
          {plans.map(p => (
            <div key={p.id} onClick={() => openNote(p)} style={listItemStyle}>
              <strong>{p.title}</strong>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{p.date} - ${p.amount}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button onClick={() => setView('list')} style={navBtnStyle}><ChevronLeft /> Back</button>
            <button onClick={savePlan} style={navBtnStyle}><Save size={18} /></button>
          </div>
          <input placeholder="Title" style={titleInput} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input type="number" placeholder="Amount" style={inputStyle} value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
          <input type="date" style={inputStyle} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          <textarea placeholder="Details..." style={textAreaStyle} value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
        </div>
      )}
    </div>
  );
};

/* Styles */
const listItemStyle = { padding: '20px', background: '#1c1c1e', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer' };
const titleInput = { width: '100%', fontSize: '1.5rem', background: 'transparent', border: 'none', color: '#fff', marginBottom: '10px', fontWeight: 'bold' };
const inputStyle = { width: '100%', background: 'transparent', border: 'none', color: '#10b981', marginBottom: '10px', fontSize: '1rem' };
const textAreaStyle = { width: '100%', height: '300px', background: 'transparent', border: 'none', color: '#ccc', fontSize: '1rem', resize: 'none' };
const navBtnStyle = { background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const addBtnStyle = { background: '#2c2c2e', border: 'none', color: '#10b981', padding: '8px', borderRadius: '50%', cursor: 'pointer' };

export default Planner;