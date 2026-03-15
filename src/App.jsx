import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Pages
import Home from './pages/Home';
import Leo from './pages/Leo';
import Archive from './pages/Archive';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback'; // Your existing file

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <BrowserRouter>
      <div style={appContainerStyle}>
        <div style={mobileWrapperStyle}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected Routes */}
            <Route path="/" element={session ? <Home /> : <Navigate to="/login" />} />
            <Route path="/home" element={session ? <Home /> : <Navigate to="/login" />} />
            <Route path="/leo" element={session ? <Leo /> : <Navigate to="/login" />} />
            <Route path="/archive" element={session ? <Archive /> : <Navigate to="/login" />} />
            <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" />} />
            
            {/* Login Fallback */}
            <Route path="/login" element={session ? <Navigate to="/home" /> : <LoginPrompt />} />
          </Routes>
          
          {/* Only show Bottombar if logged in */}
          {session && <Bottombar />}
        </div>
      </div>
    </BrowserRouter>
  );
}

const LoginPrompt = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'white', marginTop: '100px' }}>
      <h1>Vaultly</h1>
      <p style={{ opacity: 0.7, marginBottom: '30px' }}>Log in to track your daily spend.</p>
      <button 
        onClick={handleGoogleLogin} 
        style={{ 
          padding: '12px 24px', 
          background: '#4285F4', // Google Blue
          border: 'none', 
          borderRadius: '8px', 
          color: 'white', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          margin: '0 auto'
        }}
      >
        Login with Google
      </button>
    </div>
  );
};

const appContainerStyle = { backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', color: '#fff' };
const mobileWrapperStyle = { width: '100%', maxWidth: '500px', backgroundColor: '#000', display: 'flex', flexDirection: 'column' };

export default App;