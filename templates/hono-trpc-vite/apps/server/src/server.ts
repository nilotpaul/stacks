import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { secureHeaders } from 'hono/secure-headers';
import { HTTPException } from 'hono/http-exception';
import { serveStatic } from '@hono/node-server/serve-static';

import { logger } from 'hono/logger';
import { trpcHandler } from './trpc/root';
import { isProd } from './utils';

export const createServer = async () => {
  const app = new Hono();

  app.use(logger());
  app.onError((err, c) => {
    let status = 500;
    let e = 'Internal Server Error';
    if (err instanceof HTTPException) {
      status = err.status;
      e = err.message;
    }
    return c.json({ httpStatus: status, error: e });
  });
  app.use(
    cors({
      origin: ['http://localhost:5173'],
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      credentials: true,
    })
  );
  app.use(csrf());
  app.use(secureHeaders());

  app.get('/healthcheck', (c) => c.json('OK'));

  const api = app.basePath('/api/v1');

  api.use(trpcHandler);

  if (isProd()) {
    app.use('/*', (c, next) =>
      serveStatic({
        root: '.',
        path: './build',
        rewriteRequestPath: (path) => path + c.req.path,
      })(c, next)
    );
    app.get(
      '/*',
      serveStatic({
        root: '.',
        path: './build/index.html',
      })
    );
  }

  return app;
};