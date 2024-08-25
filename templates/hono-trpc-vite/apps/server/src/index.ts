import { serve } from '@hono/node-server';
import { createServer } from './server';
import { logger } from './config/logger';
import { env } from './config/env';
import { isProd } from './utils';

async function main() {
  try {
    const server = await createServer();

    logger.info(`Sever is running. Visit http://localhost:${env.PORT}`);

    serve({
      fetch: server.fetch,
      hostname: isProd() ? 'localhost' : env.DOMAIN, // Put your production domain here.
      port: env.PORT,
    });
  } catch (err) {
    console.error('Shutting down server', err);
    process.exit(1);
  }
}

main();
