import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Keep icon, map, and chart packages on the app's single React instance.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
