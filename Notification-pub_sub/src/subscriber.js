import Redis from "ioredis";
const subscriber = new Redis("redis://localhost:6379");

subscriber.subscribe("notifications", (err) => {
  if (err) {
    console.error("Failed to subscribe: %s", err.message);
    return;
  }
  console.log("Subscribed successfully!");
});

subscriber.on("message", (channel, message) => {
  console.log("Received message on  ", channel, ":", JSON.parse(message));
});
