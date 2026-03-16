import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically handles the hash/code in the URL
    // We just need to ensure the session is initialized
    supabase.auth.getSession().then(() => {
      navigate('/home'); // Redirect to your app's home screen
    });
  }, [navigate]);

  return <div>Finalizing login...</div>;
};

export default AuthCallback;