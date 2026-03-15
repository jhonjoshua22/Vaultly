import React, { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";
import { supabase } from "../lib/supabase";

import ExpenseList from "./ExpenseList";
import FriendList from "./FriendList";
import UserStats from "./UserStats";
import AddSpendModal from "./AddSpendModal";
import MoneyCredits from "./MoneyCredits";
import AddMoneyModal from "./AddMoneyModal";

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
  const [balances, setBalances] = useState({
    gcash: 0,
    cash: 0,
    bdoSavings: 0,
    bdoCredit: 0,
    eastwestCredit: 0,
  });
  const [showAddMoney, setShowAddMoney] = useState(false);

  const [expandedId, setExpandedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);
      await fetchProfile(user.id);
      await fetchLogs(filterDate);
      await fetchFriendsActivity(user.id);
      await fetchBalances(user.id);
      setLoading(false);
    };
    init();
  }, []);

  // --- Fetch Profile
  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("first_name, daily_limit")
      .eq("id", userId)
      .single();
    if (data) {
      setProfile({ first_name: data.first_name || "User", dailyLimit: data.daily_limit || 150 });
    }
  };

  const [filterDate, setFilterDate] = useState(getPHTDate());

  // --- Fetch Expenses
  const fetchLogs = async (dateStr) => {
    // Force the query to use PHT (UTC+8)
    // 00:00:00.000+08:00 is the start of the day in Philippines
    // 23:59:59.999+08:00 is the end of the day in Philippines
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

  // --- Fetch Friends Activity
  const fetchFriendsActivity = async (userId) => {
    const { data: friends } = await supabase
      .from("friendships")
      .select("id, friend_name")
      .eq("user_id", userId);
    if (friends && friends.length > 0) {
      const friendIds = friends.map(f => f.id);
      const { data: logs } = await supabase
        .from("friend_logs")
        .select("*, friendships(friend_name)")
        .in("friendship_id", friendIds)
        .order("time_logged", { ascending: false });
      setFriendsLogs(logs || []);
    }
  };

  // --- Fetch Balances
  const fetchBalances = async (userId) => {
    const { data } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (data) {
      setBalances({
        gcash: Number(data.gcash),
        cash: Number(data.cash),
        bdoSavings: Number(data.bdo_savings),
        bdoCredit: Number(data.bdo_credit),
        eastwestCredit: Number(data.eastwest_credit),
      });
    }
  };

  // --- Add Spend
  const addSpend = async (paymentMethod) => {
    if (!amount || !desc) return;
    const amountNum = Number(amount);

    // 1️⃣ Insert expense
    await supabase.from("expenses").insert([
      { amount: amountNum, description: desc, user_id: userId, payment_method: paymentMethod }
    ]);

    // 2️⃣ Update balances in DB
    const { data: currentBalance } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (!currentBalance) return;

    const updated = {
      gcash: Number(currentBalance.gcash),
      cash: Number(currentBalance.cash),
      bdoSavings: Number(currentBalance.bdo_savings),
      bdoCredit: Number(currentBalance.bdo_credit),
      eastwestCredit: Number(currentBalance.eastwest_credit),
    };

    if (paymentMethod === "gcash") updated.gcash -= amountNum;
    if (paymentMethod === "cash") updated.cash -= amountNum;
    if (paymentMethod === "bdoSavings") updated.bdoSavings -= amountNum;
    if (paymentMethod === "bdoCredit") updated.bdoCredit += amountNum;
    if (paymentMethod === "eastwestCredit") updated.eastwestCredit += amountNum;

    await supabase.from("balances").update({
      gcash: updated.gcash,
      cash: updated.cash,
      bdo_savings: updated.bdoSavings,
      bdo_credit: updated.bdoCredit,
      eastwest_credit: updated.eastwestCredit,
      updated_at: new Date()
    }).eq("user_id", userId);

    setBalances(updated);
    setAmount(""); setDesc(""); setShowAdd(false);
    fetchLogs(filterDate);
  };

  // --- Delete Expense
  const deleteLog = async (id) => {
    await supabase.from("expenses").delete().eq("id", id);
    setLogs(logs.filter(l => l.id !== id));
  };

  const totalSpent = logs.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const remaining = profile.dailyLimit - totalSpent;

  if (loading) return <div style={loadingStyle}>Loading...</div>;

  return (
    <div style={pageStyle}>
      <UserStats profile={profile} remaining={remaining} totalSpent={totalSpent} filterDate={filterDate} />
      <MoneyCredits balances={balances} setBalances={setBalances} userId={userId} />

      {/* Grid for two buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
        <button style={{ ...addBtn, marginTop: 0 }} onClick={() => setShowAdd(true)}>
          Add Spend
        </button>
        <button style={{ ...addBtn, marginTop: 0, background: "#3b82f6" }} onClick={() => setShowAddMoney(true)}>
          Add/Pay Money
        </button>
      </div>

      <ExpenseList logs={logs} expandedId={expandedId} setExpandedId={setExpandedId} deleteLog={deleteLog}
        filterDate={filterDate} setFilterDate={setFilterDate} fetchLogs={fetchLogs} />
      
      <FriendList friendsLogs={friendsLogs} />
      
      {showAdd && (
        <AddSpendModal amount={amount} setAmount={setAmount} desc={desc} setDesc={setDesc} addSpend={addSpend} setShowAdd={setShowAdd} />
      )}

      {/* New Modal Trigger */}
      {showAddMoney && (
        <AddMoneyModal 
          userId={userId} 
          balances={balances} 
          setBalances={setBalances} 
          setShowAddMoney={setShowAddMoney} 
        />
      )}
    </div>
  );
};

/* --- Styles --- */
const pageStyle = { padding: 20, maxWidth: 600, margin: "auto", color: "white", paddingBottom: 120 };
const loadingStyle = { padding: 50, textAlign: "center", color: "white" };
const addBtn = { marginTop: 20, background: "#10b981", border: "none", color: "white", padding: "12px 20px", borderRadius: 12, width: "100%", fontWeight: "bold", cursor: "pointer" };
const dateInputStyle = { background: "#111", border: "1px solid #333", color: "white", padding: 8, borderRadius: 8 };

export default Home;