import React from 'react';
import { Home, Shield, Archive, User } from 'lucide-react';

const Bottombar = ({ activeTab, setActiveTab }) => {
  // Positioning helper based on index
  const tabs = [
    { name: 'Home', icon: Home },
    { name: 'Vault', icon: Shield },
    { name: 'Archive', icon: Archive },
    { name: 'Profile', icon: User }
  ];

  const getLeftPosition = () => {
    const index = tabs.findIndex(t => t.name === activeTab);
    return `${12.5 + (index * 25)}%`;
  };

  return (
    <nav style={bottomBarStyle}>
      {/* The Liquid Blob Indicator */}
      <div style={{
        ...indicatorStyle,
        left: getLeftPosition(),
      }} />

      {tabs.map((tab) => (
        <TabItem 
          key={tab.name}
          icon={<tab.icon size={22} />} 
          label={tab.name} 
          active={activeTab === tab.name} 
          onClick={() => setActiveTab(tab.name)} 
        />
      ))}
    </nav>
  );
};

const TabItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} style={{ 
    display: 'flex', flexDirection: 'column', alignItems: 'center', 
    gap: '4px', cursor: 'pointer', zIndex: 2,
    color: active ? '#ffffff' : '#555', // Text turns white when active
    transition: 'all 0.3s ease'
  }}>
    {icon}
    <span style={{ 
      fontSize: '0.7rem', 
      fontWeight: active ? '700' : '400',
      transform: active ? 'translateY(-2px)' : 'translateY(0)'
    }}>
      {label}
    </span>
  </div>
);

const bottomBarStyle = {
  position: 'fixed', bottom: 0, width: '100%', maxWidth: '500px', height: '80px',
  backgroundColor: '#050505', borderTop: '1px solid #111',
  display: 'flex', justifyContent: 'space-around', alignItems: 'center',
  paddingBottom: '10px', zIndex: 100
};

const indicatorStyle = {
  position: 'absolute',
  top: '-15px', // Creates the "bump" on top
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#10b981', // Your signature green
  transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
  zIndex: 1
};

export default Bottombar;