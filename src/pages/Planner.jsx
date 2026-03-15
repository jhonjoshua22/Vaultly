import React, { useState } from 'react';
import { Plus, Trash2, Grid, List, X } from 'lucide-react';

const Planner = () => {
  const [plans, setPlans] = useState([
    { id: 1, title: "Groceries", amount: 50, date: "2026-03-20", note: "Weekly shop" }
  ]);
  const [isGrid, setIsGrid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ title: '', amount: '', date: '', note: '' });

  const addPlan = () => {
    if (!formData.title || !formData.amount || !formData.date) return;
    setPlans([...plans, { id: Date.now(), ...formData }]);
    setFormData({ title: '', amount: '', date: '', note: '' });
    setShowModal(false);
  };

  const deletePlan = (id) => setPlans(plans.filter(p => p.id !== id));

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Planner</h2>
        <button onClick={() => setIsGrid(!isGrid)} style={iconBtnStyle}>
          {isGrid ? <List size={20} /> : <Grid size={20} />}
        </button>
      </div>

      <button onClick={() => setShowModal(true)} style={addBtnStyle}>
        <Plus size={20} /> Add New Plan
      </button>

      {/* Modal Popup */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3>New Plan</h3>
              <X onClick={() => setShowModal(false)} style={{ cursor: 'pointer' }} />
            </div>
            <input style={inputStyle} placeholder="Title" onChange={e => setFormData({...formData, title: e.target.value})} />
            <input style={inputStyle} type="number" placeholder="Amount" onChange={e => setFormData({...formData, amount: e.target.value})} />
            <input style={inputStyle} type="date" onChange={e => setFormData({...formData, date: e.target.value})} />
            <textarea style={{...inputStyle, height: '80px'}} placeholder="Notes/Paragraph" onChange={e => setFormData({...formData, note: e.target.value})} />
            <button onClick={addPlan} style={saveBtnStyle}>Save Plan</button>
          </div>
        </div>
      )}

      {/* Display List/Grid */}
      <div style={isGrid ? gridContainerStyle : { marginTop: '20px' }}>
        {plans.map(p => (
          <div key={p.id} style={isGrid ? gridItemStyle : listItemStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{p.title}</strong>
              <span style={{ color: '#10b981' }}>${p.amount}</span>
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6, margin: '5px 0' }}>{p.date}</div>
            <div style={{ fontSize: '0.9rem' }}>{p.note}</div>
            <button onClick={() => deletePlan(p.id)} style={deleteBtnStyle}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Styles */
const listItemStyle = { padding: '15px', background: '#111', borderRadius: '12px', marginBottom: '10px', border: '1px solid #222' };
const gridContainerStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' };
const gridItemStyle = { ...listItemStyle, marginBottom: '0' };
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 };
const modalStyle = { background: '#111', padding: '20px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid #333' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #333', background: '#000', color: '#fff', boxSizing: 'border-box' };
const addBtnStyle = { background: '#10b981', color: '#fff', padding: '12px 20px', borderRadius: '8px', border: 'none', width: '100%', cursor: 'pointer', fontWeight: 'bold' };
const saveBtnStyle = { ...addBtnStyle, marginTop: '10px' };
const deleteBtnStyle = { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginTop: '10px', padding: 0 };
const iconBtnStyle = { background: '#222', border: 'none', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer' };

export default Planner;