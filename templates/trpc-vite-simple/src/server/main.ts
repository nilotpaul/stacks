import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { appRouter } from './trpc/root';
import { createTRPCContext } from './trpc/trpc';
import http, { IncomingMessage, ServerResponse } from 'http';
import { serverEnv as env } from './env';
import cors from 'cors';

import fs from 'fs/promises';
import path from 'path';

type Middleware = (req: IncomingMessage, res: ServerResponse, next: (err?: any) => void) => void;

const root = process.cwd();

const trpcHandler = createHTTPHandler({
  router: appRouter,
  createContext: createTRPCContext,
  batching: { enabled: true },
  onError: ({ error }) => console.error(`HTTP TRPC ERROR ${error.message}`),
});

// To chain middlewares
const execMiddlewares = (
  req: IncomingMessage,
  res: ServerResponse,
  middlewares: Middleware[],
  next: (req: IncomingMessage, res: ServerResponse) => void
) => {
  const nextMiddleware = middlewares.shift();

  if (nextMiddleware) {
    nextMiddleware(req, res, (err) => {
      if (err) {
        console.error('Middleware error:', err);
        res.statusCode = 500;
        return res.end('Internal Server Error');
      } else {
        execMiddlewares(req, res, middlewares, next);
      }
    });
  } else {
    next(req, res);
  }
};

const logger: Middleware = (req, res, next) => {
  const url = new URL(`http://localhost:${env.SERVER_PORT}${req.url || '/'}`);
  console.log(`Incoming Request on ${decodeURI(url.pathname)} ${res.statusCode}`);
  return next();
};

const corsMiddleware = cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true,
}) as Middleware;

const serveStatic: Middleware = async (req, res) => {
  try {
    const requestedPath = path.join(root, 'dist', 'client', req.url || 'index.html');
    const file = await fs.readFile(requestedPath, {
      encoding: 'utf-8',
    });

    const fileExt = path.extname(requestedPath);
    switch (fileExt) {
      case '.html':
        res.setHeader('Content-Type', 'text/html');
        break;
      case '.css':
        res.setHeader('Content-Type', 'text/css');
        break;
      case '.js':
        res.setHeader('Content-Type', 'text/javascript');
        break;
      default:
    }
    res.end(file);
  } catch {
    // console.info('File not found, serving index.html...');
    try {
      const file = await fs.readFile(path.join(root, 'dist', 'client', 'index.html'), {
        encoding: 'utf-8',
      });
      res.setHeader('Content-Type', 'text/html');
      res.end(file);
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }
};

http
  .createServer((req, res) => {
    execMiddlewares(req, res, [logger, corsMiddleware], async (req, res) => {
      if (req.url?.startsWith('/api/trpc') || env.NODE_ENV !== 'production') {
        req.url = req.url?.replace('/api/trpc', '');
        return trpcHandler(req, res);
      }
      if (env.NODE_ENV === 'production') {
        return serveStatic(req, res, () => undefined);
      }
    });
  })
  .listen(env.SERVER_PORT, 'localhost', () => {
    console.log(`Server running on http://localhost:${env.SERVER_PORT}\n`);
  });
