import React, { useState } from "react";
import axios from "axios";

function EmailForm() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();

    if (!subject || !body || !recipients) {
      setMessage("Please fill all fields!");
      return;
    }

    const emailList = recipients.split(",").map((email) => email.trim());

    try {
      const res = await axios.post("https://bulkmail-backend.onrender.com/send-email", {
        subject,
        body,
        recipients: emailList
      });

      setMessage(res.data.message);

      setSubject("");
      setBody("");
      setRecipients("");
    } catch (error) {
      setMessage("Failed to send email!");
    }
  };

  return (
    <div>
      <h2>Send Bulk Email</h2>

      <form onSubmit={handleSend}>
        <div style={{ marginBottom: "15px" }}>
          <label>Subject:</label>
          <br />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: "400px",
              padding: "10px",
              borderRadius: "5px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email Body:</label>
          <br />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="6"
            style={{
              width: "400px",
              padding: "10px",
              borderRadius: "5px"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Recipients Emails (comma separated):</label>
          <br />
          <textarea
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            rows="4"
            style={{
              width: "400px",
              padding: "10px",
              borderRadius: "5px"
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Send Email
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>{message}</p>
      )}
    </div>
  );
}

export default EmailForm;