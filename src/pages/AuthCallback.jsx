import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate("/"); // not logged in

      const userId = session.user.id;

      // Check if user has first_name in profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", userId)
        .single();

      if (error) {
        console.error(error);
      }

      if (!data || !data.first_name) {
        navigate("/onboarding");
      } else {
        navigate("/home");
      }
    };

    finishLogin();
  }, [navigate]);

  return <div>Finalizing login...</div>;
};

export default AuthCallback;