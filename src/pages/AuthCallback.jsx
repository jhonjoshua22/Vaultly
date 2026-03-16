import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if user has a profile record
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (error || !data) {
          // No profile found, redirect to onboarding
          navigate('/onboarding');
        } else {
          // Profile exists, go home
          navigate('/home');
        }
      }
    };

    handleAuth();
  }, [navigate]);

  return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Finalizing login...</div>;
};

export default AuthCallback;