import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// Layout Components
import Topbar from './components/Topbar';
import Bottombar from './components/Bottombar';
import PixelSnow from './components/PixelSnow/PixelSnow';

// Pages
import Home from './pages/Home';
import Leo from './pages/Leo';
import Planner from './pages/Planner';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          window.location.href = '/onboarding';
          return; // stop further rendering
        }
      }

      setLoading(false);
    };

    checkSession();

    // Listen for live auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!profile) {
            window.location.href = '/onboarding';
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div style={centerStyle}>Loading...</div>;

  const pathname = window.location.pathname;

  // Onboarding page
  if (pathname === '/onboarding' && session) {
    return (
      <Onboarding
        user={session.user}
        onComplete={() => window.location.href = '/'}
      />
    );
  }

  // Not logged in
  if (!session) {
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <PixelSnow 
            color="#10b981"
            flakeSize={0.01}
            minFlakeSize={1.25}
            pixelResolution={200}
            speed={1.0}
            density={0.2}
            variant="square"
          />
        </div>
        <div style={{ ...centerStyle, position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontWeight: 'bold', color: '#10b981', fontSize: '4.5rem', marginBottom: '5vh' }}>Vaultly</h1>
          <p style={{ color: '#fff', fontSize: '1rem', marginBottom: '10vh' }}>Simple planning, total control.</p>
          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({ 
                provider: 'google',
                options: { redirectTo: 'https://vaultlybyjosh.vercel.app/auth/callback' }
              })
            }
            style={loginBtn}
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  // Main App Tabs
  return (
    <div style={appContainerStyle}>
      <div style={mobileWrapperStyle}>
        <Topbar />
        <main style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
          <div style={{ display: activeTab === 'Home' ? 'block' : 'none' }}><Home /></div>
          <div style={{ display: activeTab === 'Leo' ? 'block' : 'none' }}><Leo /></div>
          <div style={{ display: activeTab === 'Planner' ? 'block' : 'none' }}><Planner /></div>
          <div style={{ display: activeTab === 'Profile' ? 'block' : 'none' }}><Profile /></div>
        </main>
        <Bottombar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

/* Styles */
const centerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  fontFamily: 'sans-serif'
};

const appContainerStyle = {
  backgroundColor: '#000',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  color: '#fff',
  fontFamily: 'sans-serif',
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
  padding: '14px 28px',
  background: '#10b981',
  border: 'none',
  borderRadius: '12px',
  color: '#000',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer'
};

export default App;