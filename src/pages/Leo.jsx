import React, { useState, useEffect, useRef } from "react";
import { Send, Brain, TrendingUp, Wallet, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase"; // Ensure this path is correct

const Leo = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatAndStats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const loadChatAndStats = async () => {
    // 1. Fetch Chat History
    const { data: chatData } = await supabase
      .from('chat_history')
      .select('*')
      .order('created_at', { ascending: true });
    if (chatData) setChat(chatData.map(c => ({ role: c.role, text: c.message })));

    // 2. Fetch Expenses for Insights
    const { data: expenses } = await supabase.from('expenses').select('amount');
    const total = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
    setTotalSpent(total);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage("");
    
    // Add User message to UI and DB
    setChat(prev => [...prev, { role: "user", text: userMsg }]);
    await supabase.from('chat_history').insert([{ role: 'user', message: userMsg }]);

    // Simulate Leo AI response
    const leoResponse = "I've analyzed your spending. You're doing great keeping to your budget today!";
    setChat(prev => [...prev, { role: "leo", text: leoResponse }]);
    await supabase.from('chat_history').insert([{ role: 'leo', message: leoResponse }]);
  };

  return (
    <div style={mobilePageStyle}>
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

      <div style={dashboardSectionStyle}>
        <div style={cardStyle}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
            <Brain size={18} color="#10b981" /> <strong>Leo Insight</strong>
          </div>
          <p style={{fontSize: '0.85rem', opacity: 0.8}}>Total expenditure tracked: <strong>₱{totalSpent}</strong>.</p>
        </div>
        <div style={statsRowStyle}>
          <div style={miniStatStyle}><Wallet size={16} color="#10b981" /> <span>Spent</span> <strong>₱{totalSpent}</strong></div>
          <div style={miniStatStyle}><TrendingUp size={16} color="#10b981" /> <span>Trend</span> <strong>Active</strong></div>
        </div>
      </div>
    </div>
  );
};

/* Styles remain same as your previous version */
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