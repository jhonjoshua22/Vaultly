import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.hash);
      // After code exchange, go to root. 
      // App.jsx will see the new session and trigger checkProfile automatically.
      navigate('/', { replace: true });
    };

    processAuth();
  }, [navigate]);

  return (
    <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px', backgroundColor: '#000', minHeight: '100vh' }}>
      <h2 style={{ color: '#10b981' }}>Setting up your vault...</h2>
    </div>
  );
};

export default AuthCallback;