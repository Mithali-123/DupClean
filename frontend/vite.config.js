import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Force relative paths
  build: {
    emptyOutDir: true, // Cleans the old broken files before building
    outDir: 'dist'
  }
})