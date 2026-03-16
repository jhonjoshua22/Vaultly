import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Stepper, { Step } from './components/Stepper';

const bankOptions = ['bdo', 'eastwest', 'unionbank', 'bpi', 'metrobank', 'rcbc', 'gcash'];
const creditOptions = ['bdo', 'eastwest', 'unionbank', 'bpi', 'metrobank', 'rcbc'];

const Onboarding = ({ user, onComplete }) => {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    age: '',
    daily_limit: 150
  });

  const [savings, setSavings] = useState([]); // List of { type, amount }
  const [cards, setCards] = useState([]);     // List of { type, amount }

  const handleSubmit = async () => {
    try {
      // 1. Prepare Balances Object (Mapping array back to column names)
      const formattedBalances = {
        user_id: user.id,
        ...savings.reduce((acc, curr) => ({ ...acc, [`${curr.type}_savings`]: curr.amount }), {}),
        ...cards.reduce((acc, curr) => ({ ...acc, [`${curr.type}_credit`]: curr.amount }), {})
      };

      // 2. Insert/Upsert Profile
      await supabase.from('profiles').upsert({ id: user.id, ...profile });

      // 3. Insert/Upsert Balances
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
            <h2>Personal Info</h2>
            <input placeholder="First Name" onChange={e => setProfile({...profile, first_name: e.target.value})} style={inputStyle} />
            <input placeholder="Last Name" onChange={e => setProfile({...profile, last_name: e.target.value})} style={inputStyle} />
            <input type="number" placeholder="Age" onChange={e => setProfile({...profile, age: e.target.value})} style={inputStyle} />
            <input type="number" placeholder="Daily Limit" onChange={e => setProfile({...profile, daily_limit: e.target.value})} style={inputStyle} />
          </Step>

          {/* Step 2: Savings */}
          <Step>
            <h2>Savings Accounts</h2>
            <AccountAdder options={bankOptions} onAdd={(t, a) => setSavings([...savings, { type: t, amount: a }])} />
            <ListDisplay items={savings} />
          </Step>

          {/* Step 3: Credit Cards */}
          <Step>
            <h2>Credit Cards</h2>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
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
      <li key={i} style={{ color: '#10b981', margin: '5px 0' }}>{item.type.toUpperCase()}: ₱{item.amount}</li>
    ))}
  </ul>
);

// Styles
const containerStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backgroundColor: '#000' };
const formWrapperStyle = { width: '100%', maxWidth: '400px' };
const inputStyle = { display: 'block', width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: '#fff' };
const addBtnStyle = { padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' };

export default Onboarding;