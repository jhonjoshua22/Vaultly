import React, { useState, useEffect } from 'react';
import { Shield, LogIn, User } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Ensure this points to your supabase client

const Topbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
        redirectTo: window.location.origin + '/auth/callback', // Point to your callback route
        queryParams: {
            access_type: 'offline',
            prompt: 'consent',
        },
        },
    });
    if (error) console.error('Error:', error.message);
  };

  return (
    <header style={topBarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield color="#10b981" size={24} />
        <h1 style={{ color: '#10b981', fontSize: '1.4rem', margin: 0 }}>Vaultly</h1>
      </div>

      {/* Login / Profile Toggle */}
      {user ? (
        <div style={statusDotContainer}>
          <User size={18} color="#10b981" />
          <span style={{ fontSize: '0.7rem', color: '#10b981' }}>{user.email?.split('@')[0]}</span>
        </div>
      ) : (
        <button onClick={handleLogin} style={loginButtonStyle}>
          <LogIn size={14} />
          <span>Login</span>
        </button>
      )}
    </header>
  );
};

const topBarStyle = {
  height: '60px',
  padding: '0 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid #111',
  position: 'sticky',
  top: 0,
  backgroundColor: 'rgba(0,0,0,0.8)',
  backdropFilter: 'blur(10px)',
  zIndex: 100
};

const loginButtonStyle = {
  background: 'transparent',
  border: '1px solid #10b981',
  color: '#10b981',
  padding: '6px 12px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.75rem',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const statusDotContainer = { display: 'flex', alignItems: 'center', gap: '6px' };

export default Topbar;