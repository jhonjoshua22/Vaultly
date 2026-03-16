import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const bankOptions = ['bdo', 'eastwest', 'unionbank', 'bpi', 'metrobank', 'rcbc', 'gcash'];
const creditOptions = ['bdo', 'eastwest', 'unionbank', 'bpi', 'metrobank', 'rcbc'];

const Onboarding = ({ user, onComplete }) => {
  const [profile, setProfile] = useState({ first_name: '', last_name: '', age: '', daily_limit: 150 });
  const [savings, setSavings] = useState([]); // Array of { type, amount }
  const [cards, setCards] = useState([]);     // Array of { type, amount }

  const handleSubmit = async () => {
    try {
      // Map arrays back to the column structure required by your DB
      const formattedBalances = {
        user_id: user.id,
        ...savings.reduce((acc, curr) => ({ ...acc, [`${curr.type}_savings`]: curr.amount }), {}),
        ...cards.reduce((acc, curr) => ({ ...acc, [`${curr.type}_credit`]: curr.amount }), {})
      };

      await supabase.from('profiles').upsert({ id: user.id, ...profile });
      await supabase.from('balances').upsert(formattedBalances);
      onComplete();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={containerStyle}>
      <h2>Complete your details</h2>
      <input placeholder="First Name" onChange={e => setProfile({...profile, first_name: e.target.value})} style={inputStyle} />
      <input placeholder="Last Name" onChange={e => setProfile({...profile, last_name: e.target.value})} style={inputStyle} />
      
      <h3>Savings Accounts</h3>
      <AccountAdder options={bankOptions} onAdd={(t, a) => setSavings([...savings, { type: t, amount: a }])} />
      <ListDisplay items={savings} />

      <h3>Credit Cards</h3>
      <AccountAdder options={creditOptions} onAdd={(t, a) => setCards([...cards, { type: t, amount: a }])} />
      <ListDisplay items={cards} />

      <button onClick={handleSubmit} style={submitBtn}>Complete Onboarding</button>
    </div>
  );
};

// Component to Select and Add
const AccountAdder = ({ options, onAdd }) => {
  const [type, setType] = useState(options[0]);
  const [amount, setAmount] = useState('');

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <select onChange={e => setType(e.target.value)} style={inputStyle}>
        {options.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
      </select>
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} />
      <button onClick={() => { if(amount) { onAdd(type, amount); setAmount(''); } }} style={addBtn}>+ Add</button>
    </div>
  );
};

// Component to Display the added list
const ListDisplay = ({ items }) => (
  <ul style={{ listStyle: 'none', padding: 0 }}>
    {items.map((item, i) => (
      <li key={i} style={{ color: '#10b981', margin: '5px 0' }}>{item.type.toUpperCase()}: ₱{item.amount}</li>
    ))}
  </ul>
);
export default Onboarding;

// Styles
const containerStyle = { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', backgroundColor: '#000', color: '#fff' };
const inputStyle = { padding: '10px', margin: '5px', borderRadius: '6px', border: '1px solid #333', background: '#1a1a1a', color: '#fff' };
const submitBtn = { padding: '12px 24px', borderRadius: '8px', background: '#10b981', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' };
const addBtn = { padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' };