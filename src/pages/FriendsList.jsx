const FriendList = ({ friendsLogs }) => (
  <>
    <h3>Friends' Activity</h3>
    {friendsLogs.map((log) => (
      <div key={log.id} className="log-item">
        <span>Friend: {log.description}</span> <strong>${log.amount}</strong>
        <button className="btn-primary" style={{marginTop: '10px'}} onClick={() => alert("Notified!")}>Notify</button>
      </div>
    ))}
  </>
);
export default FriendList;