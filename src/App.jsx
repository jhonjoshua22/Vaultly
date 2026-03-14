import React, { useState } from 'react';

// Layout Components
import Topbar from './components/Topbar';
import Bottombar from './components/Bottombar';

// Page Components
import Home from './pages/Home';
import Vault from './pages/Vault';
import Archive from './pages/Archive';
import Profile from './pages/Profile';

function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const userName = "Alex";

  return (
    <div style={appContainerStyle}>
      <div style={mobileWrapperStyle}>
        
        <Topbar />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'Home' && <Home userName={userName} />}
          {activeTab === 'Vault' && <Vault />}
          {activeTab === 'Archive' && <Archive />}
          {activeTab === 'Profile' && <Profile userName={userName} />}
        </main>

        <Bottombar activeTab={activeTab} setActiveTab={setActiveTab} />

      </div>
    </div>
  );
}

const appContainerStyle = { 
  backgroundColor: '#000', 
  minHeight: '100vh', 
  display: 'flex', 
  justifyContent: 'center', 
  color: '#fff', 
  fontFamily: 'sans-serif' 
};

const mobileWrapperStyle = { 
  width: '100%', 
  maxWidth: '500px', 
  backgroundColor: '#000', 
  display: 'flex', 
  flexDirection: 'column', 
  position: 'relative' 
};

export default App;