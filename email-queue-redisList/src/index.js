import Redis from "ioredis";
import express from "express";

const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

app.post("/emails", async (req, res) => {
  const job={
    to: req.body.to,
    subject: req.body.subject || "No Subject",
    body: req.body.body || "No content",
    createdAt: new Date().toISOString()
  }
  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  res.json({queued : true, job});
});

app.get("/emails/process-one", async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_KEY);
    if (!rawJob) {
      return res.status(404).json({ message: "No Jobs in queue" });
    }
    const job = JSON.parse(rawJob);
    res.json({ message : "Email sent" ,job });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

