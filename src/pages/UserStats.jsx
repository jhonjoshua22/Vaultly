const UserStats = ({ profile, logs, filterDate, onDateChange }) => {
  const totalSpent = logs.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const remaining = profile.dailyLimit - totalSpent;
  return (
    <div className="card">
      <p>Hi <strong>{profile.first_name}</strong>, ${remaining > 0 ? remaining : 0} left.</p>
      <h1>${totalSpent}</h1>
      <input type="date" value={filterDate} onChange={(e) => onDateChange(e.target.value)} />
    </div>
  );
};
export default UserStats;