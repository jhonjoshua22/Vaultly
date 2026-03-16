import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import Stepper, { Step } from "../components/Stepper";

const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    age: "",
    daily_limit: 150,
    balances: {
      gcash: 0,
      cash: 0,
      bdo_savings: 0,
      bdo_credit: 0,
      eastwest_credit: 0,
      eastwest_savings: 0,
      unionbank_savings: 0,
      unionbank_credit: 0,
      metrobank_savings: 0,
      metrobank_credit: 0,
      bpi_savings: 0,
      bpi_credit: 0,
      rcbc_savings: 0,
      rcbc_credit: 0,
    },
  });

  const user = supabase.auth.getSession().then(({ data }) => data.session?.user);

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate("/"); // not logged in

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      if (data && data.first_name) {
        // Already onboarded
        navigate("/home");
      } else {
        setProfile(prev => ({ ...prev, id: userId }));
        setLoading(false);
      }
    };

    checkProfile();
  }, [navigate]);

  const handleChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProfile(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleComplete = async () => {
    const { id, first_name, last_name, age, daily_limit, balances } = profile;

    // Insert into profiles
    const { error: profileError } = await supabase.from("profiles").upsert({
      id,
      first_name,
      last_name,
      age,
      daily_limit,
    });

    if (profileError) return console.error(profileError);

    // Insert into balances
    const { error: balancesError } = await supabase.from("balances").upsert({
      user_id: id,
      ...balances,
    });

    if (balancesError) return console.error(balancesError);

    navigate("/home"); // redirect after onboarding
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome! Let's set up your account</h1>
      <Stepper
        initialStep={1}
        onFinalStepCompleted={handleComplete}
        backButtonText="Previous"
        nextButtonText="Next"
      >
        <Step>
          <h2>Personal Info</h2>
          <input
            type="text"
            placeholder="First Name"
            value={profile.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={profile.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Age"
            value={profile.age}
            onChange={(e) => handleChange("age", e.target.value)}
            style={inputStyle}
          />
        </Step>

        <Step>
          <h2>Daily Limit</h2>
          <input
            type="number"
            placeholder="Daily Limit"
            value={profile.daily_limit}
            onChange={(e) => handleChange("daily_limit", e.target.value)}
            style={inputStyle}
          />
        </Step>

        <Step>
          <h2>Savings</h2>
          {Object.keys(profile.balances)
            .filter((k) => k.includes("savings") || k === "gcash" || k === "cash")
            .map((k) => (
              <input
                key={k}
                type="number"
                placeholder={k}
                value={profile.balances[k]}
                onChange={(e) => handleChange(`balances.${k}`, e.target.value)}
                style={inputStyle}
              />
            ))}
        </Step>

        <Step>
          <h2>Credit Cards</h2>
          {Object.keys(profile.balances)
            .filter((k) => k.includes("credit"))
            .map((k) => (
              <input
                key={k}
                type="number"
                placeholder={k}
                value={profile.balances[k]}
                onChange={(e) => handleChange(`balances.${k}`, e.target.value)}
                style={inputStyle}
              />
            ))}
        </Step>

        <Step>
          <h2>All Done!</h2>
          <p>Click complete to finish setup</p>
        </Step>
      </Stepper>
    </div>
  );
};

const inputStyle = {
  display: "block",
  marginBottom: "1rem",
  padding: "0.5rem",
  fontSize: "1rem",
  width: "100%",
  maxWidth: "400px",
};

export default Onboarding;