import React from 'react';

const Home = ({ userName }) => {
  return (
    <div style={pageStyle}>
      <h2 style={headerStyle}>Welcome Back, {userName}</h2>
      <div style={cardStyle}>
        <p style={{ opacity: 0.8, marginBottom: '5px' }}>Total Secured Items</p>
        <h1 style={{ margin: 0, color: '#10b981' }}>128</h1>
      </div>
      <h3 style={{ marginTop: '20px' }}>Quick Stats</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={miniCardStyle}><strong>42</strong> Photos</div>
        <div style={miniCardStyle}><strong>12</strong> Texts</div>
      </div>
    </div>
  );
};

const pageStyle = { padding: '20px' };
const headerStyle = { fontSize: '1.5rem', marginBottom: '20px', fontWeight: 'bold' };
const cardStyle = { background: '#111', padding: '25px', borderRadius: '18px', border: '1px solid #222' };
const miniCardStyle = { background: '#111', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #222' };

export default Home;