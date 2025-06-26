import Hero from '../components/home/Hero';
import ServicesGrid from '../components/home/ServicesGrid';
import Testimonials from '../components/home/Testimonials';
import Gallery from '../components/home/Gallery';
import ContactForm from '../components/home/ContactForm';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Gallery />
      <Testimonials />
      <ContactForm />
      {/* <Footer/> */}
    </>
  );
}
