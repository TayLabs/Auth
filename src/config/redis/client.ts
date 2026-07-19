import env from "@/types/env";
import Redis from "ioredis";

const redisClient = new Redis(env.REDIS_URI, {
  maxRetriesPerRequest: 3,
  username: env.REDIS_CREDENTIALS.split(":")[0],
  password: env.REDIS_CREDENTIALS.split(":")[1],
});

redisClient.on("connect", () => {
  console.log("📻 Connected to Redis");
});

redisClient.on("error", async (err) => {
  console.error("🛑 Redis connection error:", err);
  await redisClient.quit(); // Prevents multiple connection attempts

  // Only exit in non-test environments
  if (process.env.NODE_ENV !== "test") {
    process.exit(1);
  }
});

export default redisClient;
