import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

import ExpenseList from "./ExpenseList";
import FriendList from "./FriendList";
import UserStats from "./UserStats";
import AddSpendModal from "./AddSpendModal";
import MoneyCredits from "./MoneyCredits";
import AddMoneyModal from "./AddMoneyModal";
import PixelSnow from '../components/PixelSnow/PixelSnow';

const getPHTDate = () => {
  const now = new Date();
  const offset = 8 * 60 * 60 * 1000;
  const phtDate = new Date(now.getTime() + offset);
  return phtDate.toISOString().split("T")[0];
};

const Home = () => {
  const [logs, setLogs] = useState([]);
  const [friendsLogs, setFriendsLogs] = useState([]);
  const [profile, setProfile] = useState({ first_name: "User", dailyLimit: 150 });
  // Initial state is empty to allow dynamic population
  const [balances, setBalances] = useState({});
  
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(getPHTDate());
  const [showAdd, setShowAdd] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);
      await fetchProfile(user.id);
      await fetchLogs(filterDate);
      await fetchFriendsActivity(user.id);
      await fetchBalances(user.id);
      setLoading(false);
    };
    init();
  }, []);

  const fetchProfile = async (id) => {
    const { data } = await supabase
      .from("profiles")
      .select("first_name, daily_limit")
      .eq("id", id)
      .single();
    if (data) {
      setProfile({ first_name: data.first_name || "User", dailyLimit: data.daily_limit || 150 });
    }
  };

  const fetchLogs = async (dateStr) => {
    const start = `${dateStr}T00:00:00.000+08:00`;
    const end = `${dateStr}T23:59:59.999+08:00`;
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false });
    setLogs(data || []);
  };

  const fetchFriendsActivity = async (id) => {
    const { data: friends } = await supabase
      .from("friendships")
      .select("id, friend_name")
      .eq("user_id", id);
    if (friends?.length > 0) {
      const friendIds = friends.map(f => f.id);
      const { data } = await supabase
        .from("friend_logs")
        .select("*, friendships(friend_name)")
        .in("friendship_id", friendIds)
        .order("time_logged", { ascending: false });
      setFriendsLogs(data || []);
    }
  };

  // DYNAMIC FETCH: Only stores entries where value > 0
  const fetchBalances = async (id) => {
    const { data } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", id)
      .single();
    
    if (data) {
      const { id: _id, user_id, updated_at, ...raw } = data;
      // Filter out zero-value columns immediately
      const active = Object.fromEntries(
        Object.entries(raw).filter(([_, v]) => Number(v) > 0)
      );
      setBalances(active);
    }
  };

  const addSpend = async (paymentMethod) => {
    if (!amount || !desc) return;
    const amountNum = Number(amount);

    await supabase.from("expenses").insert([
      { amount: amountNum, description: desc, user_id: userId, payment_method: paymentMethod }
    ]);

    const { data: current } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (current) {
      const updated = { ...current };
      if (updated.hasOwnProperty(paymentMethod)) {
        updated[paymentMethod] = Number(updated[paymentMethod]) - amountNum;
      }

      const { id, user_id, updated_at, ...toSave } = updated;
      await supabase.from("balances").update(toSave).eq("user_id", userId);
      
      // Update local state with filter
      const active = Object.fromEntries(
        Object.entries(toSave).filter(([_, v]) => Number(v) > 0)
      );
      setBalances(active);
    }

    setAmount(""); setDesc(""); setShowAdd(false);
    fetchLogs(filterDate);
  };

  const deleteLog = async (id) => {
    await supabase.from("expenses").delete().eq("id", id);
    setLogs(logs.filter(l => l.id !== id));
  };

  const totalSpent = logs.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const remaining = profile.dailyLimit - totalSpent;

  if (loading) return <div style={loadingStyle}>Loading...</div>;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <PixelSnow color="#10b981" flakeSize={0.01} minFlakeSize={1.25} pixelResolution={200} speed={0.5} density={0.1} variant="square" />
      </div>

      <div style={{ ...pageStyle, position: 'relative', zIndex: 1 }}>
        <UserStats profile={profile} remaining={remaining} totalSpent={totalSpent} filterDate={filterDate} />
        
        {/* Now balances is already filtered */}
        <MoneyCredits balances={balances} setBalances={setBalances} userId={userId} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
          <button style={{ ...addBtn, marginTop: 0 }} onClick={() => setShowAdd(true)}>Add Spend</button>
          <button style={{ ...addBtn, marginTop: 0, background: "#3b82f6" }} onClick={() => setShowAddMoney(true)}>Add/Pay Money</button>
        </div>

        <ExpenseList logs={logs} expandedId={expandedId} setExpandedId={setExpandedId} deleteLog={deleteLog}
          filterDate={filterDate} setFilterDate={setFilterDate} fetchLogs={fetchLogs} />
        
        <FriendList friendsLogs={friendsLogs} />
        
        {showAdd && <AddSpendModal amount={amount} setAmount={setAmount} desc={desc} setDesc={setDesc} addSpend={addSpend} setShowAdd={setShowAdd} />}
        {showAddMoney && <AddMoneyModal userId={userId} balances={balances} setBalances={setBalances} setShowAddMoney={setShowAddMoney} />}
      </div>
    </div>
  );
};

const pageStyle = { padding: 20, maxWidth: 600, margin: "auto", color: "white", paddingBottom: 120 };
const loadingStyle = { padding: 50, textAlign: "center", color: "white" };
const addBtn = { marginTop: 20, background: "#10b981", border: "none", color: "white", padding: "12px 20px", borderRadius: 12, width: "100%", fontWeight: "bold", cursor: "pointer" };

export default Home;