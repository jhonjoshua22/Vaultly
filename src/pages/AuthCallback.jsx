import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/');

      // Check profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!profile || !profile.first_name) {
        navigate('/onboarding'); // New user -> onboarding
      } else {
        navigate('/home'); // Existing user
      }
    };

    finishLogin();
  }, [navigate]);

  return <div>Finalizing login...</div>;
};

export default AuthCallback;