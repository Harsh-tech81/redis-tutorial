import express from "express";
import { emailQueue } from "./queue.js";
const app = express();
app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  const job = await emailQueue.add(
    "send-welcome-email",
    {
      to: req.body.to,
      name: req.body.name || "Learner",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  );
  res.json({ message: "Welcome email job has been added to the queue", jobId: job.id });
});

app.get("/welcome-email/:id", async (req, res) => {
  const job = await emailQueue.getJob(req.params.id);
  res.json({ job });
});


app.listen(3000, () => {
  console.log("The server is starting on the PORT 3000");
});
