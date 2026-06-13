import { Worker } from "bullmq";
import { connection } from "./queue.js";

const worker = new Worker(
  "emails",
  async (job) => {
    console.log("Processing email job", job.id, job.name, job.data);
    (await new Promise((resolve) => setTimeout(resolve, 1500)),
      console.log("Email Job completed", job.id, job.name, job.data));
  },
  { connection },
);


worker.on("completed", (job) => {
    console.log(`Email Job has completed!`, job.id, job.name, job.data);
});

worker.on("failed", (job, err) => {
    console.log(`Email Job ${job.id} has failed with error ${err}`, job.name, job.data);
});