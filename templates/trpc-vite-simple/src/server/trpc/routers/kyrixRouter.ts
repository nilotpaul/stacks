import { publicProcedure, router } from '../trpc';
import { handleSSR } from '../../__kyrix/ssr-utils';

export const kyrixRouter = router({
  ssr: publicProcedure.query(async ({ ctx }) => {
    if (ctx.req.url === '/') {
      return handleSSR({
        meta: {
          title: 'Home',
          description: 'Home page desc',
        },
        initialData: [{ name: 'Paul', age: 20 }],
      });
    }
  }),
});
