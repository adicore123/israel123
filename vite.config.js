import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    script: 'async',
    includedRoutes(paths) {
      return paths.filter(p => !['/service', '/servvice', '/logs'].includes(p));
    },
  },
  preview: {
    host: true,
    port: Number(process.env.PORT) || 4173,
  },
});
