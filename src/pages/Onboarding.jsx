import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Stepper, { Step } from '../components/Stepper';

const Onboarding = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    daily_limit: 150,
  });
  const [balances, setBalances] = useState({
    gcash: 0,
    cash: 0,
    bdo_savings: 0,
    bdo_credit: 0,
    eastwest_savings: 0,
    eastwest_credit: 0,
    unionbank_savings: 0,
    unionbank_credit: 0,
    metrobank_savings: 0,
    metrobank_credit: 0,
    rcbc_savings: 0,
    rcbc_credit: 0,
    bpi_savings: 0,
    bpi_credit: 0,
  });

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return navigate('/'); // Not logged in
      setSession(session);

      // Fetch profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      // If first_name exists, user has completed onboarding
      if (profileData.first_name) {
        navigate('/home');
      }
    };

    getSession();
  }, [navigate]);

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleBalanceChange = (field, value) => {
    setBalances(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const handleComplete = async () => {
    if (!session) return;

    // 1. Update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: session.user.id, ...profile });

    if (profileError) {
      console.error(profileError);
      return;
    }

    // 2. Insert into balances table
    const { error: balancesError } = await supabase
      .from('balances')
      .upsert({ user_id: session.user.id, ...balances });

    if (balancesError) {
      console.error(balancesError);
      return;
    }

    navigate('/home'); // Redirect to home after onboarding
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome! Let's set up your profile</h1>
      <Stepper
        initialStep={1}
        onFinalStepCompleted={handleComplete}
        backButtonText="Previous"
        nextButtonText="Next"
      >
        {/* Step 1: Name */}
        <Step>
          <h2>Your Name</h2>
          <input
            type="text"
            placeholder="First Name"
            value={profile.first_name}
            onChange={(e) => handleProfileChange('first_name', e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={profile.last_name}
            onChange={(e) => handleProfileChange('last_name', e.target.value)}
            style={inputStyle}
          />
        </Step>

        {/* Step 2: Daily Limit */}
        <Step>
          <h2>Daily Limit</h2>
          <input
            type="number"
            placeholder="Daily Limit"
            value={profile.daily_limit}
            onChange={(e) => handleProfileChange('daily_limit', e.target.value)}
            style={inputStyle}
          />
        </Step>

        {/* Step 3: Bank Savings */}
        <Step>
          <h2>Bank Savings</h2>
          <input
            type="number"
            placeholder="BDO Savings"
            value={balances.bdo_savings}
            onChange={(e) => handleBalanceChange('bdo_savings', e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Eastwest Savings"
            value={balances.eastwest_savings}
            onChange={(e) => handleBalanceChange('eastwest_savings', e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Unionbank Savings"
            value={balances.unionbank_savings}
            onChange={(e) => handleBalanceChange('unionbank_savings', e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Metrobank Savings"
            value={balances.metrobank_savings}
            onChange={(e) => handleBalanceChange('metrobank_savings', e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="RCBC Savings"
            value={balances.rcbc_savings}
            onChange={(e) => handleBalanceChange('rcbc_savings', e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="BPI Savings"
            value={balances.bpi_savings}
            onChange={(e) => handleBalanceChange('bpi_savings', e.target.value)}
            style={inputStyle}
          />
        </Step>

        {/* Step 4: Credit Cards */}
        <Step>
          <h2>Credit Cards</h2>
          <input
            type="number"
            placeholder="BDO Credit"
            value={balances.bdo_credit}
            onChange={(e) => handleBalanceChange('bdo_credit', e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Eastwest Credit"
            value={balances.eastwest_credit}
            onChange={(e) => handleBalanceChange('eastwest_credit', e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Unionbank Credit"
            value={balances.unionbank_credit}
            onChange={(e) => handleBalanceChange('unionbank_credit', e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Metrobank Credit"
            value={balances.metrobank_credit}
            onChange={(e) => handleBalanceChange('metrobank_credit', e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="RCBC Credit"
            value={balances.rcbc_credit}
            onChange={(e) => handleBalanceChange('rcbc_credit', e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="BPI Credit"
            value={balances.bpi_credit}
            onChange={(e) => handleBalanceChange('bpi_credit', e.target.value)}
            style={inputStyle}
          />
        </Step>

        {/* Step 5: Cash / GCash */}
        <Step>
          <h2>Cash & GCash</h2>
          <input
            type="number"
            placeholder="Cash"
            value={balances.cash}
            onChange={(e) => handleBalanceChange('cash', e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="GCash"
            value={balances.gcash}
            onChange={(e) => handleBalanceChange('gcash', e.target.value)}
            style={inputStyle}
          />
        </Step>

        {/* Final Step */}
        <Step>
          <h2>All Set!</h2>
          <p>Click Complete to finish onboarding and start using Vaultly.</p>
        </Step>
      </Stepper>
    </div>
  );
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '0.5rem',
  marginBottom: '1rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

export default Onboarding;