import { startServer } from "./server.js";

startServer().catch((error) => {
  console.error("Database/server startup failed:", error.message);
  process.exit(1);
});
