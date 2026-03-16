import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Stepper, { Step } from '../components/Stepper';

const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    age: '',
    daily_limit: 150,
    // savings
    gcash: 0,
    cash: 0,
    bdo_savings: 0,
    unionbank_savings: 0,
    eastwest_savings: 0,
    metrobank_savings: 0,
    rcbc_savings: 0,
    bpi_savings: 0,
    // credit
    bdo_credit: 0,
    unionbank_credit: 0,
    eastwest_credit: 0,
    metrobank_credit: 0,
    rcbc_credit: 0,
    bpi_credit: 0
  });

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/');

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profiles && profiles.first_name) {
        navigate('/home'); // already filled profile, redirect home
      } else {
        setLoading(false);
      }
    };

    checkProfile();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Insert profile if not exists
    await supabase.from('profiles').upsert({
      id: session.user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      daily_limit: profile.daily_limit,
      age: profile.age
    });

    // Insert balances
    await supabase.from('balances').upsert({
      user_id: session.user.id,
      gcash: profile.gcash,
      cash: profile.cash,
      bdo_savings: profile.bdo_savings,
      unionbank_savings: profile.unionbank_savings,
      eastwest_savings: profile.eastwest_savings,
      metrobank_savings: profile.metrobank_savings,
      rcbc_savings: profile.rcbc_savings,
      bpi_savings: profile.bpi_savings,
      bdo_credit: profile.bdo_credit,
      unionbank_credit: profile.unionbank_credit,
      eastwest_credit: profile.eastwest_credit,
      metrobank_credit: profile.metrobank_credit,
      rcbc_credit: profile.rcbc_credit,
      bpi_credit: profile.bpi_credit
    });

    navigate('/home');
  };

  if (loading) return <div style={centerStyle}>Loading...</div>;

  return (
    <div style={{ ...centerStyle, padding: '1rem' }}>
      <h1>Welcome! Let's set up your account</h1>

      <Stepper
        initialStep={1}
        onFinalStepCompleted={handleSave}
        backButtonText="Previous"
        nextButtonText="Next"
      >
        <Step>
          <h2>Basic Info</h2>
          <input
            placeholder="First Name"
            value={profile.first_name}
            onChange={e => handleInputChange('first_name', e.target.value)}
          />
          <input
            placeholder="Last Name"
            value={profile.last_name}
            onChange={e => handleInputChange('last_name', e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            value={profile.age}
            onChange={e => handleInputChange('age', e.target.value)}
          />
          <input
            type="number"
            placeholder="Daily Limit"
            value={profile.daily_limit}
            onChange={e => handleInputChange('daily_limit', e.target.value)}
          />
        </Step>

        <Step>
          <h2>Savings Accounts</h2>
          {['gcash','cash','bdo_savings','unionbank_savings','eastwest_savings','metrobank_savings','rcbc_savings','bpi_savings'].map(key => (
            <input
              key={key}
              type="number"
              placeholder={key.replace('_', ' ')}
              value={profile[key]}
              onChange={e => handleInputChange(key, e.target.value)}
            />
          ))}
        </Step>

        <Step>
          <h2>Credit Accounts</h2>
          {['bdo_credit','unionbank_credit','eastwest_credit','metrobank_credit','rcbc_credit','bpi_credit'].map(key => (
            <input
              key={key}
              type="number"
              placeholder={key.replace('_', ' ')}
              value={profile[key]}
              onChange={e => handleInputChange(key, e.target.value)}
            />
          ))}
        </Step>

        <Step>
          <h2>Finish Setup</h2>
          <p>Click Complete to save your profile and start using the app!</p>
        </Step>
      </Stepper>
    </div>
  );
};

export default Onboarding;

/* Styles */
const centerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'sans-serif'
};