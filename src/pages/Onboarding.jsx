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

  const [balances, setBalances] = useState({});
  const [creditCards, setCreditCards] = useState({});

  const handleSubmit = async () => {
    try {
      // Insert profile
      await supabase.from('profiles').upsert({
        id: user.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        daily_limit: profile.daily_limit
      });

      // Insert balances
      await supabase.from('balances').upsert({
        user_id: user.id,
        ...balances,
        ...creditCards
      });

      onComplete();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Complete your details</h2>

      <input
        type="text"
        placeholder="First Name"
        value={profile.first_name}
        onChange={e => setProfile({ ...profile, first_name: e.target.value })}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={profile.last_name}
        onChange={e => setProfile({ ...profile, last_name: e.target.value })}
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Age"
        value={profile.age}
        onChange={e => setProfile({ ...profile, age: e.target.value })}
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Daily Limit"
        value={profile.daily_limit}
        onChange={e => setProfile({ ...profile, daily_limit: e.target.value })}
        style={inputStyle}
      />

      <h3>Savings</h3>
      {bankOptions.map(bank => (
        <div key={bank} style={bankRowStyle}>
          <label>
            {bank.toUpperCase()}:
            <input
              type="number"
              value={balances[`${bank}_savings`] || ''}
              onChange={e =>
                setBalances({ ...balances, [`${bank}_savings`]: e.target.value })
              }
              style={inputStyle}
            />
          </label>
        </div>
      ))}

      <h3>Credit Cards</h3>
      {creditOptions.map(card => (
        <div key={card} style={bankRowStyle}>
          <label>
            {card.toUpperCase()}:
            <input
              type="number"
              value={creditCards[`${card}_credit`] || ''}
              onChange={e =>
                setCreditCards({ ...creditCards, [`${card}_credit`]: e.target.value })
              }
              style={inputStyle}
            />
          </label>
        </div>
      ))}

      <button onClick={handleSubmit} style={submitBtn}>Complete Onboarding</button>
    </div>
  );
};

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontFamily: 'sans-serif',
  padding: '2rem'
};

const inputStyle = {
  padding: '0.5rem',
  margin: '0.5rem 0',
  width: '200px',
  borderRadius: '6px',
  border: '1px solid #ccc'
};

const bankRowStyle = { marginBottom: '1rem' };

const submitBtn = {
  padding: '10px 20px',
  borderRadius: '8px',
  background: '#10b981',
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default Onboarding;