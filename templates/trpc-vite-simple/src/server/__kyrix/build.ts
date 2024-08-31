import { build } from 'vite';
import { viteConfig } from './vite-utils';
import { serverEnv } from '../env';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

// Vite generates all the static files needed to run our react application.
// This step is the normal build process like any other vite SPA application.
async function clientBuild() {
  try {
    await build({
      ...viteConfig,
      build: {
        outDir: path.resolve(process.cwd(), 'dist', 'client'),
      },
      root: process.cwd(),
      base: serverEnv.BASE || '/',
      plugins: [react()],
    });

    console.log('Client Build process finished, exiting...');
    process.exit(0);
  } catch (err) {
    console.error('Client Build process failed, exiting...', err);
    process.exit(1);
  }
}

clientBuild();
