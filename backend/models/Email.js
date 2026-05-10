import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    subject: String,
    body: String,
    recipients: [String],
    status: String
  },
  { timestamps: true }
);

export default mongoose.model("Email", emailSchema);