import React from 'react';
import { Archive as ArchiveIcon } from 'lucide-react';

const Archive = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 'bold' }}>Archive</h2>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>Stored for long-term safety.</p>
      {[1, 2, 3].map(i => (
        <div key={i} style={listItemStyle}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <ArchiveIcon size={20} color="#666" />
            <div>
              <div style={{ fontWeight: '500' }}>Old_Tax_Return_202{i}.pdf</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>Archived on Jan {i}, 2026</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const listItemStyle = { padding: '15px', background: '#0a0a0a', borderRadius: '12px', marginBottom: '10px', borderBottom: '1px solid #111' };

export default Archive;