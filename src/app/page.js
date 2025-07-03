'use client';
import Hero from '../components/home/Hero';
import ServicesGrid from '../components/home/ServicesGrid';
import Testimonials from '../components/home/Testimonials';
import Gallery from '../components/home/Gallery';
import ContactForm from '../components/home/ContactForm';
import Footer from '@/components/layout/Footer';
import { useEffect, useState } from 'react';

function isMainDomain() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN;
  if (!mainDomain) return false;
  // Remove www. from both host and mainDomain for comparison
  const cleanHost = host.replace(/^www\./, '');
  const cleanMain = mainDomain.replace(/^www\./, '');
  // True if host is exactly the main domain, or www/main domain, or localhost
  return (
    cleanHost === cleanMain ||
    host === mainDomain ||
    host === 'www.' + cleanMain ||
    host === 'localhost' ||
    host.endsWith('.' + cleanMain)
  );
}

console.log(isMainDomain());
console.log(process.env.NEXT_PUBLIC_MAIN_DOMAIN);
export default function Home() {
  const [showTenantContent, setShowTenantContent] = useState(undefined);

  useEffect(() => {
    setShowTenantContent(!isMainDomain());
  }, []);

  if (showTenantContent === undefined) {
    // Prevent hydration mismatch: render nothing until client-side check is done
    return null;
  }

  return (
    <>
      <Hero />
      {showTenantContent && <ServicesGrid />}
      {showTenantContent && <Gallery />}
      <Testimonials />
      <ContactForm />
      {/* <Footer/> */}
      {!showTenantContent && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <p>Welcome to our platform. Please visit a tenant site to view services and portfolio.</p>
        </div>
      )}
    </>
  );
}
