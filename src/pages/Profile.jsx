import React, { useState, useEffect } from 'react';
import { User, Save, Edit2, X, Camera, Trash2, Upload } from 'lucide-react';
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
      const fileName = `${user.id}.${file.name.split('.').pop()}`;

      await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
      setProfile({ ...profile, avatar_url: data.publicUrl });
      setShowPhotoModal(false);
    } catch (error) { alert('Upload failed'); } finally { setUploading(false); }
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

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      {/* Profile Photo Area */}
      <div style={{ width: '100px', height: '100px', borderRadius: '50px', background: '#222', margin: '20px auto', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
           onClick={() => setShowPhotoModal(true)}>
        {profile.avatar_url ? <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={50} color="#10b981" />}
      </div>

      {/* Fullscreen Photo Modal */}
      {showPhotoModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <X size={30} style={{ position: 'absolute', top: 20, right: 20, cursor: 'pointer' }} onClick={() => setShowPhotoModal(false)} />
          <img src={profile.avatar_url || ''} style={{ maxWidth: '80%', borderRadius: '10px' }} alt="Large profile" />
          <div style={{ marginTop: 30, display: 'flex', gap: 20 }}>
            <label style={{ cursor: 'pointer', background: '#10b981', padding: '10px 20px', borderRadius: '8px' }}><Upload size={16} /> Change <input type="file" onChange={uploadAvatar} style={{ display: 'none' }} /></label>
            <button onClick={removeAvatar} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px' }}><Trash2 size={16} /> Remove</button>
          </div>
        </div>
      )}

      {/* Name and Edit logic remains same ... */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <h2 style={{ margin: 0 }}>{`${profile.first_name || ''} ${profile.last_name || ''}`}</h2>
        {!isEditing && <Edit2 size={18} color="#10b981" style={{ cursor: 'pointer' }} onClick={() => setIsEditing(true)} />}
      </div>
      
      {isEditing && (
        <div style={{ marginTop: '20px' }}>
          <input style={inputStyle} value={profile.first_name} onChange={(e) => setProfile({...profile, first_name: e.target.value})} />
          <input style={inputStyle} value={profile.last_name} onChange={(e) => setProfile({...profile, last_name: e.target.value})} />
          <button style={saveBtn} onClick={updateProfile}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', marginBottom: '12px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: 'white', boxSizing: 'border-box' };
const saveBtn = { width: '100%', padding: '12px', background: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' };

export default Profile;