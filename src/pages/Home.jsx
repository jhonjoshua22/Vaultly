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
    init();
  }, []);

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    await Promise.all([fetchProfile(user.id), fetchLogs(filterDate), fetchFriendsActivity()]);
    setLoading(false);
  };

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
    const { data: friends } = await supabase.from('friendships').select('id').eq('user_id', user.id);
    if (friends?.length > 0) {
      const { data } = await supabase.from('friend_logs').select('*').in('friendship_id', friends.map(f => f.id)).order('time_logged', { ascending: false });
      setFriendsLogs(data || []);
    }
  };

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <UserStats profile={profile} logs={logs} filterDate={filterDate} onDateChange={(d) => {setFilterDate(d); fetchLogs(d);}} />
      <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={18} /> Add Spend</button>
      <ExpenseList logs={logs} setLogs={setLogs} />
      <FriendList friendsLogs={friendsLogs} />
      {showAdd && <AddSpendModal onClose={() => setShowAdd(false)} onSave={() => { fetchLogs(filterDate); setShowAdd(false); }} />}
    </div>
  );
};
export default Home;