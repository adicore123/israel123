import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes.jsx';
import './index.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

if (typeof window !== 'undefined') {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-out-cubic',
  });
}

export const createRoot = ViteReactSSG({ routes });
