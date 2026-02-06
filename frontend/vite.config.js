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
        targets: ['Android >= 5', 'Chrome >= 37', 'iOS >= 9', 'Safari >= 9'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        modernPolyfills: true,
      }),
    ],
    build: {
      target: ['es2015', 'chrome37', 'safari9'],
      cssTarget: ['chrome37', 'safari9'],
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
