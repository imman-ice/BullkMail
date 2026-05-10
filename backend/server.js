import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import Email from "./models/Email.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Test route (to check backend is running)
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// Send Email API
app.post("/send-email", async (req, res) => {
  const { subject, body, recipients } = req.body;

  if (!subject || !body || !recipients || recipients.length === 0) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: subject,
      text: body
    });

    // Save success record
    await Email.create({
      subject,
      body,
      recipients,
      status: "Success"
    });

    res.json({ message: "Email Sent Successfully!" });
  } catch (error) {
    console.log("Email Sending Error:", error);

    // Save failed record
    await Email.create({
      subject,
      body,
      recipients,
      status: "Failed"
    });

    res.status(500).json({ message: "Failed to send email!" });
  }
});

// History API
app.get("/history", async (req, res) => {
  try {
    const history = await Email.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history!" });
  }
});

// IMPORTANT: Render uses its own PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});