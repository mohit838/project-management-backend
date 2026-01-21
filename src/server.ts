import "dotenv/config";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});

function shutdown(signal: string) {
  console.log(`\n${signal} received and shutting down gracefully...`);

  server.close((err) => {
    if (err) {
      console.error("Error during server close:", err);
      process.exit(1);
    }

    console.log("HTTP server closed.");
    process.exit(0);
  });

  // Force shutdown if it hangs
  setTimeout(() => {
    console.error("Force shutdown (timeout).");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
