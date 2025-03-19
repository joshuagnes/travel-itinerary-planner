import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/DEV209_FinalProject",
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});


