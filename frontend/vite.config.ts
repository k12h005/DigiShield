import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The frontend/ folder shares node_modules with the project root via a junction
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
