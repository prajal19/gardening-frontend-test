'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/admin/AdminLayout';
import Dashboard from '../../components/admin/Dashboard';
import { useDashboard } from '@/contexts/DashboardContext';
const AdminPage = () => {

  const router = useRouter();
  const { userData, isLoading } = useDashboard();

  useEffect(() => {
    if (!isLoading) {
      if (!userData?.role) {
        router.push('/login');
      } else if (userData.role !== 'admin' && userData.role !== 'tenantAdmin') {
        router.push('/login');
      }
    }
  }, [isLoading, userData, router]);

  if (isLoading) return <p>Loading...</p>;

  if (userData?.role !== 'admin' && userData?.role !== 'tenantAdmin') return null;

  // useEffect(() => {
  //   // Get token from both storage locations
  //   const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  //   setToken(storedToken || 'No token found');
  // }, []);

  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default AdminPage; 