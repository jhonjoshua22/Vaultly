import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      const userId = session.user.id;

      const { data: balance } = await supabase
        .from("balances")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!balance) {
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