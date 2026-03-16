import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Stepper, { Step } from './Stepper';

const bankOptions = ['bdo', 'eastwest', 'unionbank', 'bpi', 'metrobank', 'rcbc', 'gcash'];

const Onboarding = ({ user, onComplete }) => {
  const [profile, setProfile] = useState({ first_name: '', last_name: '', daily_limit: 150 });
  const [savings, setSavings] = useState([]); // List of { type, amount }
  
  // Helper to add a new account to the list
  const addAccount = (type, amount) => {
    setSavings([...savings, { type, amount }]);
  };

  const handleSubmit = async () => {
    // Transform array to object format for your table
    const formattedBalances = savings.reduce((acc, curr) => {
      acc[`${curr.type}_savings`] = curr.amount;
      return acc;
    }, {});

    await supabase.from('profiles').upsert({ id: user.id, ...profile });
    await supabase.from('balances').upsert({ user_id: user.id, ...formattedBalances });
    onComplete();
  };

  return (
    <Stepper onFinalStepCompleted={handleSubmit}>
      <Step>
        <h2>Personal Info</h2>
        <input placeholder="First Name" onChange={e => setProfile({...profile, first_name: e.target.value})} style={inputStyle} />
      </Step>

      <Step>
        <h2>Add Savings</h2>
        <AccountAdder options={bankOptions} onAdd={addAccount} />
        <ul>
          {savings.map((s, i) => <li key={i}>{s.type.toUpperCase()}: {s.amount}</li>)}
        </ul>
      </Step>
    </Stepper>
  );
};

// Component to handle selecting from dropdown and clicking +Add
const AccountAdder = ({ options, onAdd }) => {
  const [type, setType] = useState(options[0]);
  const [amount, setAmount] = useState('');

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <select onChange={e => setType(e.target.value)} style={inputStyle}>
        {options.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
      </select>
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} />
      <button onClick={() => { onAdd(type, amount); setAmount(''); }}>+ Add</button>
    </div>
  );
};

const inputStyle = { padding: '8px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' };
export default Onboarding;