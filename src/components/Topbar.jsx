import React from 'react';
import { Shield } from 'lucide-react';

const Topbar = () => {
  return (
    <header style={topBarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield color="#10b981" size={24} />
        <h1 style={{ color: '#10b981', fontSize: '1.4rem', margin: 0, letterSpacing: '-0.5px' }}>
          Vaultly
        </h1>
      </div>
      <div style={statusDotContainer}>
        <div style={statusDot}></div>
        <span style={{ fontSize: '0.7rem', color: '#666' }}>SECURE</span>
      </div>
    </header>
  );
};

const topBarStyle = {
  height: '60px',
  padding: '0 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid #111',
  position: 'sticky',
  top: 0,
  backgroundColor: 'rgba(0,0,0,0.8)',
  backdropFilter: 'blur(10px)',
  zIndex: 100
};

const statusDotContainer = { display: 'flex', alignItems: 'center', gap: '6px' };
const statusDot = { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' };

export default Topbar;