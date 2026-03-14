import React from 'react';
import { Image, FileText, File, Plus, Search } from 'lucide-react';

const Leo = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 'bold' }}>Your leo</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        <div style={leoActionStyle}><Image size={24} /> <span>Photos</span></div>
        <div style={leoActionStyle}><FileText size={24} /> <span>Texts</span></div>
        <div style={leoActionStyle}><File size={24} /> <span>Files</span></div>
        <div style={{ ...leoActionStyle, border: '1px dashed #10b981', color: '#10b981' }}>
          <Plus size={24} /> <span>Add New</span>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '10px', top: '10px', color: '#666' }} size={18} />
        <input type="text" placeholder="Search your Leo..." style={searchStyle} />
      </div>
    </div>
  );
};

const leoActionStyle = { background: '#111', height: '90px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', border: '1px solid #222', fontSize: '0.85rem' };
const searchStyle = { width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', background: '#111', border: '1px solid #222', color: '#fff', outline: 'none', boxSizing: 'border-box' };

export default Leo;