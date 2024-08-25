import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.configDotenv({
  path: './.env',
});

export const env = z
  .object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production']),
    DOMAIN: z.string(),
  })
  .parse(process.env);
