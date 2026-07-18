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
      '/payment-orders': {
        target: 'http://20.12.84.133',
        changeOrigin: true,
      },
      '/identity': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/api/v1/Tournament': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/api/v1/Partidos': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/teams/api/v1': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/api/v1/Statistics': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/api/v1/Logistic': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/communications': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/users/api/v1': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
      '/api/v1/Users': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
      },
    },
  },
})
