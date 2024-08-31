import type { InlineConfig, ViteDevServer } from 'vite';
import { serverEnv } from '../env';

export const viteConfig: InlineConfig = {
  server: {
    middlewareMode: true,
    port: serverEnv.SERVER_PORT,
    hmr: false,
  },
  appType: 'custom',
  logLevel: 'info',
};

export const createViteServer = async ({
  root,
  base,
  isProduction,
}: {
  root: string;
  base: string;
  isProduction: boolean;
}): Promise<ViteDevServer | undefined> => {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const react = (await import('@vitejs/plugin-react-swc')).default;
    return await createServer({
      ...viteConfig,
      root,
      base,
      plugins: [react()],
    });
  }
};
