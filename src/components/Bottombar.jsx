import React from 'react';
import { Home, Shield, Archive, User } from 'lucide-react';

const Bottombar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'Home', icon: <Home size={22} />, label: 'Home' },
    { key: 'Leo', icon: <Shield size={22} />, label: 'Leo' },
    { key: 'Planner', icon: <Archive size={22} />, label: 'Planner' },
    { key: 'Profile', icon: <User size={22} />, label: 'Profile' },
  ];

  return (
    <nav style={bottomBarStyle}>
      {tabs.map(tab => (
        <TabItem
          key={tab.key}
          icon={tab.icon}
          label={tab.label}
          active={activeTab === tab.key}
          onClick={() => setActiveTab(tab.key)}
        />
      ))}
    </nav>
  );
};

function TabItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        cursor: 'pointer',
        color: active ? '#10b981' : '#555',
        transition: 'color 0.2s ease',
      }}
    >
      {icon}
      <span style={{ fontSize: '0.7rem', fontWeight: active ? 600 : 400 }}>
        {label}
      </span>
    </div>
  );
}

const bottomBarStyle = {
  position: 'fixed',
  bottom: 0,
  width: '100%',
  maxWidth: '500px',
  height: '80px',
  backgroundColor: '#050505',
  borderTop: '1px solid #111',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingBottom: '10px',
  zIndex: 100,
};

export default Bottombar;