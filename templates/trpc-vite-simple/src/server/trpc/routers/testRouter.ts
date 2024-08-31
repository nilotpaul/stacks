import { publicProcedure, router } from '../trpc';

export const testRouter = router({
  test: publicProcedure.query(() => 'Hello from TRPC Server'),
  get: publicProcedure.query(() => [{ name: 'Paul', age: 20 }]),
});
