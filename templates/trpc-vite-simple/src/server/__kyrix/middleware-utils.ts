import { IncomingMessage, ServerResponse } from 'http';

export type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: any) => void
) => void;

// To chain middlewares
export const execMiddlewares = (
  req: IncomingMessage,
  res: ServerResponse,
  middlewares: Middleware[],
  next: (req: IncomingMessage, res: ServerResponse) => void
) => {
  const nextMiddleware = middlewares.shift();

  if (nextMiddleware) {
    nextMiddleware(req, res, (err) => {
      if (err) {
        console.error('Middleware error:', err);
        res.statusCode = 500;
        return res.end('Internal Server Error');
      } else {
        return execMiddlewares(req, res, middlewares, next);
      }
    });
  } else {
    return next(req, res);
  }
};
