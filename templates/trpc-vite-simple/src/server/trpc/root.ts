import { kyrixRouter } from './routers/kyrixRouter';

import { testRouter } from './routers/testRouter';
import { router } from './trpc';

export const appRouter = router({
  kyrixRouter,
  tests: testRouter,
});

export type AppRouter = typeof appRouter;
