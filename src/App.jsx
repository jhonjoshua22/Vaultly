import React, { useState } from 'react';
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';

import Topbar from './components/Topbar';
import Dock from './components/Dock';
import Home from './pages/Home';
import Vault from './pages/Vault';
import Archive from './pages/Archive';
import Profile from './pages/Profile';

function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const userName = "Alex";

  const items = [
    { icon: <VscHome size={20} />, label: 'Home', onClick: () => setActiveTab('Home') },
    { icon: <VscArchive size={20} />, label: 'Vault', onClick: () => setActiveTab('Vault') },
    { icon: <VscArchive size={20} />, label: 'Archive', onClick: () => setActiveTab('Archive') },
    { icon: <VscAccount size={20} />, label: 'Profile', onClick: () => setActiveTab('Profile') },
  ];

  return (
    <div style={appContainerStyle}>
      <div style={mobileWrapperStyle}>
        <Topbar />

        {/* Dynamic Page Content */}
        <main style={mainContentStyle}>
          {activeTab === 'Home' && <Home userName={userName} />}
          {activeTab === 'Vault' && <Vault />}
          {activeTab === 'Archive' && <Archive />}
          {activeTab === 'Profile' && <Profile userName={userName} />}
        </main>

        {/* Mac-style Dock */}
        <Dock 
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </div>
  );
}

const appContainerStyle = { backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' };
const mobileWrapperStyle = { width: '100%', maxWidth: '500px', backgroundColor: '#000', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' };
const mainContentStyle = { flex: 1, overflowY: 'auto', paddingBottom: '120px' };

export default App;