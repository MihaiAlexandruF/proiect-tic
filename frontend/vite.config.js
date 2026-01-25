import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // --- ADAUGĂ ACEASTĂ SECȚIUNE ---
  server: {
    proxy: {
      // Direcționează cererile API către backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Direcționează cererile de imagini către backend
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
  // ------------------------------
})