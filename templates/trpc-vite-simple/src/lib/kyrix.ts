import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../server/trpc/root';

export const trpc = createTRPCReact<AppRouter>();

export const getRouteData = <T>() => {
  // @ts-expect-error window is not typed with context.
  const context = window.__KYRIX_CONTEXT;
  return context.data as T;
};
