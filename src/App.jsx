import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import AuthCallback from './pages/AuthCallback';
import PixelSnow from './components/PixelSnow/PixelSnow';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session) => {
    setSession(session);
    if (session) {
      const { data } = await supabase.from('profiles').select('first_name').eq('id', session.user.id).single();
      setHasProfile(!!data?.first_name);
    }
    setLoading(false);
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* If logged in, check profile. If profile missing, go to onboarding */}
        <Route path="/" element={
          !session ? <LoginScreen /> : 
          !hasProfile ? <Navigate to="/onboarding" /> : <Home />
        } />
        
        <Route path="/onboarding" element={
          !session ? <Navigate to="/" /> : 
          hasProfile ? <Navigate to="/" /> : <Onboarding user={session.user} onComplete={() => window.location.href = '/'} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

const LoginScreen = () => (
  <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <h1 style={{ color: '#10b981' }}>Vaultly</h1>
    <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} style={{ padding: '14px 28px', background: '#10b981', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
      Login with Google
    </button>
  </div>
);

export default App;