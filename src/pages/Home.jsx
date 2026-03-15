import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { supabase } from "../lib/supabase"; 
import UserStats from "./UserStats";
import ExpenseList from "./ExpenseList";
import FriendList from "./FriendList";
import AddSpendModal from "./AddSpendModal";

const Home = () => {
  const [logs, setLogs] = useState([]);
  const [profile, setProfile] = useState({ first_name: "User", dailyLimit: 150 });
  const [friendsLogs, setFriendsLogs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const init = async () => {
      fetchFriendsActivity();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      fetchProfile(user.id);
      fetchLogs(filterDate);
      setLoading(false);
    };
    init();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('first_name, daily_limit').eq('id', userId).single();
    if (data) setProfile({ first_name: data.first_name || "User", dailyLimit: data.daily_limit || 150 });
  };

  const fetchLogs = async (dateStr) => {
    const start = new Date(dateStr); start.setHours(0, 0, 0, 0);
    const end = new Date(dateStr); end.setHours(23, 59, 59, 999);
    const { data } = await supabase.from('expenses').select('*').gte('created_at', start.toISOString()).lte('created_at', end.toISOString()).order('created_at', { ascending: false });
    setLogs(data || []);
  };

  const fetchFriendsActivity = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: friends } = await supabase.from('friendships').select('id, friend_name').eq('user_id', user.id);
    if (friends?.length > 0) {
      const { data: logs } = await supabase.from('friend_logs').select('*').in('friendship_id', friends.map(f => f.id)).order('time_logged', { ascending: false });
      setFriendsLogs(logs || []);
    }
  };

  const deleteLog = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) setLogs(logs.filter((l) => l.id !== id));
  };

  if (loading) return <div style={loadingStyle}>Loading...</div>;

  return (
    <div style={pageStyle}>
      <UserStats profile={profile} logs={logs} filterDate={filterDate} onDateChange={(d) => {setFilterDate(d); fetchLogs(d);}} />
      <button style={addBtn} onClick={() => setShowAdd(true)}><Plus size={18} /> Add Spend</button>
      <ExpenseList logs={logs} onDelete={deleteLog} />
      <FriendList friendsLogs={friendsLogs} />
      {showAdd && <AddSpendModal onClose={() => setShowAdd(false)} onSave={() => { fetchLogs(filterDate); setShowAdd(false); }} />}
    </div>
  );
};