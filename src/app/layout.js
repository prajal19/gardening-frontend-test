import { Inter } from 'next/font/google';
import './globals.css';
import { DashboardProvider } from '../contexts/DashboardContext';
import { TenantProvider } from '../contexts/TenantContext';
import LayoutWrapper from '../components/layout/LayoutWrapper'; // client component
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Gildordo Rochin",
  description: "Professional landscaping and lawn care services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TenantProvider>
          <DashboardProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </DashboardProvider>
        </TenantProvider>
        <Toaster position="top-center" />
        <Footer/>
      </body>
    </html>
  );
}
