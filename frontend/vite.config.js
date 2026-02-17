import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://shop-rahhalah.vercel.app', // Deployed Backend
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "localhost"
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
