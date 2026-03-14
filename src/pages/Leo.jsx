import React, { useState, useEffect, useRef } from "react";
import { Send, Brain, TrendingUp, Wallet, Sparkles } from "lucide-react";

const Leo = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { role: "leo", text: "Hi! I'm Leo. Ask me anything about your spending." }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat([...chat, { role: "user", text: message }, { role: "leo", text: "Analyzing your budget..." }]);
    setMessage("");
  };

  return (
    <div style={mobilePageStyle}>
      {/* Primary Interaction: Chat at the Top */}
      <div style={chatContainerStyle}>
        <div style={chatHeaderStyle}>
          <Sparkles size={16} color="#10b981" /> <span>Leo AI Assistant</span>
        </div>
        <div style={chatMessagesStyle}>
          {chat.map((msg, i) => (
            <div key={i} style={msg.role === "leo" ? leoMsgStyle : userMsgStyle}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={inputAreaStyle}>
          <input style={inputStyle} placeholder="Ask about your budget..." value={message} onChange={(e) => setMessage(e.target.value)} />
          <button style={sendBtnStyle} onClick={sendMessage}><Send size={18} /></button>
        </div>
      </div>

      {/* Secondary Information: Insights & Stats */}
      <div style={dashboardSectionStyle}>
        <div style={cardStyle}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
            <Brain size={18} color="#10b981" /> <strong>Leo Insight</strong>
          </div>
          <p style={{fontSize: '0.85rem', opacity: 0.8}}>Most spending today was on <strong>Food</strong>. You're trending +12% higher than yesterday.</p>
        </div>

        <div style={statsRowStyle}>
          <div style={miniStatStyle}><Wallet size={16} color="#10b981" /> <span>Spent</span> <strong>$40</strong></div>
          <div style={miniStatStyle}><TrendingUp size={16} color="#10b981" /> <span>Trend</span> <strong style={{color: '#ef4444'}}>+12%</strong></div>
        </div>
      </div>
    </div>
  );
};

/* Mobile-First Optimized Styles */
const mobilePageStyle = { display: 'flex', flexDirection: 'column', height: '100vh', padding: '10px', gap: '15px' };
const chatContainerStyle = { flex: 1, background: '#111', borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #222' };
const chatHeaderStyle = { padding: '15px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 'bold' };
const chatMessagesStyle = { flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' };
const leoMsgStyle = { background: '#1a1a1a', padding: '10px 14px', borderRadius: '15px 15px 15px 4px', fontSize: '0.85rem', maxWidth: '85%' };
const userMsgStyle = { background: '#10b981', color: '#000', padding: '10px 14px', borderRadius: '15px 15px 4px 15px', fontSize: '0.85rem', maxWidth: '85%', alignSelf: 'flex-end' };
const inputAreaStyle = { display: 'flex', borderTop: '1px solid #222', padding: '5px' };
const inputStyle = { flex: 1, padding: '12px', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.9rem' };
const sendBtnStyle = { background: '#10b981', border: 'none', borderRadius: '10px', padding: '0 15px', cursor: 'pointer' };
const dashboardSectionStyle = { display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '80px' };
const cardStyle = { background: '#111', padding: '15px', borderRadius: '16px', border: '1px solid #222' };
const statsRowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' };
const miniStatStyle = { background: '#111', padding: '15px', borderRadius: '16px', border: '1px solid #222', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.8rem' };

export default Leo;