import React, { useState, useEffect } from 'react';
import { User, Save, Edit2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Profile = () => {
  const [profile, setProfile] = useState({ first_name: '', last_name: '', daily_limit: 150 });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('first_name, last_name, daily_limit')
      .eq('id', user.id)
      .single();

    if (data) setProfile(data);
    setLoading(false);
  };

  const updateProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('profiles')
      .update({ 
        first_name: profile.first_name, 
        last_name: profile.last_name, 
        daily_limit: profile.daily_limit 
      })
      .eq('id', user.id);

    if (error) alert("Error updating: " + error.message);
    else {
      alert("Profile updated!");
      setIsEditing(false); // Close edit mode after saving
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: '#222', margin: '20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <User size={40} color="#10b981" />
      </div>
      
      {/* Name Display Section */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <h2 style={{ margin: 0 }}>{`${profile.first_name || ''} ${profile.last_name || ''}`}</h2>
        {!isEditing && <Edit2 size={18} color="#10b981" style={{ cursor: 'pointer' }} onClick={() => setIsEditing(true)} />}
      </div>
      
      {/* Editable Form Section */}
      {isEditing && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontSize: '0.8rem', opacity: 0.6 }}>Edit Profile</label>
            <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsEditing(false)} />
          </div>
          
          <input style={inputStyle} placeholder="First Name" value={profile.first_name || ''} onChange={(e) => setProfile({...profile, first_name: e.target.value})} />
          <input style={inputStyle} placeholder="Last Name" value={profile.last_name || ''} onChange={(e) => setProfile({...profile, last_name: e.target.value})} />
          <input style={inputStyle} type="number" placeholder="Daily Limit" value={profile.daily_limit || ''} onChange={(e) => setProfile({...profile, daily_limit: Number(e.target.value)})} />
          
          <button style={saveBtn} onClick={updateProfile}><Save size={16} /> Save Changes</button>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <div onClick={handleLogout} style={{ ...menuItem, color: '#ef4444', fontWeight: 'bold' }}>Log Out</div>
      </div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', marginBottom: '12px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: 'white', boxSizing: 'border-box' };
const saveBtn = { width: '100%', padding: '12px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' };
const menuItem = { padding: '15px 0', borderBottom: '1px solid #111', cursor: 'pointer', textAlign: 'center' };

export default Profile;