import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const bankOptions = ['bdo', 'eastwest', 'unionbank', 'bpi', 'metrobank', 'rcbc', 'gcash'];
const creditOptions = ['bdo', 'eastwest', 'unionbank', 'bpi', 'metrobank', 'rcbc'];

const Onboarding = ({ user, onComplete }) => {
  const [profile, setProfile] = useState({ 
    first_name: '', 
    last_name: '', 
    age: '', 
    daily_limit: 150 
  });
  
  const [savings, setSavings] = useState([]);
  const [cards, setCards] = useState([]);

  const handleSubmit = async () => {
    try {
      const formattedBalances = {
        user_id: user.id,
        ...savings.reduce((acc, curr) => ({ ...acc, [`${curr.type}_savings`]: curr.amount }), {}),
        ...cards.reduce((acc, curr) => ({ ...acc, [`${curr.type}_credit`]: curr.amount }), {})
      };

      await supabase.from('profiles').upsert({ id: user.id, ...profile });
      await supabase.from('balances').upsert(formattedBalances);
      onComplete();
    } catch (err) {
      console.error("Error saving onboarding data:", err);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Vaultly Header */}
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#10b981' }}>Vaultly</h1>
      </div>
      
      <h2 style={{ alignSelf: 'flex-start', margin: '0 0 20px 0' }}>Complete your details</h2>
      
      <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
        <input 
          placeholder="First Name" 
          value={profile.first_name}
          onChange={e => setProfile({...profile, first_name: e.target.value})} 
          style={{ ...inputStyle, flex: 1 }} 
        />
        <input 
          placeholder="Last Name" 
          value={profile.last_name}
          onChange={e => setProfile({...profile, last_name: e.target.value})} 
          style={{ ...inputStyle, flex: 1 }} 
        />
      </div>

      <input 
        type="number" 
        placeholder="Daily Limit" 
        value={profile.daily_limit}
        onChange={e => setProfile({...profile, daily_limit: e.target.value})} 
        style={inputStyle} 
      />
      
      <h3 style={{ marginTop: '20px' }}>Savings Accounts</h3>
      <AccountAdder 
        options={bankOptions} 
        onAdd={(t, a) => setSavings([...savings, { type: t, amount: a }])} 
      />
      <ListDisplay items={savings} />

      <h3 style={{ marginTop: '20px' }}>Credit Cards</h3>
      <AccountAdder 
        options={creditOptions} 
        onAdd={(t, a) => setCards([...cards, { type: t, amount: a }])} 
      />
      <ListDisplay items={cards} />

      <button onClick={handleSubmit} style={submitBtn}>Complete Onboarding</button>
    </div>
  );
};

const AccountAdder = ({ options, onAdd }) => {
  const [type, setType] = useState(options[0]);
  const [amount, setAmount] = useState('');

  return (
    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
      <select onChange={e => setType(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
        {options.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
      </select>
      <input 
        type="number" 
        placeholder="Amount" 
        value={amount} 
        onChange={e => setAmount(e.target.value)} 
        style={{ ...inputStyle, flex: 1, margin: 0 }} 
      />
      <button onClick={() => { if(amount) { onAdd(type, amount); setAmount(''); } }} style={addBtn}>Add</button>
    </div>
  );
};

const ListDisplay = ({ items }) => (
  <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px', width: '100%' }}>
    {items.map((item, i) => (
      <li key={i} style={{ color: '#10b981', margin: '5px 0' }}>
        {item.type.toUpperCase()}: ₱{item.amount}
      </li>
    ))}
  </ul>
);

// Styles
const containerStyle = { 
  minHeight: '100vh', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'flex-start', 
  padding: '2rem', 
  backgroundColor: '#000', 
  color: '#fff',
  maxWidth: '500px', 
  margin: '0 auto',
  boxSizing: 'border-box'
};

const headerStyle = {
  marginBottom: '2rem',
  borderBottom: '1px solid #222',
  width: '100%',
  paddingBottom: '1rem'
};

const inputStyle = { 
  padding: '12px', 
  margin: '5px 0', 
  borderRadius: '6px', 
  border: '1px solid #333', 
  background: '#1a1a1a', 
  color: '#fff',
  width: '100%',
  boxSizing: 'border-box' 
};

const selectStyle = { ...inputStyle, width: '100%' };

const submitBtn = { 
  padding: '12px 24px', 
  borderRadius: '8px', 
  background: '#10b981', 
  border: 'none', 
  fontWeight: 'bold', 
  cursor: 'pointer', 
  marginTop: '30px',
  width: '100%'
};

const addBtn = { 
  padding: '0 15px', 
  background: '#3b82f6', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '6px', 
  cursor: 'pointer' 
};

export default Onboarding;