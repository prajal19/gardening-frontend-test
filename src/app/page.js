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
  return host === mainDomain || host === 'localhost';
}

export default function Home() {
  const [showTenantContent, setShowTenantContent] = useState(false);

  useEffect(() => {
    setShowTenantContent(!isMainDomain());
  }, []);

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
          {/* <p>Welcome to our platform. Please visit a tenant site to view services.</p> */}
        </div>
      )}
    </>
  );
}
