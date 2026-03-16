import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Stepper, { Step } from '../components/Stepper';

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
      <div style={formWrapperStyle}>
        <Stepper onFinalStepCompleted={handleSubmit}>
          {/* Step 1: Profile */}
          <Step>
            <h2 style={titleStyle}>Personal Info</h2>
            <input placeholder="First Name" onChange={e => setProfile({...profile, first_name: e.target.value})} style={inputStyle} />
            <input placeholder="Last Name" onChange={e => setProfile({...profile, last_name: e.target.value})} style={inputStyle} />
            <input type="number" placeholder="Age" onChange={e => setProfile({...profile, age: e.target.value})} style={inputStyle} />
            <input type="number" placeholder="Daily Limit" onChange={e => setProfile({...profile, daily_limit: e.target.value})} style={inputStyle} />
          </Step>

          {/* Step 2: Savings */}
          <Step>
            <h2 style={titleStyle}>Savings Accounts</h2>
            <AccountAdder options={bankOptions} onAdd={(t, a) => setSavings([...savings, { type: t, amount: a }])} />
            <ListDisplay items={savings} />
          </Step>

          {/* Step 3: Credit Cards */}
          <Step>
            <h2 style={titleStyle}>Credit Cards</h2>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
      <select onChange={e => setType(e.target.value)} style={inputStyle}>
        {options.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
      </select>
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} />
      <button onClick={() => { if(amount) { onAdd(type, amount); setAmount(''); }}} style={addBtnStyle}>+ Add</button>
    </div>
  );
};

const ListDisplay = ({ items }) => (
  <ul style={{ listStyle: 'none', padding: 0 }}>
    {items.map((item, i) => (
      <li key={i} style={{ color: '#10b981', margin: '6px 0', fontWeight: '500' }}>
        {item.type.toUpperCase()}: ₱{item.amount}
      </li>
    ))}
  </ul>
);

// Styles
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#f0fdf4' // soft green background
};

const formWrapperStyle = {
  width: '100%',
  maxWidth: '500px',
  padding: '30px',
  borderRadius: '16px',
  backgroundColor: '#065f46', // dark green box
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
};

const titleStyle = {
  color: '#d1fae5',
  marginBottom: '20px',
  textAlign: 'center'
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '14px',
  margin: '10px 0',
  borderRadius: '10px',
  border: '1px solid #10b981',
  backgroundColor: '#064e3b',
  color: '#d1fae5',
  fontSize: '16px'
};

const addBtnStyle = {
  padding: '12px',
  backgroundColor: '#10b981',
  color: '#064e3b',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '16px'
};

export default Onboarding;