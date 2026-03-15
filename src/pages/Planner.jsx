import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, Trash2, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Planner = () => {
  const [plans, setPlans] = useState([]);
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', plan_date: '', text: '' });

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    const { data } = await supabase.from('plans').select('*').order('plan_date', { ascending: false });
    if (data) setPlans(data);
  };

  const savePlan = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (editingId) {
      await supabase.from('plans').update(formData).eq('id', editingId);
    } else {
      await supabase.from('plans').insert([{ ...formData, user_id: user.id }]);
    }
    setView('list');
    fetchPlans();
  };

  const deletePlan = async () => {
    if (editingId) await supabase.from('plans').delete().eq('id', editingId);
    setView('list');
    fetchPlans();
  };

  if (view === 'editor') {
    return (
      <div style={{ padding: '20px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button onClick={() => setView('list')} style={navBtn}><ChevronLeft /> Back</button>
          {editingId && <button onClick={deletePlan} style={{...navBtn, color: '#ef4444'}}><Trash2 size={18}/></button>}
        </div>
        
        <input placeholder="Title" style={titleInput} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        <input type="number" placeholder="Amount" style={inputStyle} value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
        
        {/* Date Input with Calendar Icon for iOS visibility */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
          Date
          <input 
            type="date" 
            style={{ ...inputStyle, marginBottom: 0, border: 'none' }} 
            value={formData.plan_date} 
            onChange={e => setFormData({...formData, plan_date: e.target.value})} 
          />
        </div>

        <textarea placeholder="Details..." style={textAreaStyle} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} />
        <button onClick={savePlan} style={saveBtn}>Save Note</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Planner</h2>
        <button onClick={() => { setEditingId(null); setFormData({title: '', amount: '', plan_date: '', text: ''}); setView('editor'); }} style={addBtnStyle}>
          <Plus size={24} />
        </button>
      </div>
      {plans.map(p => (
        <div key={p.id} onClick={() => { setEditingId(p.id); setFormData(p); setView('editor'); }} style={listItemStyle}>
          <div style={{ fontWeight: '600', color: '#fff' }}>{p.title || 'Untitled'}</div>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>{p.plan_date} • ${p.amount || 0}</div>
        </div>
      ))}
    </div>
  );
};

/* Styles */
const listItemStyle = { padding: '20px', background: '#1c1c1e', borderRadius: '16px', marginBottom: '12px', cursor: 'pointer' };
const addBtnStyle = { background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' };
const navBtn = { background: 'none', border: 'none', color: '#10b981', display: 'flex', alignItems: 'center', cursor: 'pointer' };
const titleInput = { width: '100%', fontSize: '1.8rem', background: 'transparent', border: 'none', color: '#fff', marginBottom: '15px', outline: 'none' };
const inputStyle = { width: '100%', background: 'transparent', border: 'none', color: '#10b981', marginBottom: '15px', fontSize: '1rem', outline: 'none' };
const textAreaStyle = { width: '100%', height: '250px', background: 'transparent', border: 'none', color: '#ccc', fontSize: '1rem', resize: 'none', outline: 'none' };
const saveBtn = { width: '100%', padding: '15px', background: '#10b981', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', cursor: 'pointer' };

export default Planner;