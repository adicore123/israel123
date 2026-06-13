import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * SPA — ניתוב לקוח (React Router) מוגדר ב-src/main.jsx:
 *   /  |  /terms  |  /privacy  |  /accessibility
 * אחסון סטטי בפרודקשן דורש הפניה של כל הנתיבים ל-index.html בצד השרת.
 */
export default defineConfig({
  base: '/',
  appType: 'spa',
  plugins: [react()],
  build: {
    minify: false,
  },
  preview: {
    host: true,
    port: Number(process.env.PORT) || 4173,
  },
});
