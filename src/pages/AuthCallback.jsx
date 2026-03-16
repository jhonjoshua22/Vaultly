// src/pages/AuthCallback.jsx
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Instead of always /home → go to onboarding check
        navigate('/onboarding');
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  return <div style={{ padding: '4rem', textAlign: 'center', color: '#fff' }}>Finalizing login...</div>;
}