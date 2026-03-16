import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Just go to root, App.jsx will decide if Onboarding is needed
        navigate('/');
      }
    });
  }, [navigate]);

  return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px', backgroundColor: '#000', minHeight: '100vh' }}>Finalizing login...</div>;
};

export default AuthCallback;