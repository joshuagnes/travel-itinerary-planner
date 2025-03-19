import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/travel-itinerary-planner",
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});


