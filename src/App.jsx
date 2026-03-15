import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// Layout Components
import Topbar from './components/Topbar';
import Bottombar from './components/Bottombar';

// Pages
import Home from './pages/Home';
import Leo from './pages/Leo';
import Planner from './pages/Planner';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Home'); // ✅ Active tab state

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (window.location.pathname === '/auth/callback') return <AuthCallback />;

  if (loading) return <div style={centerStyle}>Loading...</div>;

  if (!session) {
    return (
      <div style={centerStyle}>
        <h1>Vaultly</h1>
        <p>Please log in to continue.</p>
        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          style={loginBtn}
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div style={appContainerStyle}>
      <div style={mobileWrapperStyle}>
        <Topbar />
        <main style={{ flex: 1, position: 'relative' }}>
          {/* Keep all pages mounted and show/hide via display */}
          <div style={{ display: activeTab === 'Home' ? 'block' : 'none' }}>
            <Home />
          </div>
          <div style={{ display: activeTab === 'Leo' ? 'block' : 'none' }}>
            <Leo />
          </div>
          <div style={{ display: activeTab === 'Planner' ? 'block' : 'none' }}>
            <Planner />
          </div>
          <div style={{ display: activeTab === 'Profile' ? 'block' : 'none' }}>
            <Profile />
          </div>
        </main>
        <Bottombar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

const centerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  flexDirection: 'column'
};
const appContainerStyle = {
  backgroundColor: '#000',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  color: '#fff',
  fontFamily: 'sans-serif',
  overflowY: 'auto',
};
const mobileWrapperStyle = {
  width: '100%',
  maxWidth: '500px',
  backgroundColor: '#000',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  minHeight: '100vh'
};
const loginBtn = {
  padding: '12px 24px',
  background: '#4285F4',
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default App;