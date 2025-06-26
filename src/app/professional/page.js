// app/customer/page.js
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
const ProfessionalPage = () => {
  const router = useRouter();
  const { userData, isLoading } = useDashboard();

  useEffect(() => {
    if (!isLoading) {
      if (!userData?.token || userData.role !== 'professional') {
        router.push('/login'); // Redirect if not a professional
      }
    }
  }, [isLoading, userData, router]);

  if (isLoading) return <p>Loading...</p>;

  if (!userData || userData.role !== 'professional') return null;

  return (
    <div>
      <h1>Professional Page</h1>
      {/* Your customer-specific content here */}
    </div>
  );
};

export default ProfessionalPage;
