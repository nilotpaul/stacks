import { Handler } from 'hono';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { testRouter } from './routers/testRouter';
import { createTRPCContext, router } from './trpc';
import { logger } from '../config/logger';

export const appRouter = router({
  tests: testRouter,
});

export const trpcHandler: Handler = (c) =>
  fetchRequestHandler({
    endpoint: '/api/v1/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: (opts) =>
      createTRPCContext({
        ...opts,
        hono: c,
      }),
    batching: { enabled: true },
    onError: (opts) => logger.error(`HTTP TRPC ERROR ${opts.error.message}`),
  });

export type AppRouter = typeof appRouter;
