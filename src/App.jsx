import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// Layout Components
import Topbar from './components/Topbar';
import Bottombar from './components/Bottombar';

// Page Components
import Home from './pages/Home';
import Leo from './pages/Leo';
import Planner from './pages/Planner';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Auth Listener (Handles Login/Logout updates instantly)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle URL-based auth callback
  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }

  // Loading state
  if (loading) return <div style={centerStyle}>Loading...</div>;

  // IF NO SESSION: Show Login
  if (!session) {
    return (
      <div style={centerStyle}>
        <div style={{ textAlign: 'center' }}>
          <h1>Vaultly</h1>
          <p>Please log in to continue.</p>
          <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} style={loginBtn}>
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  // IF SESSION: Show App
  return (
    <div style={appContainerStyle}>
      <div style={mobileWrapperStyle}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'Home' && <Home />}
          {activeTab === 'Leo' && <Leo />}
          {activeTab === 'Planner' && <Planner />}
          {activeTab === 'Profile' && <Profile />}

          {window.location.pathname.startsWith('/planner/') && <PlannerEditor />}
        </main>
        <Bottombar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

const centerStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexDirection: 'column' };
const appContainerStyle = { backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' };
const mobileWrapperStyle = { width: '100%', maxWidth: '500px', backgroundColor: '#000', display: 'flex', flexDirection: 'column', position: 'relative' };
const loginBtn = { padding: '12px 24px', background: '#4285F4', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' };

export default App;