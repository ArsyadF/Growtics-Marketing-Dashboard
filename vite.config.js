import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        index: "index.html"
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 2. Daftarkan alias @ mengarah ke folder src
    }
  },
})
