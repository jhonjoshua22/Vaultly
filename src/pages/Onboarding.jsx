import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import Stepper, { Step } from "../components/Stepper";

const Onboarding = () => {
  const navigate = useNavigate();

  // Profile info
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    daily_limit: 150
  });

  // Balances
  const [balances, setBalances] = useState({
    cash: 0,
    gcash: 0,

    bdo_savings: 0,
    eastwest_savings: 0,
    unionbank_savings: 0,
    metrobank_savings: 0,
    rcbc_savings: 0,
    bpi_savings: 0,

    bdo_credit: 0,
    eastwest_credit: 0,
    unionbank_credit: 0,
    metrobank_credit: 0,
    rcbc_credit: 0,
    bpi_credit: 0
  });

  // Handle input changes
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleBalanceChange = (e) => {
    // convert numeric fields to numbers
    const value = parseFloat(e.target.value) || 0;
    setBalances({ ...balances, [e.target.name]: value });
  };

  // Complete onboarding
  const completeOnboarding = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userId = user.id;

      // Create profile
      await supabase.from("profiles").insert({
        id: userId,
        ...profile,
        daily_limit: parseFloat(profile.daily_limit) || 150
      });

      // Create balances
      await supabase.from("balances").insert({
        user_id: userId,
        ...balances
      });

      // After creating both rows → go to home
      navigate("/home");

    } catch (error) {
      console.error("Error completing onboarding:", error.message);
      alert("Failed to complete onboarding. Try again.");
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: "0 auto" }}>
      <Stepper initialStep={1} onFinalStepCompleted={completeOnboarding}>

        <Step>
          <h2>Welcome!</h2>
          <p>Let's set up your financial profile.</p>
        </Step>

        <Step>
          <h2>Your Info</h2>
          <input
            name="first_name"
            placeholder="First Name"
            value={profile.first_name}
            onChange={handleProfileChange}
          />
          <input
            name="last_name"
            placeholder="Last Name"
            value={profile.last_name}
            onChange={handleProfileChange}
          />
          <input
            name="daily_limit"
            type="number"
            placeholder="Daily Spending Limit"
            value={profile.daily_limit}
            onChange={handleProfileChange}
          />
        </Step>

        <Step>
          <h2>Cash & Wallet</h2>
          <input
            name="cash"
            type="number"
            placeholder="Cash"
            value={balances.cash}
            onChange={handleBalanceChange}
          />
          <input
            name="gcash"
            type="number"
            placeholder="GCash"
            value={balances.gcash}
            onChange={handleBalanceChange}
          />
        </Step>

        <Step>
          <h2>Savings Accounts</h2>
          <input name="bdo_savings" type="number" placeholder="BDO Savings" value={balances.bdo_savings} onChange={handleBalanceChange} />
          <input name="bpi_savings" type="number" placeholder="BPI Savings" value={balances.bpi_savings} onChange={handleBalanceChange} />
          <input name="rcbc_savings" type="number" placeholder="RCBC Savings" value={balances.rcbc_savings} onChange={handleBalanceChange} />
          <input name="eastwest_savings" type="number" placeholder="EastWest Savings" value={balances.eastwest_savings} onChange={handleBalanceChange} />
          <input name="unionbank_savings" type="number" placeholder="UnionBank Savings" value={balances.unionbank_savings} onChange={handleBalanceChange} />
          <input name="metrobank_savings" type="number" placeholder="Metrobank Savings" value={balances.metrobank_savings} onChange={handleBalanceChange} />
        </Step>

        <Step>
          <h2>Credit Cards</h2>
          <input name="bdo_credit" type="number" placeholder="BDO Credit" value={balances.bdo_credit} onChange={handleBalanceChange} />
          <input name="bpi_credit" type="number" placeholder="BPI Credit" value={balances.bpi_credit} onChange={handleBalanceChange} />
          <input name="rcbc_credit" type="number" placeholder="RCBC Credit" value={balances.rcbc_credit} onChange={handleBalanceChange} />
          <input name="eastwest_credit" type="number" placeholder="EastWest Credit" value={balances.eastwest_credit} onChange={handleBalanceChange} />
          <input name="unionbank_credit" type="number" placeholder="UnionBank Credit" value={balances.unionbank_credit} onChange={handleBalanceChange} />
          <input name="metrobank_credit" type="number" placeholder="Metrobank Credit" value={balances.metrobank_credit} onChange={handleBalanceChange} />
        </Step>

      </Stepper>
    </div>
  );
};

export default Onboarding;