import React, { useState, useEffect } from 'react';
import { User, Save, Edit2, X, Upload, Trash2, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Profile = () => {
  const [profile, setProfile] = useState({ first_name: '', last_name: '', daily_limit: 150, avatar_url: '' });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('first_name, last_name, daily_limit, avatar_url')
      .eq('id', user.id)
      .single();

    if (data) {
      const googleAvatar = user.user_metadata?.avatar_url;
      setProfile({ ...data, avatar_url: data.avatar_url || googleAvatar || '' });
    }
    setLoading(false);
  };

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      // Ensure the path is explicitly 'avatars/' + filename
      const filePath = `avatars/${user.id}.png`; 

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      const newUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
      
      await supabase.from('profiles').update({ avatar_url: newUrl }).eq('id', user.id);
      setProfile({ ...profile, avatar_url: newUrl });
      setShowPhotoModal(false);
    } catch (error) { 
      alert('Upload failed: ' + error.message); 
    } finally { setUploading(false); }
  };

  const removeAvatar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').update({ avatar_url: '' }).eq('id', user.id);
    setProfile({ ...profile, avatar_url: '' });
    setShowPhotoModal(false);
  };

  const updateProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').update({ 
        first_name: profile.first_name, 
        last_name: profile.last_name, 
        daily_limit: profile.daily_limit 
    }).eq('id', user.id);
    setIsEditing(false);
    alert("Profile updated!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', color: 'white' }}>
      
      {/* Profile Photo Area */}
      <div style={{ width: '100px', height: '100px', borderRadius: '50px', background: '#222', margin: '20px auto', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
           onClick={() => setShowPhotoModal(true)}>
        {profile.avatar_url ? <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={50} color="#10b981" />}
      </div>

      {/* Fullscreen Photo Modal */}
      {showPhotoModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <X size={30} style={{ position: 'absolute', top: 20, right: 20, cursor: 'pointer' }} onClick={() => setShowPhotoModal(false)} />
          <img src={profile.avatar_url || ''} style={{ maxWidth: '90%', maxHeight: '60%', borderRadius: '15px', objectFit: 'contain' }} alt="Large profile" />
          
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 15, width: '80%', maxWidth: '300px' }}>
            <label style={{ cursor: 'pointer', background: '#10b981', padding: '12px', borderRadius: '8px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><Upload size={18} /> Change Photo <input type="file" onChange={uploadAvatar} style={{ display: 'none' }} /></label>
            <button onClick={removeAvatar} style={{ background: '#333', border: 'none', color: '#ff4444', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><Trash2 size={18} /> Remove Photo</button>
          </div>
        </div>
      )}

      {/* Name and Edit logic */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <h2 style={{ margin: 0 }}>{`${profile.first_name || ''} ${profile.last_name || ''}`}</h2>
        {!isEditing && <Edit2 size={18} color="#10b981" style={{ cursor: 'pointer' }} onClick={() => setIsEditing(true)} />}
      </div>
      
      {isEditing && (
        <div style={{ marginTop: '20px' }}>
          <input style={inputStyle} placeholder="First Name" value={profile.first_name} onChange={(e) => setProfile({...profile, first_name: e.target.value})} />
          <input style={inputStyle} placeholder="Last Name" value={profile.last_name} onChange={(e) => setProfile({...profile, last_name: e.target.value})} />
          <input style={inputStyle} type="number" placeholder="Daily Limit" value={profile.daily_limit} onChange={(e) => setProfile({...profile, daily_limit: Number(e.target.value)})} />
          <button style={saveBtn} onClick={updateProfile}>Save Changes</button>
        </div>
      )}

      {/* Logout button brought back */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <div onClick={handleLogout} style={{ ...menuItem, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <LogOut size={18} /> Log Out
        </div>
      </div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', marginBottom: '12px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: 'white', boxSizing: 'border-box' };
const saveBtn = { width: '100%', padding: '12px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const menuItem = { padding: '15px 0' };

export default Profile;