import { env } from '../config/env';

export const isProd = () => {
  return env.NODE_ENV === 'production';
};
