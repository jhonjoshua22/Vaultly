import React from "react";

const FriendList = ({ friendsLogs }) => {
  const notifyFriend = (name) => {
    alert(`Message sent to ${name}: Keep an eye on your budget! 💸`);
  };

  return (
    <>
      <h3 style={{ marginTop: "40px" }}>Friends' Activity</h3>

      {friendsLogs.map((log) => (
        <div key={log.id} style={logItemStyle}>
          <div style={logHeaderStyle}>
            <span>Friend: {log.friendships?.friend_name || "Unknown"}</span>
            <strong>₱{log.amount}</strong>
          </div>

          <button
            onClick={() => notifyFriend(log.friendships?.friend_name)}
            style={notifyBtn}
          >
            Notify Friend
          </button>
        </div>
      ))}

    </>
  );
};

const logItemStyle = {
  background: "#111",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #222",
  marginBottom: "10px",
};
const logHeaderStyle = { display: "flex", justifyContent: "space-between" };
const notifyBtn = {
  marginTop: "10px",
  background: "#3b82f6",
  border: "none",
  color: "white",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default FriendList;