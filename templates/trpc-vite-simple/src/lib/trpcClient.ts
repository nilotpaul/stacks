import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../server/trpc/root';

export const trpc = createTRPCReact<AppRouter>();
