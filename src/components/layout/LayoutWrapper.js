'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import TenantHeader from './TenantHeader';
import Footer from './Footer';
import { useTenant } from '../../contexts/TenantContext';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const { subdomain, isClient } = useTenant();
  
  const noHeaderPaths = [
    '/customers',
    '/customers/services',
    '/customers/appointments',
    '/customers/settings',
    '/super-admin',
  ];

  // Check if the pathname starts with '/customers/services' (dynamic path handling)
  const showHeader = !noHeaderPaths.some((path) => pathname.startsWith(path));

  // Use tenant header if we have a subdomain and not in super admin area
  // Only after client-side hydration to prevent SSR mismatch
  const shouldUseTenantHeader = isClient && subdomain && !pathname.startsWith('/super-admin') && !pathname.startsWith('/admin');

  return (
    <>
      {showHeader && (
        shouldUseTenantHeader ? <TenantHeader /> : <Header />
      )}
      {children}
      {!pathname.startsWith('/super-admin') && <Footer />}
    </>
  );
}

