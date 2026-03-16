import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Stepper, { Step } from '../components/Stepper';

const bankOptions = ['bdo', 'eastwest', 'unionbank', 'bpi', 'metrobank', 'rcbc', 'gcash'];
const creditOptions = ['bdo', 'eastwest', 'unionbank', 'bpi', 'metrobank', 'rcbc'];

const Onboarding = ({ user, onComplete }) => {
  const [profile, setProfile] = useState({ first_name: '', last_name: '', age: '', daily_limit: 150 });
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
    } catch (err) { console.error("Error saving:", err); }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <Stepper onFinalStepCompleted={handleSubmit} nextButtonText="Continue">
          <Step>
            <h2 style={headingStyle}>Personal Info</h2>
            <input placeholder="First Name" onChange={e => setProfile({...profile, first_name: e.target.value})} style={inputStyle} />
            <input placeholder="Last Name" onChange={e => setProfile({...profile, last_name: e.target.value})} style={inputStyle} />
            <input type="number" placeholder="Age" onChange={e => setProfile({...profile, age: e.target.value})} style={inputStyle} />
            <input type="number" placeholder="Daily Limit" onChange={e => setProfile({...profile, daily_limit: e.target.value})} style={inputStyle} />
          </Step>

          <Step>
            <h2 style={headingStyle}>Savings</h2>
            <AccountAdder options={bankOptions} onAdd={(t, a) => setSavings([...savings, { type: t, amount: a }])} />
            <ListDisplay items={savings} />
          </Step>

          <Step>
            <h2 style={headingStyle}>Credit Cards</h2>
            <AccountAdder options={creditOptions} onAdd={(t, a) => setCards([...cards, { type: t, amount: a }])} />
            <ListDisplay items={cards} />
          </Step>
        </Stepper>
      </div>
    </div>
  );
};

const AccountAdder = ({ options, onAdd }) => {
  const [type, setType] = useState(options[0]);
  const [amount, setAmount] = useState('');
  return (
    <div style={adderWrapperStyle}>
      <select value={type} onChange={e => setType(e.target.value)} style={selectStyle}>
        {options.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
      </select>
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} />
      <button onClick={() => { if(amount) { onAdd(type, amount); setAmount(''); } }} style={addBtnStyle}>+ Add</button>
    </div>
  );
};

const ListDisplay = ({ items }) => (
  <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
    {items.map((item, i) => (
      <li key={i} style={{ color: '#10B981', padding: '10px', borderBottom: '1px solid #222', textAlign: 'center' }}>
        {item.type.toUpperCase()}: ₱{item.amount}
      </li>
    ))}
  </ul>
);

// ===== Styles synced with Home.jsx =====
const containerStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A', padding: '20px' };
const cardStyle = { width: '100%', maxWidth: '420px', backgroundColor: '#121212', borderRadius: '16px', padding: '30px 20px', boxShadow: '0 12px 24px rgba(0,0,0,0.6)' };
const headingStyle = { color: '#fff', fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' };
const inputStyle = { width: '100%', padding: '14px', margin: '8px 0', borderRadius: '12px', border: '1px solid #333', background: '#1f1f1f', color: '#fff', textAlign: 'center', fontSize: '1rem', boxSizing: 'border-box' };
const selectStyle = { ...inputStyle, textAlignLast: 'center' };
const adderWrapperStyle = { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' };
const addBtnStyle = { padding: '12px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', width: '100%' };

export default Onboarding;