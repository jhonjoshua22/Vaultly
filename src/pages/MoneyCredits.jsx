import React, { useState } from "react";

const MoneyCredits = ({
  balances,
  setBalances
}) => {

  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState("");

  const updateBalance = () => {
    if (!editing) return;

    setBalances({
      ...balances,
      [editing]: Number(value)
    });

    setEditing(null);
    setValue("");
  };

  const moneyTotal =
    balances.gcash +
    balances.cash +
    balances.bdoSavings;

  const creditTotal =
    balances.bdoCredit +
    balances.eastwestCredit;

  const netTotal = moneyTotal - creditTotal;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Money & Credits Balance</h3>

      {/* MONEY */}
      <p style={sectionTitle}>My Money</p>

      <div style={grid}>
        {["gcash", "cash", "bdoSavings"].map((acc) => (
          <div
            key={acc}
            style={card}
            onClick={() => {
              setEditing(acc);
              setValue(balances[acc]);
            }}
          >
            <p style={cardTitle}>{acc}</p>
            <h3>${balances[acc]}</h3>
          </div>
        ))}
      </div>

      {/* CREDIT */}
      <p style={{ ...sectionTitle, marginTop: "20px" }}>
        Credit Balance
      </p>

      <div style={grid}>
        <div style={creditCard}>
          <p style={cardTitle}>BDO Credit</p>
          <h3>${balances.bdoCredit}</h3>
        </div>

        <div style={creditCard}>
          <p style={cardTitle}>Eastwest Credit</p>
          <h3>${balances.eastwestCredit}</h3>
        </div>
      </div>

      {/* TOTAL */}
      <div style={totalCard}>
        <p>Total Money</p>
        <h2>${netTotal}</h2>
        <small>
          (${moneyTotal} money - ${creditTotal} credit)
        </small>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Edit {editing}</h3>

            <input
              style={input}
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <button style={saveBtn} onClick={updateBalance}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px"
};

const card = {
  background: "#111",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #222",
  cursor: "pointer"
};

const creditCard = {
  background: "#1f2937",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #374151"
};

const totalCard = {
  marginTop: "20px",
  background: "#064e3b",
  padding: "18px",
  borderRadius: "14px",
  textAlign: "center"
};

const cardTitle = {
  fontSize: "0.8rem",
  opacity: 0.7
};

const sectionTitle = {
  fontSize: "0.8rem",
  opacity: 0.6
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "#111",
  padding: "20px",
  borderRadius: "16px",
  width: "300px"
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  marginBottom: "15px",
  background: "#000",
  border: "1px solid #333",
  color: "white",
  borderRadius: "8px"
};

const saveBtn = {
  background: "#10b981",
  border: "none",
  padding: "10px",
  width: "100%",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer"
};

export default MoneyCredits;