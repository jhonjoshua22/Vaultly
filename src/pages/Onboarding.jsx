// src/pages/Onboarding.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Stepper, { Step } from '../components/Stepper'; // adjust path

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    daily_limit: '150',
    // savings
    gcash: '0',
    bdo_savings: '0',
    eastwest_savings: '0',
    unionbank_savings: '0',
    metrobank_savings: '0',
    bpi_savings: '0',
    rcbc_savings: '0',
    // credit
    bdo_credit: '0',
    eastwest_credit: '0',
    unionbank_credit: '0',
    metrobank_credit: '0',
    bpi_credit: '0',
    rcbc_credit: '0',
  });

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, daily_limit')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      if (data && data.first_name) {
        // already onboarded → go home
        navigate('/home');
      } else {
        setProfile(session.user);
        setLoading(false);
      }
    };

    checkProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        daily_limit: Number(formData.daily_limit) || 150,
      }, { onConflict: 'id' });

    if (error) {
      alert('Error saving profile: ' + error.message);
      return;
    }

    // Optional: save balances in a separate table
    const { error: balError } = await supabase
      .from('balances')
      .upsert({
        user_id: profile.id,
        gcash: Number(formData.gcash) || 0,
        bdo_savings: Number(formData.bdo_savings) || 0,
        eastwest_savings: Number(formData.eastwest_savings) || 0,
        unionbank_savings: Number(formData.unionbank_savings) || 0,
        metrobank_savings: Number(formData.metrobank_savings) || 0,
        bpi_savings: Number(formData.bpi_savings) || 0,
        rcbc_savings: Number(formData.rcbc_savings) || 0,
        bdo_credit: Number(formData.bdo_credit) || 0,
        eastwest_credit: Number(formData.eastwest_credit) || 0,
        unionbank_credit: Number(formData.unionbank_credit) || 0,
        metrobank_credit: Number(formData.metrobank_credit) || 0,
        bpi_credit: Number(formData.bpi_credit) || 0,
        rcbc_credit: Number(formData.rcbc_credit) || 0,
      }, { onConflict: 'user_id' });

    if (balError) {
      console.warn('Balances save failed:', balError.message);
      // still continue – not critical for login
    }

    navigate('/home');
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Preparing your vault...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: '1rem' }}>
      <Stepper
        initialStep={1}
        onFinalStepCompleted={handleSubmit}
        backButtonText="Back"
        nextButtonText="Continue"
        // You can pass custom button props, styles, etc.
      >
        <Step>
          <h2>Welcome to Vaultly!</h2>
          <p>Let's set up your profile.</p>
        </Step>

        <Step>
          <h3>Personal Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
            <input
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="age"
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </Step>

        <Step>
          <h3>Daily Spending Limit</h3>
          <input
            name="daily_limit"
            type="number"
            placeholder="Daily limit (₱)"
            value={formData.daily_limit}
            onChange={handleChange}
            style={{ ...inputStyle, fontSize: '1.4rem', textAlign: 'center' }}
          />
          <p style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '1rem' }}>
            You can change this later in settings.
          </p>
        </Step>

        <Step>
          <h3>Current Balances (optional)</h3>
          <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
            You can always update these later.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label>GCash</label>
              <input name="gcash" type="number" step="0.01" value={formData.gcash} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label>BDO Savings</label>
              <input name="bdo_savings" type="number" step="0.01" value={formData.bdo_savings} onChange={handleChange} style={inputStyle} />
            </div>

            {/* Add the rest similarly – or make collapsible groups */}
          </div>

          {/* You can continue adding fields for other banks */}
        </Step>

        <Step>
          <h2>You're all set!</h2>
          <p>Tap "Complete" to start using Vaultly.</p>
        </Step>
      </Stepper>
    </div>
  );
}

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid #333',
  background: '#111',
  color: '#fff',
  fontSize: '1.1rem',
  width: '100%',
};