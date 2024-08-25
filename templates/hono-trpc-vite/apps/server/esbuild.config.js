import { build } from 'esbuild';

const b = () =>
  build({
    bundle: true,
    entryPoints: ['./src/index.ts'],
    platform: 'node',
    outfile: './dist/index.cjs',
    format: 'cjs',
    tsconfig: 'tsconfig.json',
    loader: { '.node': 'file' },
    minify: true,
    external: ['pino'],
  });

Promise.all([b()]);
