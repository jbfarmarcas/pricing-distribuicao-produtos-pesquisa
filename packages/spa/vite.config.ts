import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@distribuicao/core': path.resolve(__dirname, '../core/src/lib.ts')
    }
  },
  optimizeDeps: {
    exclude: ['@distribuicao/core']
  }
})
