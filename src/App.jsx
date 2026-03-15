import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle URL-based auth callback
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
    <Router>
      <div style={appContainerStyle}>
        <div style={mobileWrapperStyle}>
          <Topbar />
          <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
            <div style={{ display: activeTab === 'Home' ? 'block' : 'none', transition: 'opacity 0.3s' }}>
              <Home />
            </div>
            <div style={{ display: activeTab === 'Leo' ? 'block' : 'none', transition: 'opacity 0.3s' }}>
              <Leo />
            </div>
            <div style={{ display: activeTab === 'Planner' ? 'block' : 'none', transition: 'opacity 0.3s' }}>
              <Planner />
            </div>
            <div style={{ display: activeTab === 'Profile' ? 'block' : 'none', transition: 'opacity 0.3s' }}>
              <Profile />
            </div>
          </main>
          <Bottombar />
        </div>
      </div>
    </Router>
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