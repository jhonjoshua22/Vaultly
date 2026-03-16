import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', session.user.id)
        .single();

      if (profile?.first_name) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    });
  }, [navigate]);

  return <div>Finalizing login...</div>;
};

export default AuthCallback;