/// <reference types='vitest' />
import { defineConfig } from 'vite';
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import vuetifyPlugin from 'vite-plugin-vuetify';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/frontend',
  server: {
    port: 4200,
    host: 'localhost',
    fs: {
      allow: [path.resolve(__dirname, '../../')],
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    vue(),
    (typeof (vuetifyPlugin as any) === 'function'
      ? (vuetifyPlugin as any)
      : (vuetifyPlugin as any)?.default || undefined)?.({ autoImport: true }),
    nxCopyAssetsPlugin(['*.md', 'vercel.json']),
  ].filter(Boolean) as any,
  base: '/',
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    copyPublicDir: true,
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@frontend': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@components': path.resolve(__dirname, './src/components'),
      '@auth': path.resolve(__dirname, './src/features/auth'),
    },
  },
}));
