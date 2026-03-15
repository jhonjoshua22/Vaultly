import React from "react";

const FriendList = ({ friendsLogs }) => {
  const notifyFriend = (name) => alert(`Message sent to ${name}: Hey! Keep an eye on your budget today! 💸`);
  return (
    <>
      <h3 style={{ marginTop: "40px" }}>Friends' Activity</h3>
      {friendsLogs.map((log) => (
        <div key={log.id} style={logItemStyle}>
          <div style={logHeaderStyle}><span>Friend: {log.description}</span><strong>${log.amount}</strong></div>
          <button onClick={() => notifyFriend(log.description)} style={{ ...addBtn, marginTop: '10px', background: '#3b82f6' }}>Notify Friend</button>
        </div>
      ))}
    </>
  );
};