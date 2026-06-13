import { HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <HelmetProvider>
      <Outlet />
    </HelmetProvider>
  );
}
