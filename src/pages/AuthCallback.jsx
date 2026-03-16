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
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      // If profile doesn't exist, create a blank one
      if (!profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: session.user.id })
          .select()
          .single();

        if (insertError) {
          console.error(insertError);
          return;
        }
        profile = newProfile;
      }

      // Navigate based on first_name
      if (!profile.first_name || profile.first_name.trim() === '') {
        navigate('/onboarding'); // New user
      } else {
        navigate('/home'); // Existing user
      }
    };

    finishLogin();
  }, [navigate]);

  return <div>Finalizing login...</div>;
};

export default AuthCallback;