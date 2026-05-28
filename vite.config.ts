import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pugPlugin from 'vite-plugin-pug'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), pugPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: '/mind-reading/',
  publicDir: 'src/asset/public'
})