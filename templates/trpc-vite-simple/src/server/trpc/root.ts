import { testRouter } from './routers/testRouter';
import { router } from './trpc';

export const appRouter = router({
  tests: testRouter,
});

export type AppRouter = typeof appRouter;
