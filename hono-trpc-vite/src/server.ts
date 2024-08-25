import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

export const createServer = async () => {
  const app = new Hono();

  app.use(logger());
  app.use(cors());

  app.get("/healthcheck", (c) => c.json("OK"));

  return app;
};
