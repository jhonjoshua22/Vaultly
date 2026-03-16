import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Stepper, { Step } from '../components/Stepper';
import { User, Wallet, Landmark, CreditCard, Target, CheckCircle2 } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    daily_limit: 150,
    cash: 0,
    gcash: 0,
    savings: {},
    credit_cards: {}
  });

  const savingsBanks = [
    { id: 'bdo_savings', label: 'BDO', color: '#0033a0' },
    { id: 'bpi_savings', label: 'BPI', color: '#d11242' },
    { id: 'unionbank_savings', label: 'UBP', color: '#ff6600' },
    { id: 'metrobank_savings', label: 'MBTC', color: '#004a99' },
    { id: 'eastwest_savings', label: 'EWB', color: '#6a2c91' },
    { id: 'rcbc_savings', label: 'RCBC', color: '#006a4e' }
  ];

  const creditBanks = [
    { id: 'bdo_credit', label: 'BDO', color: '#0033a0' },
    { id: 'bpi_credit', label: 'BPI', color: '#d11242' },
    { id: 'unionbank_credit', label: 'UBP', color: '#ff6600' },
    { id: 'metrobank_credit', label: 'MBTC', color: '#004a99' },
    { id: 'eastwest_credit', label: 'EWB', color: '#6a2c91' },
    { id: 'rcbc_credit', label: 'RCBC', color: '#006a4e' }
  ];

  const handleBalanceChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleNestedBalanceChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: parseFloat(value) || 0 }
    }));
  };

  const handleFinalSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          age: parseInt(formData.age),
          daily_limit: formData.daily_limit,
          username: user.email
        }
      ]);
      if (profileError) throw profileError;

      const { error: balanceError } = await supabase.from('balances').insert([
        {
          user_id: user.id,
          cash: formData.cash,
          gcash: formData.gcash,
          ...formData.savings,
          ...formData.credit_cards
        }
      ]);
      if (balanceError) throw balanceError;

      onComplete();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <Stepper
        initialStep={1}
        onFinalStepCompleted={handleFinalSubmit}
        nextButtonText="Continue"
        backButtonText="Back"
      >
        {/* Step 1: Personal */}
        <Step>
          <div style={headerIconStyle}><User size={32} color="#10b981" /></div>
          <h2 style={titleStyle}>Personal Details</h2>
          <input style={inputStyle} placeholder="First Name" onChange={e => setFormData({...formData, first_name: e.target.value})} />
          <input style={inputStyle} placeholder="Last Name" onChange={e => setFormData({...formData, last_name: e.target.value})} />
          <input style={inputStyle} type="number" placeholder="Age" onChange={e => setFormData({...formData, age: e.target.value})} />
        </Step>

        {/* Step 2: Cash */}
        <Step>
          <div style={headerIconStyle}><Wallet size={32} color="#10b981" /></div>
          <h2 style={titleStyle}>On-hand Cash</h2>
          <div style={rowInput}>
            <span style={currencyLabel}>₱</span>
            <input style={cleanInput} type="number" placeholder="Physical Cash" onChange={e => handleBalanceChange('cash', e.target.value)} />
          </div>
          <div style={rowInput}>
            <span style={currencyLabel}>₱</span>
            <input style={cleanInput} type="number" placeholder="GCash Balance" onChange={e => handleBalanceChange('gcash', e.target.value)} />
          </div>
        </Step>

        {/* Step 3: Savings */}
        <Step>
          <div style={headerIconStyle}><Landmark size={32} color="#10b981" /></div>
          <h2 style={titleStyle}>Savings Accounts</h2>
          <div style={scrollArea}>
            {savingsBanks.map(bank => (
              <div key={bank.id} style={bankRow}>
                <div style={{...bankBadge, backgroundColor: bank.color}}>{bank.label}</div>
                <input style={smallInput} type="number" placeholder="Balance" onChange={e => handleNestedBalanceChange('savings', bank.id, e.target.value)} />
              </div>
            ))}
          </div>
        </Step>

        {/* Step 4: Credit */}
        <Step>
          <div style={headerIconStyle}><CreditCard size={32} color="#10b981" /></div>
          <h2 style={titleStyle}>Credit Limits</h2>
          <div style={scrollArea}>
            {creditBanks.map(bank => (
              <div key={bank.id} style={bankRow}>
                <div style={{...bankBadge, backgroundColor: bank.color}}>{bank.label}</div>
                <input style={smallInput} type="number" placeholder="Limit" onChange={e => handleNestedBalanceChange('credit_cards', bank.id, e.target.value)} />
              </div>
            ))}
          </div>
        </Step>

        {/* Step 5: Goal */}
        <Step>
          <div style={headerIconStyle}><Target size={32} color="#10b981" /></div>
          <h2 style={titleStyle}>Spending Goal</h2>
          <p style={subtitle}>Set your target daily budget.</p>
          <input style={{...inputStyle, fontSize: '1.5rem', textAlign: 'center'}} type="number" value={formData.daily_limit} onChange={e => setFormData({...formData, daily_limit: e.target.value})} />
          <div style={finalPreview}>
            <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: '10px' }} />
            <p>You're all set to use Vaultly!</p>
          </div>
        </Step>
      </Stepper>
    </div>
  );
};

/* --- Premium Styles --- */
const containerStyle = { padding: '10px', color: 'white' };
const headerIconStyle = { display: 'flex', justifyContent: 'center', marginBottom: '10px' };
const titleStyle = { fontSize: '1.6rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', letterSpacing: '-0.5px' };
const subtitle = { color: '#888', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '16px', marginBottom: '12px', background: '#111', border: '1px solid #333', borderRadius: '14px', color: 'white', boxSizing: 'border-box', outline: 'none' };
const rowInput = { display: 'flex', alignItems: 'center', background: '#111', borderRadius: '14px', border: '1px solid #333', padding: '0 16px', marginBottom: '12px' };
const currencyLabel = { fontSize: '1.2rem', color: '#10b981', fontWeight: 'bold', marginRight: '10px' };
const cleanInput = { flex: 1, padding: '16px 0', background: 'transparent', border: 'none', color: 'white', outline: 'none' };
const scrollArea = { maxHeight: '280px', overflowY: 'auto', paddingRight: '5px' };
const bankRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', background: '#111', padding: '8px 12px', borderRadius: '12px' };
const bankBadge = { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', width: '45px', textAlign: 'center' };
const smallInput = { background: 'transparent', border: 'none', color: 'white', textAlign: 'right', outline: 'none', fontSize: '1rem', width: '120px' };
const finalPreview = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px', opacity: 0.8 };

export default Onboarding;