import React, { useState } from 'react';
import { Archive as ArchiveIcon, Plus, Trash2, Grid, List, FileText } from 'lucide-react';

const Planner = () => {
  const [plans, setPlans] = useState([
    { id: 1, text: "Groceries", date: "2026-03-20" },
    { id: 2, text: "Rent Payment", date: "2026-04-01" }
  ]);
  const [isGrid, setIsGrid] = useState(false);
  const [newPlan, setNewPlan] = useState("");
  const [newDate, setNewDate] = useState("");

  const addPlan = () => {
    if (!newPlan || !newDate) return;
    setPlans([...plans, { id: Date.now(), text: newPlan, date: newDate }]);
    setNewPlan(""); setNewDate("");
  };

  const deletePlan = (id) => setPlans(plans.filter(p => p.id !== id));

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Planner</h2>
        <button onClick={() => setIsGrid(!isGrid)} style={iconBtnStyle}>
          {isGrid ? <List size={20} /> : <Grid size={20} />}
        </button>
      </div>

      {/* Add Plan Section */}
      <div style={{ margin: '20px 0', display: 'flex', gap: '5px' }}>
        <input style={inputStyle} placeholder="Note" value={newPlan} onChange={e => setNewPlan(e.target.value)} />
        <input style={dateInputStyle} type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
        <button onClick={addPlan} style={addBtnStyle}><Plus size={20} /></button>
      </div>

      {/* Display Grid */}
      <div style={isGrid ? gridContainerStyle : {}}>
        {plans.map(p => (
          <div key={p.id} style={isGrid ? gridItemStyle : listItemStyle}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <FileText size={20} color="#10b981" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500' }}>{p.text}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{p.date}</div>
              </div>
              <button onClick={() => deletePlan(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444' }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Styles */
const listItemStyle = { padding: '15px', background: '#111', borderRadius: '12px', marginBottom: '10px', border: '1px solid #222' };
const gridContainerStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' };
const gridItemStyle = { ...listItemStyle, marginBottom: '0' };
const inputStyle = { flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #333', background: '#000', color: '#fff' };
const dateInputStyle = { ...inputStyle, flex: 'none', width: '120px' };
const addBtnStyle = { background: '#10b981', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', padding: '8px 12px' };
const iconBtnStyle = { background: '#222', border: 'none', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer' };

export default Planner;