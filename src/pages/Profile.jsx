import React from 'react';
import { User } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Ensure this points to your client
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router

const Profile = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      // Redirect to login or home page after logout
      navigate('/'); 
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: '#222', margin: '40px auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <User size={40} color="#10b981" />
      </div>
      <h2 style={{ margin: 0 }}>{userName}</h2>
      <p style={{ color: '#666' }}>Premium Member</p>
      
      <div style={{ marginTop: '30px', textAlign: 'left' }}>
        <div style={menuItem}>Security Settings</div>
        <div style={menuItem}>Linked Devices</div>
        {/* Added the onClick handler here */}
        <div 
          onClick={handleLogout} 
          style={{ ...menuItem, color: '#ef4444', border: 'none', fontWeight: 'bold' }}
        >
          Log Out
        </div>
      </div>
    </div>
  );
};

const menuItem = { padding: '15px 0', borderBottom: '1px solid #111', cursor: 'pointer' };

export default Profile;