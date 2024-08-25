import { publicProcedure, router } from '../trpc';

export const testRouter = router({
  hello: publicProcedure.query(() => 'Hello from trpc server'),
});
