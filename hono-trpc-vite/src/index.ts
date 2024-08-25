import { serve } from "@hono/node-server";
import { createServer } from "./server";

async function main() {
  try {
    const server = await createServer();

    serve({
      fetch: server.fetch,
      hostname: "localhost",
      port: 3000,
    });
  } catch (err) {
    console.error("Shutting down server", err);
    process.exit(1);
  }
}

main();
