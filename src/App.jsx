import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// Layout Components
import Topbar from './components/Topbar';
import Bottombar from './components/Bottombar';

// Page Components
import Home from './pages/Home';
import Leo from './pages/Leo';
import Archive from './pages/Archive';
import Profile from './pages/Profile';
import Login from './pages/Login'; // Make sure this path is correct

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    // 1. Initial check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for auth changes (Login / Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div style={centerStyle}>Loading...</div>;

  // If no session exists, show the Login page
  if (!session) return <Login />;

  // If session exists, show the full app layout
  return (
    <div style={appContainerStyle}>
      <div style={mobileWrapperStyle}>
        
        <Topbar />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'Home' && <Home />}
          {activeTab === 'Leo' && <Leo />}
          {activeTab === 'Archive' && <Archive />}
          {activeTab === 'Profile' && <Profile />}
        </main>

        <Bottombar activeTab={activeTab} setActiveTab={setActiveTab} />

      </div>
    </div>
  );
}

const centerStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' };
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