import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// Components & Pages
import Topbar from './components/Topbar';
import Bottombar from './components/Bottombar';
import PixelSnow from './components/PixelSnow/PixelSnow';
import Home from './pages/Home';
import Leo from './pages/Leo';
import Planner from './pages/Planner';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding'; // Import your onboarding
import AuthCallback from './pages/AuthCallback';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        // Check if user has finished onboarding by looking for a first_name
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', session.user.id)
          .single();
        
        setIsOnboarded(!!profile?.first_name);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (window.location.pathname === '/auth/callback') return <AuthCallback />;
  if (loading) return <div style={centerStyle}>Loading...</div>;

  // 1. Unauthenticated State
  if (!session) {
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <PixelSnow color="#10b981" variant="square" />
        </div>
        <div style={{ ...centerStyle, position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontWeight: 'bold', color: '#10b981', fontSize: '4.5rem', marginBottom: '5vh' }}>Vaultly</h1>
          <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} style={loginBtn}>Login with Google</button>
        </div>
      </div>
    );
  }

  // 2. Onboarding State
  if (!isOnboarded) {
    return <Onboarding user={session.user} onComplete={() => setIsOnboarded(true)} />;
  }

  // 3. Authenticated & Onboarded State
  return (
    <div style={appContainerStyle}>
      <div style={mobileWrapperStyle}>
        <Topbar />
        <main style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
          {activeTab === 'Home' && <Home />}
          {activeTab === 'Leo' && <Leo />}
          {activeTab === 'Planner' && <Planner />}
          {activeTab === 'Profile' && <Profile />}
        </main>
        <Bottombar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

/* Styles remain the same... */
const centerStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontFamily: 'sans-serif' };
const appContainerStyle = { backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' };
const mobileWrapperStyle = { width: '100%', maxWidth: '500px', backgroundColor: '#000', display: 'flex', flexDirection: 'column', minHeight: '100vh' };
const loginBtn = { padding: '14px 28px', background: '#10b981', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 'bold', cursor: 'pointer' };

export default App;