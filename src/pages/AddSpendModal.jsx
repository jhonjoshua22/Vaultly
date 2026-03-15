import { useState } from "react";
import { supabase } from "../lib/supabase";

const AddSpendModal = ({ onClose, onSave }) => {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const addSpend = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('expenses').insert([{ amount, description: desc, user_id: user.id }]);
    onSave();
  };
  return (
    <div className="overlay">
      <div className="modal">
        <h3>Add Spend</h3>
        <input type="number" placeholder="Amount" onChange={e => setAmount(e.target.value)} />
        <input placeholder="Description" onChange={e => setDesc(e.target.value)} />
        <button className="btn-primary" onClick={addSpend}>Save</button>
      </div>
    </div>
  );
};
export default AddSpendModal;