import React, { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";
import { supabase } from "../lib/supabase";

import ExpenseList from "./ExpenseList";
import FriendList from "./FriendList";
import UserStats from "./UserStats";
import AddSpendModal from "./AddSpendModal";
import MoneyCredits from "./MoneyCredits";

const Home = () => {
  const [logs, setLogs] = useState([]);
  const [friendsLogs, setFriendsLogs] = useState([]);

  const [profile, setProfile] = useState({
    first_name: "User",
    dailyLimit: 150,
  });

  const [expandedId, setExpandedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const [loading, setLoading] = useState(true);

  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  /* MONEY + CREDIT BALANCES */

  const [balances, setBalances] = useState({
    gcash: 0,
    cash: 0,
    bdoSavings: 0,
    bdoCredit: 0,
    eastwestCredit: 0,
  });

  useEffect(() => {
    const init = async () => {
      fetchFriendsActivity();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      fetchProfile(user.id);
      fetchLogs(filterDate);

      setLoading(false);
    };

    init();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("first_name, daily_limit")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile({
        first_name: data.first_name || "User",
        dailyLimit: data.daily_limit || 150,
      });
    }
  };

  const fetchLogs = async (dateStr) => {
    const start = new Date(dateStr);
    start.setHours(0, 0, 0, 0);

    const end = new Date(dateStr);
    end.setHours(23, 59, 59, 999);

    const { data } = await supabase
      .from("expenses")
      .select("*")
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString())
      .order("created_at", { ascending: false });

    setLogs(data || []);
  };

  const fetchFriendsActivity = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: friends } = await supabase
      .from("friendships")
      .select("id, friend_name")
      .eq("user_id", user.id);

    if (friends && friends.length > 0) {
      const friendIds = friends.map((f) => f.id);

      const { data: logs } = await supabase
        .from("friend_logs")
        .select("*")
        .in("friendship_id", friendIds)
        .order("time_logged", { ascending: false });

      setFriendsLogs(logs || []);
    }
  };

  /* ADD SPEND WITH PAYMENT METHOD */

  const addSpend = async (paymentMethod) => {
    if (!amount || !desc) return;

    const amountNum = Number(amount);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("expenses")
      .insert([
        {
          amount: amountNum,
          description: desc,
          user_id: user.id,
          payment_method: paymentMethod,
        },
      ]);

    if (!error) {
      /* UPDATE BALANCES */

      setBalances((prev) => {
        const updated = { ...prev };

        if (paymentMethod === "gcash") updated.gcash -= amountNum;
        if (paymentMethod === "cash") updated.cash -= amountNum;
        if (paymentMethod === "bdoSavings") updated.bdoSavings -= amountNum;

        if (paymentMethod === "bdoCredit") updated.bdoCredit += amountNum;
        if (paymentMethod === "eastwestCredit")
          updated.eastwestCredit += amountNum;

        return updated;
      });

      fetchLogs(filterDate);

      setAmount("");
      setDesc("");
      setShowAdd(false);
    }
  };

  const deleteLog = async (id) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (!error) setLogs(logs.filter((l) => l.id !== id));
  };

  const totalSpent = logs.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const remaining = profile.dailyLimit - totalSpent;

  if (loading) return <div style={loadingStyle}>Loading...</div>;

  return (
    <div style={pageStyle}>
      <UserStats
        profile={profile}
        remaining={remaining}
        totalSpent={totalSpent}
        filterDate={filterDate}
      />

      {/* MONEY + CREDIT SECTION */}

      <MoneyCredits balances={balances} setBalances={setBalances} />

      <button style={addBtn} onClick={() => setShowAdd(true)}>
        <Plus size={18} /> Add Spend
      </button>

      <div style={{ marginTop: "25px", display: "flex", gap: "10px" }}>
        <Calendar size={18} color="#10b981" />

        <input
          type="date"
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
            fetchLogs(e.target.value);
          }}
          style={dateInputStyle}
        />
      </div>

      <ExpenseList
        logs={logs}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        deleteLog={deleteLog}
      />

      <FriendList friendsLogs={friendsLogs} />
      {friendsLogs.length === 0 && (
          <p style={{opacity:0.5}}>No friends activity yet.</p>
      )}

      {showAdd && (
        <AddSpendModal
          amount={amount}
          setAmount={setAmount}
          desc={desc}
          setDesc={setDesc}
          addSpend={addSpend}
          setShowAdd={setShowAdd}
        />
      )}
    </div>
  );
};

/* styles */

const pageStyle = {
  padding: "20px",
  maxWidth: "600px",
  margin: "auto",
  color: "white",
};

const loadingStyle = {
  padding: "50px",
  textAlign: "center",
  color: "white",
};

const addBtn = {
  marginTop: "20px",
  background: "#10b981",
  border: "none",
  color: "white",
  padding: "12px 20px",
  borderRadius: "12px",
  width: "100%",
  fontWeight: "bold",
  cursor: "pointer",
};

const dateInputStyle = {
  background: "#111",
  border: "1px solid #333",
  color: "white",
  padding: "8px",
  borderRadius: "8px",
};

export default Home;