import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// ...existing code...

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
