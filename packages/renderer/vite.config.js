/* eslint-env node */

import {chrome} from '../../.electron-vendors.cache.json';
import {join} from 'path';
import {builtinModules} from 'module';
import vue from '@vitejs/plugin-vue';
import { transformAssetUrls } from '@quasar/vite-plugin';
import vueI18n from '@intlify/vite-plugin-vue-i18n';
// import vuetify from '@vuetify/vite-plugin';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  plugins: [
    vue({template: transformAssetUrls}),
    vueI18n({
      include: join(PACKAGE_ROOT, 'src', 'locales') + '/**',
    }),
  ],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: 'index.html',
      external: [
        ...builtinModules.flatMap(p => [p, `node:${p}`]),
      ],
        output:{
            manualChunks(id) {
              if (id.includes('node_modules')) {
                  return id.split('node_modules/')[1];
              }
              if(id.includes('renderer/src')) return id.split('renderer/src/')[1];
              if(id.includes('api/src')) return id.split('api/src/')[1];
          },
        },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  test: {
    environment: 'happy-dom',
  },
};

export default config;
