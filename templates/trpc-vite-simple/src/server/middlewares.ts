import { logger } from './__kyrix/custom-middlewares';
import type { Middleware } from './__kyrix/middleware-utils';

export const middlewareFactory: Middleware[] = [logger];
