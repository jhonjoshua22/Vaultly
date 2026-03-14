import React, { useState } from 'react';
import { Home, Shield, Archive, User, Plus, FileText, Image, File, Search } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Defaulted to true for UI testing
  const userName = "Alex";

  // --- SCREEN COMPONENTS ---

  const HomeScreen = () => (
    <div style={contentStyle}>
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

  const VaultScreen = () => (
    <div style={contentStyle}>
      <h2 style={headerStyle}>Your Vault</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        <div style={vaultActionStyle}><Image size={24} /> <span>Photos</span></div>
        <div style={vaultActionStyle}><FileText size={24} /> <span>Texts</span></div>
        <div style={vaultActionStyle}><File size={24} /> <span>Files</span></div>
        <div style={{ ...vaultActionStyle, border: '1px dashed #10b981', color: '#10b981' }}>
          <Plus size={24} /> <span>Add New</span>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '10px', top: '10px', color: '#666' }} size={18} />
        <input type="text" placeholder="Search your vault..." style={searchStyle} />
      </div>
    </div>
  );

  const ArchiveScreen = () => (
    <div style={contentStyle}>
      <h2 style={headerStyle}>Archive</h2>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>Items stored for long-term safe keeping.</p>
      {[1, 2, 3].map(i => (
        <div key={i} style={listItemStyle}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Archive size={20} color="#666" />
            <div>
              <div style={{ fontWeight: '500' }}>Old_Tax_Return_2024.pdf</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>Archived 2 months ago</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ProfileScreen = () => (
    <div style={contentStyle}>
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: '#222', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={40} color="#10b981" />
        </div>
        <h2 style={{ margin: 0 }}>{userName}</h2>
        <p style={{ color: '#666' }}>Premium Member</p>
        <button style={logoutButtonStyle}>Log Out</button>
      </div>
    </div>
  );

  return (
    <div style={appContainerStyle}>
      <div style={mobileWrapperStyle}>
        
        {/* TOPBAR */}
        <header style={topBarStyle}>
          <h1 style={{ color: '#10b981', fontSize: '1.4rem', margin: 0 }}>Vaultly</h1>
          <Shield color="#10b981" size={24} />
        </header>

        {/* MAIN DYNAMIC CONTENT */}
        {activeTab === 'Home' && <HomeScreen />}
        {activeTab === 'Vault' && <VaultScreen />}
        {activeTab === 'Archive' && <ArchiveScreen />}
        {activeTab === 'Profile' && <ProfileScreen />}

        {/* BOTTOMBAR */}
        <nav style={bottomBarStyle}>
          <TabItem icon={<Home size={22}/>} label="Home" active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
          <TabItem icon={<Shield size={22}/>} label="Vault" active={activeTab === 'Vault'} onClick={() => setActiveTab('Vault')} />
          <TabItem icon={<Archive size={22}/>} label="Archive" active={activeTab === 'Archive'} onClick={() => setActiveTab('Archive')} />
          <TabItem icon={<User size={22}/>} label="Profile" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} />
        </nav>

      </div>
    </div>
  );
}

// --- STYLES (Mobile First) ---
const appContainerStyle = { backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' };
const mobileWrapperStyle = { width: '100%', maxWidth: '500px', backgroundColor: '#000', position: 'relative', paddingBottom: '90px' };
const topBarStyle = { height: '60px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #111', position: 'sticky', top: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 10 };
const contentStyle = { padding: '20px' };
const headerStyle = { fontSize: '1.5rem', marginBottom: '20px', fontWeight: 'bold' };
const cardStyle = { background: '#111', padding: '25px', borderRadius: '18px', border: '1px solid #222' };
const miniCardStyle = { background: '#111', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #222' };
const vaultActionStyle = { background: '#111', height: '90px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', border: '1px solid #222', fontSize: '0.85rem' };
const bottomBarStyle = { position: 'fixed', bottom: 0, width: '100%', maxWidth: '500px', height: '80px', backgroundColor: '#050505', borderTop: '1px solid #111', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: '10px' };
const listItemStyle = { padding: '15px', background: '#0a0a0a', borderRadius: '12px', marginBottom: '10px', borderBottom: '1px solid #111' };
const searchStyle = { width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', background: '#111', border: '1px solid #222', color: '#fff', outline: 'none', boxSizing: 'border-box' };
const logoutButtonStyle = { marginTop: '20px', padding: '10px 30px', borderRadius: '20px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer' };

function TabItem({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer', color: active ? '#10b981' : '#555' }}>
      {icon}
      <span style={{ fontSize: '0.7rem' }}>{label}</span>
    </div>
  );
}

export default App;