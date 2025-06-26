'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomerLayout from '../../components/customer/CustomerLayout';
import Customer from '../../components/customer/Customer';
import { useDashboard } from '../../contexts/DashboardContext';

const CustomerPage = () => {
  const router = useRouter();
  const { userData, isLoading } = useDashboard();

  useEffect(() => {
    // Wait until loading is complete before checking role
    if (!isLoading) {
      // Redirect if no user or not a customer
      if (!userData?.token || (userData.role !== 'customer' && userData.role !== 'tenantAdmin')) {
        router.push('/login');
      }
    }
  }, [isLoading, userData, router]);

  // While loading context, show a loading message
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Customer Dashboard...</p>
        </div>
      </div>
    );
  }

  // Prevent rendering while redirecting
  if (!userData || (userData.role !== 'customer' && userData.role !== 'tenantAdmin')) {
    return null;
  }

  // Render content for 'customer' role
  return (
    <CustomerLayout>
      <Customer />
    </CustomerLayout>
  );
};

export default CustomerPage;
