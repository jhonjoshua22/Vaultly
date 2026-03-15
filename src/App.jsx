import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// Components
import Topbar from './components/Topbar';
import Bottombar from './components/Bottombar';
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

  if (!session)
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

  return (
    <div style={appContainer}>
      <Topbar />
      <main style={mainContent}>
        {activeTab === 'Home' && <Home />}
        {activeTab === 'Leo' && <Leo />}
        {activeTab === 'Planner' && <Planner />}
        {activeTab === 'Profile' && <Profile />}
      </main>
      <Bottombar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

/* --- Styles --- */
const appContainer = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#000',
  color: '#fff',
  fontFamily: 'sans-serif',
  overflow: 'hidden', // hide any scrollbars
};

const mainContent = {
  flex: 1,
  overflowY: 'auto', // content can scroll if necessary
  padding: '10px 0',
  WebkitOverflowScrolling: 'touch', // smooth scrolling on mobile
};

const centerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  flexDirection: 'column',
};

const loginBtn = {
  padding: '12px 24px',
  background: '#4285F4',
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default App;