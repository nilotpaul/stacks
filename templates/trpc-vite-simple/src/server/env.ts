import { configDotenv } from 'dotenv';
import { z } from 'zod';

configDotenv({
  path: './.env',
});

export const serverEnv = z
  .object({
    NODE_ENV: z.enum(['development', 'production']),
    SERVER_PORT: z.coerce.number().nonnegative(),
  })
  .parse(process.env);
