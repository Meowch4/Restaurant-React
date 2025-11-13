import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api':{
        target: 'http://localhost:5002/',
        changeOrigin: true,
      },
      '/upload': 'http://localhost:5002/',
      '/restaurant': {
        target: 'http://localhost:5002/',
        ws: true,
      },
      '/desk': {
        target: 'http://localhost:5002/',
        ws: true,
      }
    }
  }
})
