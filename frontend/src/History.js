import React, { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("https://bullkmail.onrender.com/history")
      .then((res) => setHistory(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>Email History</h2>

      {history.length === 0 ? (
        <p>No emails sent yet.</p>
      ) : (
        <div>
          {history.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid gray",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "5px"
              }}
            >
              <p>
                <b>Subject:</b> {item.subject}
              </p>

              <p>
                <b>Status:</b>{" "}
                <span
                  style={{
                    color: item.status === "Success" ? "green" : "red"
                  }}
                >
                  {item.status}
                </span>
              </p>

              <p>
                <b>Recipients:</b> {item.recipients.join(", ")}
              </p>

              <p>
                <b>Date:</b> {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;