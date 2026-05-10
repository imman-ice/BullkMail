import React, { useState } from "react";
import EmailForm from "./EmailForm";
import History from "./History";

function App() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1 style={{ color: "darkblue" }}>Bulk Mail App</h1>

      <button
        onClick={() => setShowHistory(!showHistory)}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          cursor: "pointer",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        {showHistory ? "Send Email" : "View History"}
      </button>

      {showHistory ? <History /> : <EmailForm />}
    </div>
  );
}

export default App;