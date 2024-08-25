import { initTRPC } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { Context } from 'hono';
import { z } from 'zod';
import superjson from 'superjson';

import { isProd } from '../utils';

type TRPCContextOptions = FetchCreateContextFnOptions & {
  hono: Context;
};

export const createTRPCContext = async ({ hono, ...opts }: TRPCContextOptions) => {
  return {
    ...opts,
    hono,
  };
};

export const t = initTRPC.context<TRPCContext>().create({
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Stack trace is removed in production to avoid leaking potential sensitive information.
        stack: !isProd() ? shape.data.stack : undefined,
        zodError: error.cause instanceof z.ZodError ? error.cause.flatten() : null,
      },
    };
  },
  isDev: !isProd(),
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
