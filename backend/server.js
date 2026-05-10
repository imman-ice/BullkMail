import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import Email from "./models/Email.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

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

    await Email.create({
      subject,
      body,
      recipients,
      status: "Success"
    });

    res.json({ message: "Email Sent Successfully!" });
  } catch (error) {
    console.log("Email Error:", error);

    await Email.create({
      subject,
      body,
      recipients,
      status: "Failed"
    });

    res.status(500).json({ message: "Failed to send email!" });
  }
});

// Email History API
app.get("/history", async (req, res) => {
  const history = await Email.find().sort({ createdAt: -1 });
  res.json(history);
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});