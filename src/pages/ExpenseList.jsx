import { Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";

const ExpenseList = ({ logs, setLogs }) => {
  const deleteLog = async (id) => {
    await supabase.from('expenses').delete().eq('id', id);
    setLogs(logs.filter((l) => l.id !== id));
  };
  return (
    <>
      <h3>Activity</h3>
      {logs.map((log) => (
        <div key={log.id} className="log-item">
          <span>{log.description}</span> <strong>${log.amount}</strong>
          <button className="btn-danger" onClick={() => deleteLog(log.id)}><Trash2 size={14} /></button>
        </div>
      ))}
    </>
  );
};
export default ExpenseList;