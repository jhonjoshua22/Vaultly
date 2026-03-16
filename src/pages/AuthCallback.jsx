import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession();

      if (error) {
        console.error(error);
        return;
      }

      navigate("/");
    };

    finishLogin();
  }, [navigate]);

  return (
    <div
      style={{
        color: "white",
        textAlign: "center",
        marginTop: "50px",
        backgroundColor: "#000",
        minHeight: "100vh",
      }}
    >
      Finalizing login...
    </div>
  );
};

export default AuthCallback;