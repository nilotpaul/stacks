import { initTRPC } from '@trpc/server';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { serverEnv as env } from '../env';
import { z } from 'zod';
import superJSON from 'superjson';

export const createTRPCContext = async ({ req, res }: CreateHTTPContextOptions) => {
  return { req, res };
};

const t = initTRPC.context<TRPCContext>().create({
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Stack trace is removed in production to avoid leaking potential sensitive information.
        stack: env.NODE_ENV !== 'production' ? shape.data.stack : undefined,
        zodError: error.cause instanceof z.ZodError ? error.cause.flatten() : null,
      },
    };
  },
  isDev: env.NODE_ENV !== 'production',
  transformer: superJSON,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
