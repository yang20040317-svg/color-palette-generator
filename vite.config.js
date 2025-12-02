import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // 明确指定根目录
  server: {
    port: 3001,
    open: true
  },
  // 明确指定入口文件
  build: {
    rollupOptions: {
      input: './index.html'
    }
  }
})
