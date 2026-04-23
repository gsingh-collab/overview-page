import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/overview-page/' : '/',
  plugins: [react()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
    host: true,
  },
});
