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
        headers: {
          'Ocp-Apim-Subscription-Key': '4eff9bdd419b49308dc37fd491741c47',
        },
      },
      '/api': {
        target: 'https://techapi.azure-api.net',
        changeOrigin: true,
        headers: {
          'Ocp-Apim-Subscription-Key': '4eff9bdd419b49308dc37fd491741c47',
        },
      },
    },
  },
})
