import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/cdn/',
  build: {
    outDir: 'dist/cdn',
    emptyOutDir: true
  }
})
