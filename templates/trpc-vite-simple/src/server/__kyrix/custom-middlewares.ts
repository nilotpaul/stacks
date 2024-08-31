import path from 'path';
import fs from 'fs/promises';

import { convertMetadataToHTML, type Metadata } from './metadata';
import { serverEnv } from '../env';
import { Middleware } from './middleware-utils';

export const logger: Middleware = (req, res, next) => {
  const url = new URL(`http://localhost:${serverEnv.SERVER_PORT}${req.url || '/'}`);
  console.log(`Incoming Request on ${decodeURI(url.pathname)} ${res.statusCode}`);
  return next();
};

export const serveBuild =
  ({
    root,
    isProduction,
    ssrData: data,
  }: {
    root: string;
    isProduction: boolean;
    ssrData?: { initialData?: any; meta: Metadata };
  }): Middleware =>
  async (req, res) => {
    try {
      const requestedPath = path.join(root, 'dist', 'client', req.url ?? 'index.html');
      const file = await fs.readFile(requestedPath, {
        encoding: 'utf-8',
      });

      const fileExt = path.extname(requestedPath);
      switch (fileExt) {
        case '.html':
          res.setHeader('Content-Type', 'text/html');
          break;
        case '.css':
          res.setHeader('Content-Type', 'text/css');
          break;
        case '.js':
          res.setHeader('Content-Type', 'text/javascript');
          break;
        default:
      }

      res.end(file);
    } catch {
      try {
        const indexHTML = await fs.readFile(path.join(root, 'dist', 'client', 'index.html'), {
          encoding: 'utf-8',
        });

        let modifiledIndexHTML: string | undefined;
        if (data) {
          const headHTML = convertMetadataToHTML(data.meta);
          modifiledIndexHTML = indexHTML.replace('<!-- app-meta -->', headHTML).replace(
            '<!-- app-context -->',
            `<script>window.__KYRIX_CONTEXT = ${JSON.stringify({
              url: req.url ?? '/',
              data: data.initialData,
            })}</script>`
          );
        }

        res.setHeader('Content-Type', 'text/html');
        res.end(modifiledIndexHTML);
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end(`Internal Server Error ${!isProduction ? err : undefined}`);
      }
    }
  };
