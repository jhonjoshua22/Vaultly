import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PlannerEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Ensure state matches DB columns: title, amount, plan_date, text
  const [data, setData] = useState({ title: '', amount: '', plan_date: new Date().toISOString().split('T')[0], text: '' });

  useEffect(() => {
    if (id) fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    const { data: fetchedData } = await supabase.from('plans').select('*').eq('id', id).single();
    if (fetchedData) setData(fetchedData);
  };

  const savePlan = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (id) {
      await supabase.from('plans').update(data).eq('id', id);
    } else {
      await supabase.from('plans').insert([{ ...data, user_id: user.id }]);
    }
    navigate('/planner');
  };

  const deletePlan = async () => {
    if (id) await supabase.from('plans').delete().eq('id', id);
    navigate('/planner');
  };

  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh', color: '#fff', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={() => navigate('/planner')} style={navBtn}><ChevronLeft /> Back</button>
        {id && <button onClick={deletePlan} style={{...navBtn, color: '#ef4444'}}><Trash2 size={18}/></button>}
      </div>
      
      <input placeholder="Title" style={titleInput} value={data.title} onChange={e => setData({...data, title: e.target.value})} />
      <input type="number" placeholder="Amount" style={inputStyle} value={data.amount} onChange={e => setData({...data, amount: e.target.value})} />
      <input type="date" style={inputStyle} value={data.plan_date} onChange={e => setData({...data, plan_date: e.target.value})} />
      <textarea placeholder="Details or notes..." style={textAreaStyle} value={data.text} onChange={e => setData({...data, text: e.target.value})} />
      
      <button onClick={savePlan} style={saveBtn}>Done</button>
    </div>
  );
};

const navBtn = { background: 'none', border: 'none', color: '#10b981', display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '1rem' };
const titleInput = { width: '100%', fontSize: '2rem', background: 'transparent', border: 'none', color: '#fff', marginBottom: '20px', fontWeight: 'bold' };
const inputStyle = { width: '100%', background: 'transparent', border: 'none', color: '#10b981', fontSize: '1.2rem', marginBottom: '15px' };
const textAreaStyle = { width: '100%', height: '300px', background: 'transparent', border: 'none', color: '#ccc', fontSize: '1.1rem', resize: 'none' };
const saveBtn = { width: '100%', padding: '15px', background: '#10b981', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' };

export default PlannerEditor;