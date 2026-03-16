import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Stepper, { Step } from '../components/Stepper';

const banks = ['bdo', 'eastwest', 'unionbank', 'bpi', 'metrobank', 'rcbc'];

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    age: '',
    daily_limit: 150,
    savings: {
      gcash: '',
      bdo: '', eastwest: '', unionbank: '', bpi: '', metrobank: '', rcbc: ''
    },
    credit_cards: {
      bdo: '', eastwest: '', unionbank: '', bpi: '', metrobank: '', rcbc: ''
    }
  });

  // helper to update nested state
  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };
  const handleNestedChange = (type, key, value) => {
    setProfile({
      ...profile,
      [type]: { ...profile[type], [key]: value }
    });
  };

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/'); // no session → back to login

      // check if profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        navigate('/home'); // already has profile → skip onboarding
      } else {
        setLoading(false);
      }
    };

    checkProfile();
  }, [navigate]);

  const handleSubmit = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return navigate('/');

    try {
      // insert profile
      await supabase.from('profiles').insert({
        id: session.user.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        daily_limit: profile.daily_limit
      });

      // insert balances
      await supabase.from('balances').insert({
        user_id: session.user.id,
        gcash: profile.savings.gcash || 0,
        bdo_savings: profile.savings.bdo || 0,
        eastwest_savings: profile.savings.eastwest || 0,
        unionbank_savings: profile.savings.unionbank || 0,
        bpi_savings: profile.savings.bpi || 0,
        metrobank_savings: profile.savings.metrobank || 0,
        rcbc_savings: profile.savings.rcbc || 0,
        bdo_credit: profile.credit_cards.bdo || 0,
        eastwest_credit: profile.credit_cards.eastwest || 0,
        unionbank_credit: profile.credit_cards.unionbank || 0,
        bpi_credit: profile.credit_cards.bpi || 0,
        metrobank_credit: profile.credit_cards.metrobank || 0,
        rcbc_credit: profile.credit_cards.rcbc || 0
      });

      navigate('/home');
    } catch (err) {
      console.error(err);
      alert('Failed to save onboarding info');
    }
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '20vh' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', color: '#fff' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Welcome! Let’s set up your account</h1>

      <Stepper
        initialStep={1}
        backButtonText="Previous"
        nextButtonText="Next"
        onFinalStepCompleted={handleSubmit}
      >
        <Step>
          <h2>Basic Info</h2>
          <input
            style={inputStyle}
            placeholder="First Name"
            value={profile.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Last Name"
            value={profile.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Age"
            type="number"
            value={profile.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Daily Limit"
            type="number"
            value={profile.daily_limit}
            onChange={(e) => handleInputChange('daily_limit', e.target.value)}
          />
        </Step>

        <Step>
          <h2>Savings</h2>
          <input
            style={inputStyle}
            placeholder="GCash"
            type="number"
            value={profile.savings.gcash}
            onChange={(e) => handleNestedChange('savings', 'gcash', e.target.value)}
          />
          {banks.map(bank => (
            <input
              key={bank}
              style={inputStyle}
              placeholder={`${bank.toUpperCase()} Savings`}
              type="number"
              value={profile.savings[bank]}
              onChange={(e) => handleNestedChange('savings', bank, e.target.value)}
            />
          ))}
        </Step>

        <Step>
          <h2>Credit Cards</h2>
          {banks.map(bank => (
            <input
              key={bank}
              style={inputStyle}
              placeholder={`${bank.toUpperCase()} Credit Card`}
              type="number"
              value={profile.credit_cards[bank]}
              onChange={(e) => handleNestedChange('credit_cards', bank, e.target.value)}
            />
          ))}
        </Step>

        <Step>
          <h2>Finish</h2>
          <p>Click “Complete” to save your info and start using the app!</p>
        </Step>
      </Stepper>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '0.5rem',
  border: '1px solid #555',
  backgroundColor: '#111',
  color: '#fff',
  fontSize: '1rem'
};