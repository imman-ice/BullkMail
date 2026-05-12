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
  .catch((err) => console.log("MongoDB Connection Error:", err.message));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// Send Email API
app.post("/send-email", async (req, res) => {
  console.log("SEND EMAIL API HIT:", req.body);

  const { subject, body, recipients } = req.body;

  if (!subject || !body || !recipients || recipients.length === 0) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    // SendGrid transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
      }
    });

    await transporter.verify();
    console.log("SendGrid SMTP Verified Successfully");

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // must be verified in SendGrid
      to: recipients,
      subject,
      text: body
    });

    // Save success record
    await Email.create({
      subject,
      body,
      recipients,
      status: "Success"
    });

    return res.json({ message: "Email Sent Successfully!" });
  } catch (error) {
    console.log("EMAIL ERROR FULL:", error);
    console.log("EMAIL ERROR MESSAGE:", error.message);

    // Save failed record
    if (mongoose.connection.readyState === 1) {
      await Email.create({
        subject,
        body,
        recipients,
        status: "Failed"
      });
    }

    return res.status(500).json({
      message: "Failed to send email!",
      error: error.message
    });
  }
});

// History API
app.get("/history", async (req, res) => {
  try {
    const history = await Email.find().sort({ createdAt: -1 });
    return res.json(history);
  } catch (error) {
    console.log("HISTORY ERROR:", error.message);
    return res.status(500).json({ message: "Failed to fetch history!" });
  }
});

// PORT (works for local + Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});