import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Planner = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data } = await supabase
      .from('plans')
      .select('*')
      .order('plan_date', { ascending: false });
    if (data) setPlans(data);
  };

  return (
    <div style={{ padding: '20px', color: '#fff', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Planner</h2>
        <button onClick={() => navigate('/planner/new')} style={addBtnStyle}>
          <Plus size={24} />
        </button>
      </div>
      
      {plans.map(p => (
        <div key={p.id} onClick={() => navigate(`/planner/${p.id}`)} style={listItemStyle}>
          <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{p.title || 'Untitled'}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '4px' }}>
            {p.plan_date} • ${p.amount || 0}
          </div>
        </div>
      ))}
    </div>
  );
};

const listItemStyle = { padding: '20px', background: '#1c1c1e', borderRadius: '16px', marginBottom: '12px', cursor: 'pointer' };
const addBtnStyle = { background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' };

export default Planner;