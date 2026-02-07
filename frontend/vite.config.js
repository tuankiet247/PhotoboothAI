import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import fs from 'fs'
import path from 'path'

// Only load local HTTPS certs for the dev server. Avoid reading files during build/CI.
export default defineConfig(({ command }) => {
  const config = {
    plugins: [
      react(),
      legacy({
        targets: ['Android >= 6', 'Chrome >= 49', 'iOS >= 10', 'Safari >= 10'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        modernPolyfills: true,
      }),
    ],
    build: {
      target: ['es2015', 'chrome49', 'safari10'],
      cssTarget: ['chrome49', 'safari10'],
    },
    esbuild: {
      target: 'es2015',
    },
  };

  if (command === 'serve') {
    let httpsConfig = undefined;
    try {
      const keyPath = path.resolve(__dirname, 'localhost-key.pem');
      const certPath = path.resolve(__dirname, 'localhost-cert.pem');
      if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        httpsConfig = {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        };
      }
    } catch (err) {
      // If reading certs fails, fall back to plain HTTP for dev.
    }

    config.server = {
      port: 3000,
      ...(httpsConfig ? { https: httpsConfig } : {}),
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        }
      }
    };
  }

  return config;
});
