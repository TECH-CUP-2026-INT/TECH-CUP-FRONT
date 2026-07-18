import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      // ── Payments: directo a AKS (no pasa por APIM) ──────────
      '/payment-orders': {
        target: 'http://20.12.84.133',
        changeOrigin: true,
      },
      // ── Todos los microservicios via Azure APIM ─────────────
      '/identity': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/api': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/users': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/teams': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/communication': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/communications': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/matches': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/tournaments': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/logistics': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/payments': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/players': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/audit': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
    },
  },
})
