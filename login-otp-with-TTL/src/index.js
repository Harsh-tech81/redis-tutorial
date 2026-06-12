import mongoose from "mongoose";
import Redis from "ioredis";
import express from "express";

const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");
function otpKey(phone) {
  return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(otpKey(phone), otp, "EX", 30); // OTP expires in 30 seconds
  res.json({ message: "OTP sent successfully", otp });
});

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;
  const storedOtp = await redis.get(otpKey(phone));
  if (!storedOtp) {
    return res.status(400).json({ message: "OTP expired or not found" });
  }
  if (storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  await redis.del(otpKey(phone));
  res.json({ message: "OTP verified successfully" });
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;
  const ttl = await redis.ttl(otpKey(phone));  // if it expires then returns -2 
  res.json({ ttl });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
