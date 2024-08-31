import { builtinModules } from 'module';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        server: path.resolve(__dirname, 'src/server/__kyrix/main.ts'), // Server entry point
      },
      output: {
        format: 'cjs',
        dir: path.resolve(__dirname, 'dist'),
      },
    },
    ssr: true,
    copyPublicDir: false,
  },
  ssr: {
    external: [
      ...builtinModules,
      ...builtinModules.map((m) => `node:${m}`),
      'vite',
      '@vitejs/plugin-react-swc',
    ],
    noExternal: process.env.NODE_ENV === 'production' ? [/.*/] : [],
  },
});
