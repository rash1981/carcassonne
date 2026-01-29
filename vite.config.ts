import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for flexible deployment
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate a static app optimized for production
    rollupOptions: {
      output: {
        manualChunks: undefined, // Keep it simple for a small app
      },
    },
  },
})
