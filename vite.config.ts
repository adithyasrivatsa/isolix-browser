import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    strictPort: true
  },
  define: {
    'process.env.VITE_DEV_SERVER_URL': command === 'serve'
      ? JSON.stringify('http://localhost:5173')
      : 'undefined'
  }
}))
