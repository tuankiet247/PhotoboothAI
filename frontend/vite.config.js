import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Tìm hoặc tạo chứng chỉ tự ký cho dev
const https = {
  key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'localhost-cert.pem')),
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    https,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
