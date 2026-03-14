import React from 'react';
import { User } from 'lucide-react';

const Profile = ({ userName }) => {
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
        <div style={{ ...menuItem, color: '#ef4444', border: 'none' }}>Log Out</div>
      </div>
    </div>
  );
};

const menuItem = { padding: '15px 0', borderBottom: '1px solid #111', cursor: 'pointer' };

export default Profile;